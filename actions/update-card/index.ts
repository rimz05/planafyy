"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";


import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { values } from "lodash";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/prisma/create-audit-log";

 
const handler = async (data: InputType):  Promise<ReturnType> => {
  const { userId, orgId} = await auth(); 

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { id, boardId, ...values } = data;

  let card;

  try {
     card = await db.card.update({
      where:{
        id,
        list:{
          board:{
            orgId,
          },
        },
      },
      data:{
        ...values,
      }
      })

     await createAuditLog({
              entityTitle: card.title,
              entityId: card.id,
              entityType: ENTITY_TYPE.CARD,
              action: ACTION.UPDATE,
            })

    } catch (error) {
    return { error: "Failed to update board" };
  }

  revalidatePath(`/board/${boardId}`)

  return {data: card}
};

export const updateCard = createSafeAction(UpdateCard, handler);
