import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_rag',
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  chromaUrl: process.env.CHROMA_URL || 'http://127.0.0.1:8000',
  openRouterKey: process.env.OPENROUTER_API_KEY,
  openRouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
  openAiKey: process.env.OPENAI_API_KEY,
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD
};
