"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";


import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";



const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 
  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { items, boardId } = data;
  let updatedCards;

  try {
    const transaction = items.map((card) =>
    db.card.update({
      where:{
        id:card.id,
        list:{
          board: {
          orgId,
        }
      },
      },
      data:{
        order: card.order,
        listId: card.listId,
      }
    }));

    updatedCards = await db.$transaction(transaction)
    } catch (error) {
    return { error: "Failed to create" };
  }

  revalidatePath(`/board/${boardId}`)
  return {data: updatedCards}
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
