import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { env } from '../env.js';
import type { ModelProviderFactory } from '../model-types.js';

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const getOpenRouterModel: ModelProviderFactory = (model) => openrouter(model);
