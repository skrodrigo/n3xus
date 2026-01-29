'use server';

import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/server/user/get-session";
import { User } from "@/app/generated/prisma";

export const updateUserProfile = async (data: User) => {
  try {
    const session = await getUserSession();

    if (!(session.success && session.data?.user?.id)) {
      return {
        success: false,
        error: "Usuário não autenticado para atualização.",
      };
    }

    await prisma.user.update({
      where: {
        id: session.data.user.id,
      },
      data,
    });

    return {
      success: true,
      message: "Perfil atualizado com sucesso.",
      redirect: "/chat",
    };
  } catch (_error) {
    return {
      success: false,
      error: "Ocorreu um erro ao atualizar o perfil.",
    };
  }
};