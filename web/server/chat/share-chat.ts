'use server';

import { getUserSession } from "@/server/user/get-session";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Chat } from "@/app/generated/prisma";

export async function shareChat(id: Chat['id']) {
  try {
    const { success, data } = await getUserSession();

    if (!success || !data?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: data.user.id,
      },
    });

    if (!chat) {
      return { success: false, error: 'Chat not found' };
    }

    const sharePath = chat.sharePath ?? nanoid(8);

    const updatedChat = await prisma.chat.update({
      where: { id },
      data: {
        isPublic: true,
        sharePath: sharePath,
      },
    });

    revalidatePath(`/chat/${id}`);
    return { success: true, data: updatedChat };
  } catch (error) {
    return { success: false, error: 'Failed to share chat.' };
  }
}