import type { MiddlewareHandler } from 'hono';

export function cors(options?: { origin?: string; allowCredentials?: boolean }) {
  const allowedOrigin = options?.origin;
  const allowCredentials = options?.allowCredentials ?? false;

  const middleware: MiddlewareHandler = async (c, next) => {
    const requestOrigin = c.req.header('Origin');

    if (!allowedOrigin) {
      c.header('Access-Control-Allow-Origin', '*');
    } else if (requestOrigin && requestOrigin === allowedOrigin) {
      c.header('Access-Control-Allow-Origin', requestOrigin);
      c.header('Vary', 'Origin');
    }

    c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (allowCredentials) {
      c.header('Access-Control-Allow-Credentials', 'true');
    }

    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }

    await next();
  };

  return middleware;
}
