'use server';

import { getUserSession } from "@/server/user/get-session";
import { prisma } from "@/lib/prisma";
import { subscriptionPlans } from "@/lib/auth";
import { User } from "@/app/generated/prisma";

export async function getUserUsage(id: User['id']) {
  try {
    let finalUserId = id;

    if (!finalUserId) {
      const session = await getUserSession();
      if (!session.success || !session.data?.user?.id) {
        throw new Error("User not authenticated.");
      }
      finalUserId = session.data.user.id;
    }

    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: finalUserId, status: 'active' },
    });

    const plan = subscription
      ? subscriptionPlans.find(p => p.name.toLowerCase() === subscription.plan.toLowerCase())
      : subscriptionPlans[0];

    if (!plan) {
      throw new Error("Subscription plan configuration error.");
    }

    const limits = plan.limits;

    const usage = await prisma.userUsage.findUnique({
      where: { userId: finalUserId },
    });

    const dayCount = usage?.dayCount ?? 0;
    const weekCount = usage?.weekCount ?? 0;
    const monthCount = usage?.monthCount ?? 0;

    const limitReached =
      dayCount >= (limits.promptsDay ?? Infinity) ||
      weekCount >= (limits.promptsWeek ?? Infinity) ||
      monthCount >= (limits.promptsMonth ?? Infinity);

    return {
      dayCount,
      weekCount,
      monthCount,
      limits,
      limitReached,
      isSubscribed: !!subscription,
    };

  } catch (error) {
    return null;
  }
}