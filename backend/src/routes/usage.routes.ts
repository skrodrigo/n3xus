import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppVariables } from './routes.js';
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { getUserUsage, incrementUserUsage } from './../services/usage.service.js';

const usageRouter = new OpenAPIHono<{ Variables: AppVariables }>();
usageRouter.use('*', authMiddleware);

const getRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Usage'],
  responses: {
    200: { description: 'Usage', content: { 'application/json': { schema: z.any() } } },
  },
});

const incRoute = createRoute({
  method: 'post',
  path: '/increment',
  tags: ['Usage'],
  responses: {
    200: { description: 'Incremented', content: { 'application/json': { schema: z.object({ success: z.boolean() }) } } },
  },
});

usageRouter.openapi(getRoute, async (c) => {
  const user = c.get('user');
  const usage = await getUserUsage(user!.id);
  return c.json(usage, 200);
});

usageRouter.openapi(incRoute, async (c) => {
  const user = c.get('user');
  const result = await incrementUserUsage(user!.id);
  return c.json(result, 200);
});

export default usageRouter;
