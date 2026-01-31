import type { LanguageModel } from 'ai';

export type GeminiModelValue = `gemini/${string}`;
export type OpenAiModelValue = `openai/${string}`;
export type KnownModelValue = GeminiModelValue | OpenAiModelValue | 'deepseek/deepseek-v3';
export type ModelValue = KnownModelValue | string;

export type ModelProviderFactory = (model: string) => LanguageModel;
