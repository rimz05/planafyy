"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreatBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/prisma/create-audit-log";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const canCreate = await hasAvailableCount();

  if(!canCreate){
    return{
      error:"You have reached your limit of free boards. Please upgrade to create more"
    }
  }

  const { title, image } = data;

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName
  ] = image.split("|");



  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: "Missing field, Failed to create Board"
    };
  }

  try {
    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      }
    });

    await incrementAvailableCount()

    await createAuditLog({
          entityTitle: board.title,
          entityId: board.id,
          entityType: ENTITY_TYPE.BOARD,
          action: ACTION.CREATE,
        })

    revalidatePath(`/board/${board.id}`);
    return { data: board };
  } catch (error) {
    return { error: "Failed to create board" };
  }
};

export const createBoard = createSafeAction(CreatBoard, handler);
