import { getPublicChat } from '@/server/chat/get-public-chat';
import { notFound } from 'next/navigation';
import { Conversation, ConversationContent } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function SharedChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: chat } = await getPublicChat(id);

  if (!chat) {
    notFound();
  }

  return (
    <div className="relative flex flex-col h-screen w-full p-4">
      <ScrollArea className="flex-grow overflow-y-auto h-full border rounded-2xl">
        <Conversation className="flex-grow overflow-y-auto w-full max-w-3xl mx-auto h-full">
          <ConversationContent>
            {chat?.messages.map((message) => (
              <div key={message.id}>
                <Message from={message.role as 'user' | 'assistant'}>
                  <MessageContent>
                    {typeof message.content === 'string' && <Response>{message.content}</Response>}
                  </MessageContent>
                </Message>
              </div>
            ))}
          </ConversationContent>
        </Conversation>
      </ScrollArea>
    </div>
  );
}
