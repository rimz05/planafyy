"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

import { CreateList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";


const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { title, boardId } = data;

  let list;

  try {
    const board = await db.board.findUnique({
      where:{
        id:boardId,
        orgId,
      }
    })

    if(!board){
      return{
        error:"Board not found"
      }
    }

    const lastlist = await db.list.findFirst({
      where:{boardId: boardId},
      orderBy: {order: "desc"},
      select:{order: true}
    })

    const newOrder = lastlist ? lastlist.order+1 :1;

     list = await db.list.create({
          data: {
          title,
          boardId,
          order: newOrder,
        }
      });

    } catch (error) {
    return { error: "Failed to create" };
  }

  revalidatePath(`/board/${boardId}`)

  return {data: list}
};

export const createList = createSafeAction(CreateList, handler);
