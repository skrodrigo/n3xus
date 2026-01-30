import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModel } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getModelProvider(modelValue: string): LanguageModel {
  switch (modelValue) {
    case 'gemini/gemini-2.5-flash':
      return google('gemini-2.5-flash');
    case 'openai/gpt-5-nano':
      return openai('gpt-5-nano');
    case 'openai/gpt-4.1-nano':
      return openai('gpt-4.1-nano');
    case 'deepseek/deepseek-v3':
      return openrouter('deepseek/deepseek-chat-v3-0324:free');
    default:
      return google('gemini-1.5-pro');
  }
}
