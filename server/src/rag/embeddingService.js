import OpenAI from 'openai';
import { env } from '../config/env.js';

const client = env.openAiKey ? new OpenAI({ apiKey: env.openAiKey }) : null;
export async function embed(texts) {
  if (!client) throw new Error('OPENAI_API_KEY is required for document embeddings and semantic retrieval');
  const response = await client.embeddings.create({ model: env.embeddingModel, input: texts });
  return response.data.sort((a, b) => a.index - b.index).map(item => item.embedding);
}
