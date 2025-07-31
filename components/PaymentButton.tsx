"use client";

import { useState } from "react";

export function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const res = await fetch("/api/create-order", { method: "POST" });
    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: data.currency,
      name: "Plannify",
      description: "One-time Payment",
      order_id: data.id,
      handler: function (response: any) {
        console.log("Payment Success", response);
        window.location.href = "/payment-success"; // Optional: redirect
      },
      prefill: {
        name: "RIMJHIM",
        email: "rimjhimgarg88@gmail.com",
      },
      theme: {
        color: "#6366f1", // Optional: your brand color
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md"
    >
      {loading ? "Processing..." : "Pay ₹500"}
    </button>
  );
}
