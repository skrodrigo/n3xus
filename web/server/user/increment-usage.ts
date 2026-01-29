'use server';

import { User, UserUsage } from '@/app/generated/prisma';
import { prisma } from '@/lib/prisma';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

export async function incrementUserUsage(userId: User['id']) {
  try {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const startOfWeekDate = startOfWeek(now);
    const startOfMonthDate = startOfMonth(now);

    const userUsage: UserUsage | null = await prisma.userUsage.findUnique({
      where: { userId },
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

  } catch (error) {
    return {
      success: false,
      error: 'Ocorreu um erro ao atualizar o uso.',
    };
  }
}