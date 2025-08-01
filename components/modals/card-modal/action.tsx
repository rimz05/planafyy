"use client"

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types"
import { error } from "console";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface ActionProps {
    data: CardWithList;
}
export const Action = ({
    data,
}:ActionProps) =>{
    const params = useParams();
    const cardModal = useCardModal();

    const {execute: executeCopyCard, isLoading: isLoadingCopy} = useAction(copyCard, {
        onSuccess: (data) =>{
            toast.success(`Card "${data.title}" copied`);
            cardModal.onClose();
        },
        onError:(error) =>{
            toast.error(error)
        }
    })

    const {execute: executeDeleteCard, isLoading:isLoadingDelete } = useAction(deleteCard, {
        onSuccess: (data) =>{
            toast.success(`Card "${data.title}" deleted`);
            cardModal.onClose();
        },
        onError:(error) =>{
            toast.error(error)
        }
    })

    const onCopy = () =>{
        const boardId = params.boardId as string;

        executeCopyCard({
            id: data.id,
            boardId
        })
    }

    const onDelete = () =>{
        const boardId = params.boardId as string;

        executeDeleteCard({
            id: data.id,
            boardId
        })
    }

    return(
        <div className="space-y-2 mt-2">
            <p className="text-sm font-semibold">
                Action
            </p>
            <Button
            onClick={onCopy}
            disabled={isLoadingCopy}
            variant="gray"
            className="w-full justify-start"
            size="inline">
                <Copy className="h-4 w-4 mr-2"/>
                Copy
            </Button>

            <Button
            onClick={onDelete}
            disabled={isLoadingDelete}
            variant="gray"
            className="w-full justify-start"
            size="inline">
                <Trash className="h-4 w-4 mr-2"/>
                Delete
            </Button>
        </div>
    )
}

Action.Skeleton = function ActionSkeleton() {
    return(
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
        </div>
    )
}