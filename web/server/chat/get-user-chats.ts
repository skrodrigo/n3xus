'use server';

import { prisma } from "@/lib/prisma";
import { Chat } from "@/app/generated/prisma";

export async function getUserChats(userId: Chat['userId']) {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return { success: true, data: chats };
  } catch (error) {
    return { success: false, error: 'Failed to fetch user chats.' };
  }
}
