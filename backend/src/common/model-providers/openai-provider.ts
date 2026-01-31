import { openai } from '@ai-sdk/openai';
import type { ModelProviderFactory } from '../model-types.js';

export const getOpenAiModel: ModelProviderFactory = (model) => openai(model as any);
