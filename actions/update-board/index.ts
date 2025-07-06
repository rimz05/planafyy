"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";


const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { title, id } = data;

  let board;

  try {
     board = await db.board.update({
      where:{
        id,
        orgId,
      },
      data:{
        title,
      }
      })
    } catch (error) {
    return { error: "Failed to update board" };
  }

  revalidatePath(`/board/${id}`)

  return {data: board}
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
