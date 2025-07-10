"use client"

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client"
import { error } from "console";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-option";

interface ListHeaderProps{
    data:List;
    onAddCard : () => void
}
export const ListHeader = ({
    data,
    onAddCard,
}: ListHeaderProps) => {

    const [title , setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disabledEditing = () =>{
        setIsEditing(false);
    }

    const {execute} = useAction(updateList,{
        onSuccess:(data) =>{
            toast.success(`Renamed to ${data.title}`)
            setTitle(data.title);
            disabledEditing();
        },
        onError: (error) =>{
            toast.error(error);
        }
    })

    const handleSubmit = (FormData : FormData) =>{
        const title = FormData.get("title") as string;
        const id = FormData.get("id") as string;
        const boardId = FormData.get("boardId") as string;

        if(title === data.title){
            return disabledEditing();
        }

        execute({
            title,
            id,
            boardId
        })
    }

    const onBlur = () =>{
        formRef.current?.requestSubmit()
    }

    const onKeyDown = (e:KeyboardEvent) =>{
        if(e.key === "Escape"){
            formRef.current?.requestSubmit();
        }
    }
 
    useEventListener("keydown", onKeyDown)
    
  return (
    <div className="w-full pt-2 text-sm font-semibold flex justify-center items-center gap-x-2 px-1 ">
        {isEditing ?(
            <form
            ref = {formRef}
            action={handleSubmit}
            className = "flex-1 px-[2px]">
                <input hidden id = "id" name="id" value={data.id}/>
                <input hidden id = "boardId" name="boardId" value={data.boardId}/>
                <FormInput
                ref = {inputRef}
                onBlur={onBlur}
                id="title"
                placeholder = "Enter list title"
                defaultValue ={title}
                className="w-full text-sm px-[7px] h-7 font-medium border-transparent py-1 hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white text-left"
                />
                <button type="submit" hidden/>
            </form>
        ):(
         <div 
         onClick={enableEditing}
         className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent ">
            {data.title}
        </div>
        )}
        <ListOptions
        onAddCard = {enableEditing}
        data = {data}/>
    </div>
  )
}
