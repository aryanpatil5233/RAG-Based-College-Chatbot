import OpenAI from 'openai';
import { env } from '../config/env.js';
const client = env.openRouterKey ? new OpenAI({ apiKey: env.openRouterKey, baseURL: 'https://openrouter.ai/api/v1', defaultHeaders: { 'HTTP-Referer': env.clientUrl, 'X-Title': 'College Knowledge Assistant' } }) : null;
export async function generateAnswer(messages) {
  if (!client) throw new Error('OPENROUTER_API_KEY is not configured');
  const result = await client.chat.completions.create({ model: env.openRouterModel, messages, temperature: 0.1 });
  return result.choices[0]?.message?.content || 'I could not generate an answer.';
}
