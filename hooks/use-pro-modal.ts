import { create } from "zustand";

type ProModalStore = {
    isOpen: boolean;
    onOpen: (id: string)=>void;
    onClose: ()=>void;
}

export const useProModal = create<ProModalStore>((set)=>({
    isOpen: false,
    onOpen:() => set({isOpen: true}),
    onClose: () =>set({isOpen: false}),
}))