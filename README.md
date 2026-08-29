# College / AI

A full-stack RAG-based college chatbot. Students ask questions against an indexed college knowledge base; administrators upload and re-process source documents. The answer path is:

`upload -> text extraction -> cleaning/chunking -> embeddings -> Chroma -> semantic retrieval -> grounded OpenRouter answer -> sources -> MongoDB conversation`

## Requirements

- Node.js 20 or newer and npm
- Docker Desktop (for MongoDB and Chroma)
- An OpenAI API key for embeddings
- An OpenRouter API key for answer generation

## Run locally

1. Open PowerShell in the project folder and install Node.js if `node --version` or `npm --version` is not available.
2. Start local infrastructure:

   ```powershell
   docker compose up -d
   ```

3. Create server configuration:

   ```powershell
   Copy-Item server\.env.example server\.env
   ```

   Edit `server/.env` and set `JWT_SECRET`, `OPENAI_API_KEY`, and `OPENROUTER_API_KEY`. Keep these files private. API keys are only read by the server.

4. Create client configuration:

   ```powershell
   Copy-Item client\.env.local.example client\.env.local
   ```

5. Install dependencies:

   ```powershell
   npm run install:all
   ```

6. Start both applications:

   ```powershell
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The API health check is [http://localhost:4000/api/health](http://localhost:4000/api/health).

## First use

1. Register a student at `/register` and ask a question at `/chat`.
2. Create an admin user manually in MongoDB, or use the server environment values with a seed script when adding production provisioning. The current registration route intentionally creates students only.
3. Sign in as an admin and open `/documents`.
4. Upload a PDF, DOC/DOCX, or text document. It is marked `PROCESSING`, extracted, split with overlap, embedded, indexed in Chroma, stored as traceable chunks in MongoDB, and marked `PROCESSED` or `FAILED`.
5. Ask a question whose answer exists in the uploaded documents. Each answer includes document and page metadata. Unsupported retrieval returns the explicit knowledge-base fallback rather than an invented college-specific answer.

## Project layout

- `client/`: Next.js pages, Zustand session state, Axios API client, and Tailwind styling.
- `server/src/routes/`: protected HTTP routes.
- `server/src/services/`: authentication business logic.
- `server/src/rag/`: loader, splitter, embeddings, Chroma adapter, and RAG orchestration.
- `server/src/models/`: MongoDB collections for users, documents, chunks, and conversations.
- `docker-compose.yml`: local MongoDB and Chroma services.

## Useful commands

```powershell
npm run dev                 # client + API in development
npm run build               # production client build
npm --prefix server start   # API only
npm --prefix client start   # client only, after build
 docker compose down        # stop local infrastructure
```

## Production notes

Use a managed MongoDB/Chroma deployment or private hosted equivalents, set a strong random `JWT_SECRET`, restrict `CLIENT_URL`, put the API behind HTTPS, and move uploaded files to object storage. Add an admin provisioning flow before deployment; do not use the example admin credentials in production.
