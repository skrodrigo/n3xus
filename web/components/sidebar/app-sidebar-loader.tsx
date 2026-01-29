import { getUserChats } from "@/server/chat/get-user-chats";
import { getUserSession } from "@/server/user/get-session";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { Chat } from "@/app/generated/prisma";

export async function AppSidebarLoader() {
  const { data } = await getUserSession();

  const userId = data?.user.id;

  const chatResult = userId ? await getUserChats(userId) : { success: false, data: [] };
  const chats = chatResult.success ? chatResult.data : [];

  return <AppSidebar chats={chats as Chat[]} />;
}
