"use client";
import { useRef } from "react";

import {  X } from "lucide-react";
import { FormInput } from "./form-input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "./form-submit";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
    const proModal = useProModal();
    const router = useRouter();;
    const closeRef = useRef<HTMLButtonElement>(null);
    
    const {execute , fieldErrors} = useAction(createBoard,{
        onSuccess: (data) =>{
            toast.success("Board Created");
            closeRef.current?.click()
            router.push(`/board/${data.id}`);
        },
        onError: (error) =>{
            toast.error(error);
            proModal.onOpen();
        }
    })

    const onSubmit = (FormData: FormData) => {
        const title = FormData.get("title") as string;
        const image = FormData.get("image") as string;

        execute({ title,image });
    }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create Board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
            <div className="space-y-4">
            <FormPicker
            id="image"
            errors={fieldErrors}
            />
            <FormInput
            id="title"
            label="Board title"
            type="text"
            errors={fieldErrors}/>
            </div>
            <FormSubmit className="w-full">
                Create
            </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
