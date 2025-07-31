"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";
import { absoluteUrl } from "@/lib/utils";
import { createSafeAction } from "@/lib/create-safe-action";
import { RazorRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (_data: InputType): Promise<ReturnType> => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { error: "Unauthorized" };
  }

  const redirectUrl = absoluteUrl("/payment-success");

  try {
    const order = await razorpay.orders.create({
      amount: 50000, // ₹500.00 = 50000 paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture
      notes: {
        userId,
      },
    });

    const checkoutUrl = `https://checkout.razorpay.com/v1/checkout.js`;

    const paymentPageUrl = `${checkoutUrl}?key=${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}&amount=${order.amount}&currency=INR&name=Plannify&description=One-time Payment&order_id=${order.id}&prefill[email]=${user.emailAddresses[0].emailAddress}&prefill[name]=${user.firstName}&callback_url=${redirectUrl}`;

    return { data: paymentPageUrl };
  } catch (err: any) {
    console.error("[RAZORPAY_ORDER_ERROR]", err);
    return { error: "Failed to create order" };
  }
};

export const razorRedirect = createSafeAction(RazorRedirect, handler);
