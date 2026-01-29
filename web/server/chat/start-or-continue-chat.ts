'use server';

import { revalidatePath } from "next/cache";
import { getUserSession } from "@/server/user/get-session";
import { prisma } from "@/lib/prisma";
import { nanoid } from 'nanoid';
import { incrementUserUsage } from "../user/increment-usage";
import { Chat } from "@/app/generated/prisma";

export async function startOrContinueChat(
  chatId: Chat['id'] | null,
  userMessage: string,
) {
  try {
    const session = await getUserSession();
    if (!session.success || !session.data?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = session.data.user.id;

    let finalChatId = chatId;

    if (finalChatId) {
      const chat = await prisma.chat.findFirst({
        where: { id: finalChatId, userId },
      });

      if (!chat) {
        finalChatId = null;
      }
    }

    if (!finalChatId) {
      const newChat = await prisma.chat.create({
        data: {
          id: nanoid(),
          userId: userId,
          title: userMessage.substring(0, 50),
        },
      });
      finalChatId = newChat.id;
      revalidatePath('/');
    }

    await prisma.message.create({
      data: {
        chatId: finalChatId,
        role: 'user',
        content: userMessage,
      },
    });

    await incrementUserUsage(userId);

    revalidatePath(`/chat/${finalChatId}`);

    return { success: true, chatId: finalChatId };
  } catch (error) {
    return { success: false, error: 'Failed to start or continue chat.' };
  }
}