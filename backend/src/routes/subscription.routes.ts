import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppVariables } from './routes.js';
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { prisma } from './../common/prisma.js';

const subscriptionRouter = new OpenAPIHono<{ Variables: AppVariables }>();
subscriptionRouter.use('*', authMiddleware);

const getRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Subscription'],
  responses: {
    200: { description: 'Subscription', content: { 'application/json': { schema: z.any() } } },
  },
});

const deleteIncompleteRoute = createRoute({
  method: 'delete',
  path: '/incomplete',
  tags: ['Subscription'],
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.boolean() }) } } },
  },
});

subscriptionRouter.openapi(getRoute, async (c) => {
  const user = c.get('user');
  const subscription = await prisma.subscription.findFirst({
    where: { referenceId: user!.id },
    select: {
      id: true,
      status: true,
      plan: true,
      periodStart: true,
      periodEnd: true,
      cancelAtPeriodEnd: true,
    },
  });
  return c.json(subscription, 200);
});

subscriptionRouter.openapi(deleteIncompleteRoute, async (c) => {
  const user = c.get('user');
  await prisma.subscription.deleteMany({
    where: { referenceId: user!.id, status: 'incomplete' },
  });
  return c.json({ success: true }, 200);
});

export default subscriptionRouter;
