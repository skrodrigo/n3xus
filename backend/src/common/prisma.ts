import type { Context, Next } from 'hono';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export { prisma };

export function withPrisma(c: Context, next: Next) {
  if (!c.get('prisma')) {
    c.set('prisma', prisma);
  }
  return next();
}
