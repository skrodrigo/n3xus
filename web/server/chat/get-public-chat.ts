'use server';

import { prisma } from "@/lib/prisma";
import { Chat } from "@/app/generated/prisma";

export async function getPublicChat(sharePath: Chat['sharePath']) {
  try {
    if (!sharePath) {
      return { success: false, error: 'Share path is required' };
    }

    const chat = await prisma.chat.findUnique({
      where: {
        sharePath,
        isPublic: true,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      return { success: false, error: 'Public chat not found' };
    }

    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: 'Failed to fetch public chat.' };
  }
}