import 'dotenv/config';
import { z } from 'zod';

const envVariablesSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  WEB_URL: z.string().min(1),
  API_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number(),
});

export const env = envVariablesSchema.parse(process.env);

export type EnvVariables = z.infer<typeof envVariablesSchema>;
