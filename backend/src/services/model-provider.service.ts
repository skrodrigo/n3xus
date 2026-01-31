import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModel } from 'ai';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getModelProvider(modelValue: string): LanguageModel {
  if (modelValue.startsWith('gemini/')) {
    const googleModel = modelValue.split('/')[1] || 'gemini-2.5-flash';
    return google(googleModel);
  }

  if (modelValue.startsWith('openai/')) {
    const openAiModel = modelValue.split('/')[1] || 'gpt-4.1-nano';
    return openai(openAiModel as any);
  }

  switch (modelValue) {
    case 'deepseek/deepseek-v3':
      return openrouter('deepseek/deepseek-chat-v3-0324:free');
    default:
      return openrouter(modelValue);
  }
}
