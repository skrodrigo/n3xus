import { Hono } from 'hono';
import type Stripe from 'stripe';
import { stripe } from './../common/stripe.js';
import { env } from './../common/env.js';
import { stripeService } from './../services/stripe.service.js';

const webhookRouter = new Hono();

webhookRouter.post('/stripe', async (c) => {
  const sig = c.req.header('stripe-signature');
  if (!sig) return c.text('Missing stripe-signature', 400);

  const rawBody = await c.req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return c.text('Invalid signature', 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    if (subId) {
      const sub = await stripe.subscriptions.retrieve(subId, { expand: ['items.data.price'] });
      await stripeService.upsertSubscriptionFromStripe(sub);
    }
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const sub = event.data.object as Stripe.Subscription;
    await stripeService.upsertSubscriptionFromStripe(sub);
  }

  return c.json({ received: true }, 200);
});

export default webhookRouter;
