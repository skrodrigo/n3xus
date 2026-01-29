import type { Context } from 'hono';
import { handleChatSse } from './chat-core.service.js';

export async function handleChatRequestFromApi(c: Context) {
  return handleChatSse(c);
}
