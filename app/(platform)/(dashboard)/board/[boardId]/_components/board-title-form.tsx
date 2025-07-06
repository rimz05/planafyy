"use client"

import {useRef, useState } from "react";
import { Board } from "@prisma/client";

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/update-board";
import { toast } from "sonner";
import { error } from "console";

interface BoardTitleFormProps {
    data: Board;
}

export const BoardTitleForm = ({
    data,
}:  BoardTitleFormProps) =>{

    const {execute} = useAction( updateBoard, {

        onSuccess: (data) =>{
            toast.success(`Board "${data.title}" updated!`)
            setTitle(data.title)
            disableEditing();
        },

        onError: (error) =>{
            toast.error(error)
        }
    })

    const formRef = useRef<HTMLFormElement>(null); 
    const inputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title)
    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(() =>{
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () =>{
        setIsEditing(false)
    }

    const onSubmit = (FormData : FormData) =>{
        const title = FormData.get("title") as string
        execute({
            title,
            id: data.id,
        })

    }

    const onBlur = () =>{
        formRef.current?.requestSubmit();
    }

    if(isEditing){
        return(
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput
                ref={inputRef}
                id="title"
                onBlur={onBlur}
                defaultValue={title}
                className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }
    return (
        <Button
        onClick={enableEditing}
        variant="transparent"
        className="font-bold text-lg h-auto w-auto p-1 px-2">
            {title} 
        </Button>
    )
}