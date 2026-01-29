import { handleChatRequest } from '@/server/chat/handle-chat-request';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    return await handleChatRequest(req);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}