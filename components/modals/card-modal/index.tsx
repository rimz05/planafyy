"use client";

import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog";

import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Skeleton } from "@/components/ui/skeleton";
import { Description } from "./description";
import { Action } from "./action";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";
import { useCardModal } from "@/hooks/use-card-modal";


export const CardModal = () =>{
    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state) => state.isOpen);
    const onClose = useCardModal((state) => state.onClose);

    const { data: cardData} = useQuery<CardWithList>({
        queryKey : ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
        enabled: !!id && isOpen,
    })

    const { data: auditLogsData} = useQuery<AuditLog[]>({
        queryKey : ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
        enabled: !!id && isOpen,
    })

    return(
        <Dialog
        open = {isOpen}
        onOpenChange={onClose}
        >
            <DialogContent>
                {!cardData?
                <Header.Skeleton/>:
                <Header data={cardData}/> 
            }

            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                <div className="col-span-3">
                    <div className="w-full space-y-6">
                    {!cardData
                        ?<Description.Skeleton/>
                        : <Description data = {cardData}/>
                    }

                    {!auditLogsData
                        ?<Activity.Skeleton />
                        : <Activity items = {auditLogsData}/>
                    }
                    </div>
                </div>
                {!cardData?
                <Action.Skeleton/>:
                <Action data = {cardData}/>}
            </div>
            </DialogContent>

        </Dialog>
    )
}