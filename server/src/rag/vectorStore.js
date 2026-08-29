import { ChromaClient } from 'chromadb';
import { env } from '../config/env.js';
const client = new ChromaClient({ path: env.chromaUrl });
const collectionName = 'college_knowledge';
export async function collection() { return client.getOrCreateCollection({ name: collectionName, metadata: { 'hnsw:space': 'cosine' } }); }
export async function upsertChunks(items) {
  const col = await collection();
  await col.upsert({ ids: items.map(item => item.id), embeddings: items.map(item => item.embedding), documents: items.map(item => item.content), metadatas: items.map(item => item.metadata) });
}
export async function deleteDocument(documentId) { const col = await collection(); const result = await col.get({ where: { documentId: String(documentId) } }); if (result.ids.length) await col.delete({ ids: result.ids }); }
export async function search(queryEmbedding, limit = 5) { const col = await collection(); return col.query({ queryEmbeddings: [queryEmbedding], nResults: limit }); }
