import { Chat } from './chat';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Chat key={id} chatId={id} initialMessages={[] as any[]} />;
}
