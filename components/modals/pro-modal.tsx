"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Script from "next/script";
import { useTransition } from "react";
import { createRazorpayOrder } from "@/actions/razor-redirect/razorpay-order";

export const ProModal = () => {
  const proModal = useProModal();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const res = await createRazorpayOrder();

      if (res.error) {
        toast.error(res.error);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: 50000,
        currency: "INR",
        name: "Plannify",
        description: "One-time Payment",
        order_id: res.data,
        handler: function (response: any) {
          toast.success("Payment Successful");
          console.log(response);
          // Optionally call your success API or redirect
        },
        prefill: {
          name: "Rimjhim",
          email: "rimjhimgarg88@gmail.com",
        },
        theme: { color: "#6366f1" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="aspect-video relative flex items-center justify-center">
            <Image src="/hero.jpg" alt="hero" fill className="object-cover" />
          </div>
          <div className="text-neutral-700 mx-auto space-y-6 p-6">
            <DialogTitle className="font-semibold text-xl">
              Upgrade to Taskify Pro today
            </DialogTitle>
            <p className="text-xs font-semibold text-neutral-600">
              Explore the best of Taskify
            </p>
            <ul className="pl-4 text-sm list-disc">
              <li>Unlimited Boards</li>
              <li>Advanced Checklists</li>
              <li>Admin and Security Features</li>
              <li>And more!</li>
            </ul>
            <Button
              disabled={isPending}
              onClick={onClick}
              className="w-full"
              variant="primary"
            >
              Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
