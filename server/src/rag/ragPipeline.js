import { extractText } from './documentLoader.js';
import { splitText } from './textSplitter.js';
import { embed } from './embeddingService.js';
import { deleteDocument, search, upsertChunks } from './vectorStore.js';
import DocumentChunk from '../models/DocumentChunk.js';
import { generateAnswer } from '../ai/llmService.js';

export async function indexDocument(document) {
  const text = await extractText(document.filePath, document.fileType);
  const chunks = splitText(text);
  if (!chunks.length) throw new Error('No readable text was found in this document');
  await deleteDocument(document._id);
  await DocumentChunk.deleteMany({ documentId: document._id });
  const vectors = await embed(chunks.map(chunk => chunk.content));
  const records = chunks.map((chunk, index) => ({
    id: `${document._id}-${index}`,
    embedding: vectors[index], content: chunk.content,
    metadata: { documentId: String(document._id), documentName: document.name, pageNumber: chunk.pageNumber, category: document.category || '', department: document.department || '', version: document.version }
  }));
  await upsertChunks(records);
  await DocumentChunk.insertMany(records.map(record => ({ documentId: document._id, chunkId: record.id, content: record.content, pageNumber: record.metadata.pageNumber, metadata: record.metadata, vectorId: record.id })));
  return records.length;
}

export async function answerQuestion(question, history = []) {
  const [queryEmbedding] = await embed([question]);
  const result = await search(queryEmbedding, 5);
  const documents = result.documents?.[0] || [];
  const metadatas = result.metadatas?.[0] || [];
  if (!documents.length) return { answer: "I couldn't find this information in the college knowledge base. Please contact the college administration for accurate information.", sources: [], retrievalMetadata: { count: 0 } };
  const context = documents.map((content, index) => `[${index + 1}] ${content}\nSource: ${metadatas[index]?.documentName || 'College document'}, page ${metadatas[index]?.pageNumber || 'unknown'}`).join('\n\n');
  const answer = await generateAnswer([
    { role: 'system', content: 'You are a college information assistant. Answer only from the supplied college knowledge context. If the context does not support an answer, say you could not find it in the college knowledge base. Never invent dates, fees, policies, or eligibility criteria. Cite sources as [1], [2].' },
    ...history.slice(-6).map(message => ({ role: message.role, content: message.content })),
    { role: 'user', content: `College knowledge context:\n${context}\n\nQuestion: ${question}` }
  ]);
  return { answer, sources: metadatas.map((metadata, index) => ({ ...metadata, excerpt: documents[index].slice(0, 180) })), retrievalMetadata: { count: documents.length } };
}
