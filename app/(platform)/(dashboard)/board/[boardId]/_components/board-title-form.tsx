"use client"

import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client";

interface BoardTitleFormProps {
    data: Board;
}

export const BoardTitleForm = ({
    data,
}:  BoardTitleFormProps) =>{
    return (
        <Button
        variant="transparent"
        className="font-bold text-lg h-auto w-auto p-1 px-2">
            {data.title}
        </Button>
    )
}