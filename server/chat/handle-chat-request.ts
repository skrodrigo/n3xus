import 'server-only';

import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { saveAssistantMessage } from "@/server/chat/save-assistant-message";
import { getModelProvider } from "@/server/chat/get-model-provider";
import { getChat } from "@/server/chat/get-chat";
import { getUserSession } from "@/server/user/get-session";
import { getUserUsage } from "@/server/user/get-usage";
import { startOrContinueChat } from "@/server/chat/start-or-continue-chat";

export async function handleChatRequest(req: Request) {

  const session = await getUserSession();

  if (!session.success || !session.data?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = session.data.user.id;

  const body = await req.json();
  const messages = Array.isArray(body?.messages) ? body.messages : body?.messages ?? [];
  const data = body?.data ?? body ?? {};
  const model: string | undefined = data?.model;
  const chatIdFromClient: string | undefined = data?.chatId;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request: messages array is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const usageData = await getUserUsage(userId);

  if (!usageData || usageData.limitReached) {
    return new Response(JSON.stringify({ error: 'Message limit reached' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastMessage = messages[messages.length - 1];
  const messageContent = Array.isArray(lastMessage.parts) ? lastMessage.parts.find((p: any) => p.type === 'text')?.text || '' : lastMessage.content || '';

  const chatResult = await startOrContinueChat(
    chatIdFromClient || null,
    messageContent,
  );

  if (!chatResult.success || !chatResult.chatId) {
    return new Response(JSON.stringify({ error: chatResult.error || 'Failed to create or continue chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const chatId = chatResult.chatId;

  const fullChatResult = await getChat(chatId, userId);

  if (!fullChatResult.success || !fullChatResult.data) {
    return new Response(JSON.stringify({ error: fullChatResult.error || 'Chat not found after creation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const history = fullChatResult.data.messages
    .filter(m => typeof m.content === 'string')
    .map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      parts: [{ type: 'text' as const, text: m.content as string }],
    }));

  const selectedModel = getModelProvider(model || 'gemini/gemini-2.5-flash');

  try {
    const result = streamText({
      model: selectedModel,
      messages: convertToModelMessages(history),
      system:
        'You are a helpful assistant that can answer questions and help with tasks',
      onFinish: async ({ text }) => {
        await saveAssistantMessage(chatId!, text);
      },
    });

    return result.toTextStreamResponse({
      headers: {
        'X-Chat-Id': chatId!,
        'Set-Cookie': `chatId=${chatId!}; Path=/; Max-Age=600; SameSite=Lax`,
      },
    });
  } catch {

    if (model && model !== 'gemini/gemini-2.5-flash') {
      try {
        const fallbackModel = google('gemini-2.5-flash');
        const result = streamText({
          model: fallbackModel,
          messages: convertToModelMessages(history),
          system:
            'You are a helpful assistant that can answer questions and help with tasks',
          onFinish: async ({ text }) => {
            await saveAssistantMessage(chatId!, text);
          },
        });

        return result.toTextStreamResponse({
          headers: {
            'X-Chat-Id': chatId!,
            'Set-Cookie': `chatId=${chatId!}; Path=/; Max-Age=600; SameSite=Lax`,
          },
        });
      } catch { }
    }

    return new Response(
      JSON.stringify({
        error: 'AI service temporarily unavailable. Please try again in a few minutes.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
