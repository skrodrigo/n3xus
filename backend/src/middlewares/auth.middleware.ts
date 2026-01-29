import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import crypto from 'node:crypto';
import { env } from './../common/env.js';
import { prisma } from './../common/prisma.js';

function b64urlToBuffer(input: string) {
  const pad = input.length % 4;
  const normalized = (pad ? input + '='.repeat(4 - pad) : input).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64');
}

function verifyJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerPart, payloadPart, sigPart] = parts;

  const data = `${headerPart}.${payloadPart}`;
  const expectedSig = crypto.createHmac('sha256', env.JWT_SECRET).update(data).digest();
  const providedSig = b64urlToBuffer(sigPart);
  if (providedSig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(providedSig, expectedSig)) return null;

  const payloadJson = b64urlToBuffer(payloadPart).toString('utf8');
  try {
    return JSON.parse(payloadJson) as { userId?: string };
  } catch {
    return null;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Authorization header is missing or malformed' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  const payload = verifyJwt(token);
  if (!payload?.userId) {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new HTTPException(401, { message: 'Invalid user' });
  }

  const { password: _pw, ...userWithoutPassword } = user as any;
  c.set('user', userWithoutPassword);
  await next();
}
