import { prisma } from './../common/prisma.js';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

export const DEFAULT_LIMITS = {
  promptsDay: 50,
  promptsWeek: 250,
  promptsMonth: 1000,
};

export async function getUserUsage(userId: string) {
  const limits = DEFAULT_LIMITS;

  const [subscription, usage] = await Promise.all([
    prisma.subscription.findFirst({
      where: { referenceId: userId, status: 'active' },
      select: { id: true },
    }),
    prisma.userUsage.findUnique({
      where: { userId },
      select: {
        dayCount: true,
        weekCount: true,
        monthCount: true,
        dayWindowStart: true,
        weekWindowStart: true,
        monthWindowStart: true,
      },
    }),
  ]);

  const dayCount = usage?.dayCount ?? 0;
  const weekCount = usage?.weekCount ?? 0;
  const monthCount = usage?.monthCount ?? 0;

  const limitReached =
    dayCount >= limits.promptsDay ||
    weekCount >= limits.promptsWeek ||
    monthCount >= limits.promptsMonth;

  return {
    dayCount,
    weekCount,
    monthCount,
    limits,
    limitReached,
    isSubscribed: !!subscription,
  };
}

export async function incrementUserUsage(userId: string) {
  const now = new Date();
  const startOfToday = startOfDay(now);
  const startOfWeekDate = startOfWeek(now);
  const startOfMonthDate = startOfMonth(now);

  const userUsage = await prisma.userUsage.findUnique({
    where: { userId },
    select: {
      dayCount: true,
      weekCount: true,
      monthCount: true,
      dayWindowStart: true,
      weekWindowStart: true,
      monthWindowStart: true,
    },
  });

  const createData = {
    userId,
    dayCount: 1,
    weekCount: 1,
    monthCount: 1,
    dayWindowStart: startOfToday,
    weekWindowStart: startOfWeekDate,
    monthWindowStart: startOfMonthDate,
  };

  const updateData = {
    dayCount: userUsage && userUsage.dayWindowStart < startOfToday ? 1 : { increment: 1 },
    dayWindowStart: startOfToday,
    weekCount: userUsage && userUsage.weekWindowStart < startOfWeekDate ? 1 : { increment: 1 },
    weekWindowStart: startOfWeekDate,
    monthCount: userUsage && userUsage.monthWindowStart < startOfMonthDate ? 1 : { increment: 1 },
    monthWindowStart: startOfMonthDate,
  };

  await prisma.userUsage.upsert({
    where: { userId },
    update: updateData,
    create: createData,
  });

  return { success: true };
}
