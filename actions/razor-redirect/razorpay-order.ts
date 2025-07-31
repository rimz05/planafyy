"use server";

import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async () => {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const order = await razor.orders.create({
      amount: 50000, // ₹500
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return { data: order.id };
  } catch (error) {
    console.error(error);
    return { error: "Order creation failed" };
  }
};
