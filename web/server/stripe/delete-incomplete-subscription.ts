'use server';

import { prisma } from '@/lib/prisma';

export async function deleteIncompleteSubscription(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    await prisma.subscription.deleteMany({
      where: {
        referenceId: userId,
        status: 'incomplete',
      },
    });
  } catch (error) {
    return {
      success: false,
      error: 'Ocorreu um erro ao atualizar criar a finalização de compra.',
    };
  }
}
