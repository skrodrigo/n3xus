'use server';

import { getUserSession } from "@/server/user/get-session";
import { prisma } from "@/lib/prisma";

export async function getSubscription() {
  const { data } = await getUserSession();

  if (!data?.user?.id) {
    throw new Error('Unauthorized');
  }

  const subscription = await prisma.subscription.findFirst({
    select: {
      id: true,
      status: true,
      plan: true,
      referenceId: true,
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      periodStart: true,
      periodEnd: true,
      cancelAtPeriodEnd: true,
      seats: true,
    },
    where: {
      referenceId: data.user.id,
    },
  });

  return subscription;
}