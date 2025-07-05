import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const Board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!Board) {
    notFound();
  }

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Board.imageFullUrl})` }}
    >
      <BoardNavbar data = {Board}/>
      <div className="absolute inset-0 bg-black/40 z-10" />
      <main className="relative z-20 pt-28 h-full w-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
