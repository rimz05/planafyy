// app/api/create-order/route.ts

import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const order = await razorpay.orders.create({
    amount: 50000, // amount in paisa (500.00 INR)
    currency: "INR",
    receipt: "receipt_1",
  });

  return NextResponse.json(order);
}
