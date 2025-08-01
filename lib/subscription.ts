import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return false;
  }

  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
    select: {
      razorSubscriptionId: true,
      razorCurrentPeriodEnd: true,
      razorStatus: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.razorSubscriptionId &&
    orgSubscription.razorStatus === "active" &&
    orgSubscription.razorCurrentPeriodEnd &&
  orgSubscription.razorCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
