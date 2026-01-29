'use server';

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      return { success: false, error: "Usuário não encontrado." };
    }

    return {
      success: true,
      data: {
        ...session,
        user: currentUser,
      },
      message: "Sessão do usuário obtida com sucesso.",
    };
  } catch (_error) {
    return {
      success: false,
      error: "Ocorreu um erro ao obter a sessão do usuário.",
    };
  }
};