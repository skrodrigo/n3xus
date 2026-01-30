import app from './../src/routes/routes.js';
import { withPrisma } from './../src/common/prisma.js';
import { serve } from '@hono/node-server';

app.use('*', withPrisma);

if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT);
  serve({ fetch: app.fetch, port });
  console.log(`[backend] Hono server running on http://localhost:${port}`);
}

export const runtime = 'nodejs';

export default app;