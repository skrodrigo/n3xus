import { z } from '@hono/zod-openapi';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  stripeCustomerId: z.string().nullable().optional(),
});
