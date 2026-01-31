import type { MiddlewareHandler } from 'hono';

type Entry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Entry>();

function nowMs() {
  return Date.now();
}

function cleanupExpired(now: number) {
  for (const [k, v] of buckets.entries()) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}

export function rateLimit(options: { windowMs: number; max: number }): MiddlewareHandler {
  const windowMs = options.windowMs;
  const max = options.max;

  return async (c, next) => {
    const now = nowMs();
    cleanupExpired(now);

    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      c.req.header('cf-connecting-ip') ||
      c.req.header('x-real-ip') ||
      'unknown';

    const key = `${ip}:${c.req.path}`;

    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    existing.count += 1;
    if (existing.count > max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      c.header('Retry-After', String(retryAfterSeconds));
      return c.json(
        {
          success: false,
          error: 'Too many requests',
          statusCode: 429,
        },
        429
      );
    }

    await next();
  };
}
