'use server';

import { getUserSession } from "@/server/user/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { User } from "@/app/generated/prisma";

export async function deleteChat(id: User['id']) {
  try {
    const session = await getUserSession();
    if (!session.success || !session.data?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: session.data.user.id,
      },
    });

    if (!chat) {
      return { success: false, error: 'Chat not found' };
    }

    await prisma.chat.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath(`/chat/${id}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete chat.' };
  }
}