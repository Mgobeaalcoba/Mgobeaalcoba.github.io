export interface AiModel {
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  color: string;
}

export const FRONTIER_AI_PRICING_VERIFIED_AT = '2026-08-07';

export const FRONTIER_AI_MODELS: AiModel[] = [
  { name: 'GPT-5.6 Sol', provider: 'OpenAI', inputPer1M: 5.00, outputPer1M: 30.00, color: 'text-green-500' },
  { name: 'GPT-5.6 Terra', provider: 'OpenAI', inputPer1M: 2.50, outputPer1M: 15.00, color: 'text-green-400' },
  { name: 'GPT-5.6 Luna', provider: 'OpenAI', inputPer1M: 1.00, outputPer1M: 6.00, color: 'text-green-300' },
  { name: 'Claude Fable 5', provider: 'Anthropic', inputPer1M: 10.00, outputPer1M: 50.00, color: 'text-orange-500' },
  { name: 'Claude Opus 5', provider: 'Anthropic', inputPer1M: 5.00, outputPer1M: 25.00, color: 'text-orange-400' },
  { name: 'Claude Sonnet 5', provider: 'Anthropic', inputPer1M: 2.00, outputPer1M: 10.00, color: 'text-orange-300' },
  { name: 'Gemini 3.1 Pro Preview', provider: 'Google · Alphabet', inputPer1M: 2.00, outputPer1M: 12.00, color: 'text-blue-400' },
  { name: 'Grok 4.5', provider: 'xAI', inputPer1M: 2.00, outputPer1M: 6.00, color: 'text-purple-400' },
];
