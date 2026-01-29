import { prisma } from './../common/prisma.js';

export const chatRepository = {
  create(userId: string, title: string) {
    return prisma.chat.create({
      data: { userId, title },
    });
  },

  findByIdForUser(chatId: string, userId: string) {
    return prisma.chat.findFirst({
      where: { id: chatId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  },

  findManyForUser(userId: string) {
    return prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  },

  deleteForUser(chatId: string, userId: string) {
    return prisma.chat.deleteMany({
      where: { id: chatId, userId },
    });
  },

  markPublic(chatId: string, userId: string, sharePath: string) {
    return prisma.chat.update({
      where: { id: chatId },
      data: { isPublic: true, sharePath },
    });
  },

  findPublicBySharePath(sharePath: string) {
    return prisma.chat.findUnique({
      where: { sharePath },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  },
};
