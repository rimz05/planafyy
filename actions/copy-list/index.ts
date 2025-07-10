"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorised" };
  }

  const { id, boardId } = data;

  let copiedList;

  try {
    const listToCopy = await db.list.findFirst({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    copiedList = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    console.error("Copy list error:", error);
    return { error: "Failed to copy list" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: copiedList };
};

export const copyList = createSafeAction(CopyList, handler);
