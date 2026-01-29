import type { MiddlewareHandler } from 'hono';

export function cors(options?: { origin?: string }) {
  const origin = options?.origin ?? '*';

  const middleware: MiddlewareHandler = async (c, next) => {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }

    await next();
  };

  return middleware;
}
