import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppVariables } from './routes.js';
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { stripeService } from './../services/stripe.service.js';

const stripeRouter = new OpenAPIHono<{ Variables: AppVariables }>();
stripeRouter.use('*', authMiddleware);

const createCheckoutRoute = createRoute({
  method: 'post',
  path: '/checkout',
  tags: ['Stripe'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            plan: z.enum(['pro_monthly', 'pro_yearly']),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Checkout session',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            url: z.url(),
          }),
        },
      },
    },
  },
});

const portalRoute = createRoute({
  method: 'post',
  path: '/portal',
  tags: ['Stripe'],
  responses: {
    200: {
      description: 'Billing portal session',
      content: {
        'application/json': {
          schema: z.object({
            url: z.url(),
          }),
        },
      },
    },
  },
});

const cancelRoute = createRoute({
  method: 'post',
  path: '/cancel',
  tags: ['Stripe'],
  responses: {
    200: {
      description: 'Canceled',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
  },
});

stripeRouter.openapi(createCheckoutRoute, async (c) => {
  const user = c.get('user') as { id: string };
  const { plan } = c.req.valid('json') as { plan: 'pro_monthly' | 'pro_yearly' };
  return c.json(await stripeService.createSubscriptionCheckoutSession({ userId: user.id, plan }), 200);
});

stripeRouter.openapi(portalRoute, async (c) => {
  const user = c.get('user') as { id: string };
  return c.json(await stripeService.createBillingPortalSession({ userId: user.id }), 200);
});

stripeRouter.openapi(cancelRoute, async (c) => {
  const user = c.get('user') as { id: string };
  return c.json(await stripeService.cancelSubscription({ userId: user.id }), 200);
});

export default stripeRouter;
