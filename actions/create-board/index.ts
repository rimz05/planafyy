"use server"


import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types"
import { CreatBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> =>{

  const { userId } = await auth(); 

  if(!userId){
    return{ error: "Unauthorised"}
  }

  const {title} = data;

  try{
    // throw new Error("blablabla")
     const board = await db.board.create({
      data: {title},
    });

    revalidatePath(`/board/${board.id}`);
    return { data: board };

  }catch(error){
    return{ error: "Failed to create board" };
  }

 
}

export const createBoard = createSafeAction(CreatBoard, handler)
