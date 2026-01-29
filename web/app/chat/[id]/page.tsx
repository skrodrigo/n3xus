import { getChat } from '@/server/chat/get-chat';
import { getUserSession } from "@/server/user/get-session";
import { redirect } from 'next/navigation';
import { UIMessage } from '@ai-sdk/react';
import { Chat } from './chat';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getUserSession();

  if (!session.success || !session.data?.user?.id) {
    redirect('/');
  }

  const chat = await getChat(id, session.data.user.id);

  const initialMessages: UIMessage[] = (chat?.data?.messages ?? [])
    .filter(m => typeof m.content === 'string')
    .map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      parts: [{ type: 'text', text: m.content as string }],
    }));

  return <Chat key={id} chatId={id} initialMessages={initialMessages} />;
}
