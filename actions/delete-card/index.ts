"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";


import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { createAuditLog } from "@/prisma/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id, 
        list: {
          board:{
            orgId,
          }
        }
      }
    })
    await createAuditLog({
          entityTitle: card.title,
          entityId: card.id,
          entityType: ENTITY_TYPE.CARD,
          action: ACTION.DELETE,
        })


  } catch (error) {
    console.error("List Delete error:", error);
    return { error: "Failed to Delete" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction( DeleteCard, handler);
