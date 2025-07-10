"use client"

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { MoreHorizontal, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
    data:List;
    onAddCard:()=>void
}

export const ListOptions = ({
    data,
    onAddCard
}: ListOptionsProps) =>{
    const closeRef = useRef<HTMLButtonElement>(null)

    const { execute: executeDelete} = useAction( deleteList, {
        onSuccess: (data) =>{
            toast.success(`List "${data.title}" deleted`);
            closeRef.current?.click();
        },
        onError: (error) =>{
            toast.error(error)
        }
    });

    const { execute: executeCopy} = useAction( copyList, {
        onSuccess: (data) =>{
            toast.success(`List "${data.title}" copied`);
            closeRef.current?.click();
        },
        onError: (error) =>{
            toast.error(error)
        }
    });

    const onDelete = (formData: FormData) =>{
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeDelete({ id, boardId})
    }

    const onCopy = (formData: FormData) =>{
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeCopy({ id, boardId})
    }


    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontal className="h-4 w-4 "/>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="px-0 pt-3 pb-3 bg-white w-[250px] rounded-md" side= "bottom" align= "start">
                <div className="text-sm font-medium text-center text-neutral-600 py-2 ">
                    List action
                </div>

                <PopoverClose ref = {closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-1 right-1" variant="ghost">
                        <X className ="h-4 w-4"/>
                    </Button>
                </PopoverClose>

                <Button onClick={onAddCard}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm "
                variant="ghost">
                    Add card..
                </Button>
                <form action={onCopy}>
                    <input hidden name="id" id="id" value={data.id}/>
                    <input hidden name="boardId" id="boardId" value={data.boardId}/>
                    <FormSubmit 
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm "
                variant="ghost">
                        Copy List..
                    </FormSubmit>
                </form>
                <Separator/>
                <form
                action={onDelete}
                >
                    <input hidden name="id" id="id" value={data.id}/>
                    <input hidden name="boardId" id="boardId" value={data.boardId}/>
                    <FormSubmit 
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm "
                variant="ghost">
                        Delete List..
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    ) 
}