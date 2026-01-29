import { prisma } from './../common/prisma.js';
import { Prisma } from './../generated/prisma/client.js';

export const messageRepository = {
  create(chatId: string, role: string, content: unknown) {
    return prisma.message.create({
      data: { chatId, role, content: content as Prisma.InputJsonValue },
    });
  },
};
