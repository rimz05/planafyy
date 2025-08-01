"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";


import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";


const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 
  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { items, boardId } = data;
  console.log( items, boardId)
  let lists;

  try {
    const transaction = items.map((list) =>
    db.list.update({
      where:{
        id:list.id,
        board: {
          orgId,
        }
      },
      data:{
        order: list.order
      }
    }));

    lists = await db.$transaction(transaction)
    } catch (error) {
    return { error: "Failed to create" };
  }

  revalidatePath(`/board/${boardId}`)
  return {data: lists}
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
