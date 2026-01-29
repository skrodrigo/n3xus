import { getUserSession } from '@/server/user/get-session';
import { redirect } from 'next/navigation';
import { Chat } from '@/app/chat/[id]/chat';

export default async function Page() {
  const session = await getUserSession();

  if (!session.success || !session.data?.user?.id) {
    redirect('/sign-in');
  }

  return <Chat initialMessages={[]} />;
}
