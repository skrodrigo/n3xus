import type { LanguageModel } from 'ai';
import type { ModelValue } from '../common/model-types.js';
import { getGoogleModel } from '../common/model-providers/google-provider.js';
import { getOpenAiModel } from '../common/model-providers/openai-provider.js';
import { getOpenRouterModel } from '../common/model-providers/openrouter-provider.js';

const GOOGLE_DEFAULT_MODEL = 'gemini-2.5-flash';
const OPENAI_DEFAULT_MODEL = 'gpt-4.1-nano';
const DEEPSEEK_ROUTER_MODEL = 'deepseek/deepseek-chat-v3-0324:free';

export function getModelProvider(modelValue: ModelValue): LanguageModel {
  if (modelValue.startsWith('gemini/')) {
    const googleModel = modelValue.split('/')[1] || GOOGLE_DEFAULT_MODEL;
    return getGoogleModel(googleModel);
  }

  if (modelValue.startsWith('openai/')) {
    const openAiModel = modelValue.split('/')[1] || OPENAI_DEFAULT_MODEL;
    return getOpenAiModel(openAiModel);
  }

  if (modelValue === 'deepseek/deepseek-v3') {
    return getOpenRouterModel(DEEPSEEK_ROUTER_MODEL);
  }

  return getOpenRouterModel(modelValue);
}
