import { create } from "zustand";

type CardModalStore = {
    id: string | null;
    isOpen: boolean;
    onOpen: (id: string)=>void;
    onClose: ()=>void;
}

export const useCardModal = create<CardModalStore>((set)=>({
    id: null,
    isOpen: false,
    onOpen:(id: string) => set({id,isOpen: true}),
    onClose: () =>set({isOpen: false}),
}))