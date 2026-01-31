import { google } from '@ai-sdk/google';
import { env } from '../env.js';
import type { ModelProviderFactory } from '../model-types.js';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && env.GOOGLE_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = env.GOOGLE_API_KEY;
}

export const getGoogleModel: ModelProviderFactory = (model) => google(model);
