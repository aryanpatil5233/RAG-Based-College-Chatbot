RAG-Based College Chatbot
Project Overview & Tech Stack
Project Overview

Build a full-stack AI-powered RAG-Based College Chatbot that allows students to ask questions about college-related information in natural language and receive accurate answers based on an uploaded college knowledge base. The platform must retrieve relevant information from college PDFs, notices, circulars, FAQs, academic documents, admission information, department documents, fee structures, exam information, hostel rules, library resources, placement documents, scholarship information, policies, events, and other institutional resources before generating an answer.

The system must implement a genuine Retrieval-Augmented Generation (RAG) pipeline rather than simply connecting a chatbot to an LLM. Documents must be uploaded, processed, converted into text, divided into meaningful chunks, transformed into embeddings, stored in a vector database, retrieved through semantic similarity search, and supplied as context to the LLM before the final response is generated.

The chatbot must display the sources or references used to generate an answer and clearly inform the student when the requested information cannot be found in the available college knowledge base.

The complete platform must provide authentication, document management, chat history, semantic search, AI-generated responses, source references, database/storage integration, and a working frontend-backend architecture suitable for deployment.

Tech Stack
Frontend: Next.js, React, Tailwind CSS, Axios, Zustand, Lucide React.
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.
AI/LLM: OpenRouter API with support for Google Gemini/OpenAI-compatible models.
RAG Framework: LangChain for document loading, text splitting, embeddings, retrieval, and RAG orchestration.
Vector Database: ChromaDB / Pinecone / Qdrant / FAISS.
Embeddings: OpenAI-compatible embeddings or Google Gemini embeddings.
Document Processing: PDF parsing, document text extraction, chunking, and metadata extraction.
Storage: MongoDB for application data and local/cloud storage for uploaded documents.
Authentication: JWT-based authentication with protected routes.
Real-Time: Optional Socket.IO support for streaming responses and live processing status.
Deployment: Frontend and backend deployable independently with environment-based configuration.
Authentication, Documents, and RAG Orchestration
Authentication

The authentication system must support:

Student registration.
Student login.
Admin login.
JWT-based authentication.
Protected API routes.
/auth/me profile endpoint.
Password hashing using bcrypt.
Persistent authentication state on the client.
Role separation between admin and student.
Logout functionality.
Authentication error handling.

Students should only have access to their own chat history, while administrators should have access to document and knowledge-base management functionality.

Chat Management

Students must be able to:

Ask college-related questions using a chat interface.
View previous conversations.
Continue an existing conversation.
Start a new conversation.
Clear or delete conversations.
Receive answers with source references.
See relevant documents used for the answer.
Ask follow-up questions while maintaining conversation context.
Receive a clear response when information is unavailable.

Example:

Student:

What is the eligibility criteria for B.Tech admission?

System:

Converts question into an embedding.
Searches the vector database.
Retrieves relevant admission document chunks.
Passes the retrieved context to the LLM.
Generates the answer.
Displays the source document/reference.
Document Management
Document Upload

Administrators must be able to upload college documents such as:

PDF files.
DOC/DOCX documents.
Notices.
Circulars.
Academic calendars.
Admission brochures.
Fee structures.
Examination schedules.
Department documents.
Hostel rules.
Library rules.
Scholarship information.
Placement documents.
College policies.
Event information.
FAQs.

The upload system should validate supported file types and file sizes before processing.

Document Processing Pipeline

Every uploaded document must pass through the following pipeline:

Upload → Text Extraction → Cleaning → Chunking → Metadata → Embedding → Vector Database

The processing system must:

Receive the uploaded document.
Extract text from the document.
Clean unnecessary formatting.
Divide the document into meaningful chunks.
Attach metadata to every chunk.
Generate embeddings.
Store embeddings in the vector database.
Store document metadata in MongoDB.
Mark the document as processed.

Each chunk should maintain metadata such as:

Document ID.
Document name.
Page number.
Department.
Category.
Upload date.
Version.
Chunk ID.

This metadata is required to display accurate source references.

RAG Pipeline
Required Retrieval-Augmented Generation Architecture

The core chatbot must implement:

College Documents → Text Extraction → Chunking → Embeddings → Vector Database → Similarity Search → Relevant Context → LLM → Final Answer

Step 1 — User Question

The student enters a question through the chat interface.

Step 2 — Query Embedding

The question is converted into an embedding vector using the configured embedding model.

Step 3 — Vector Search

The embedding is compared against vectors stored in the vector database.

Step 4 — Context Retrieval

The most relevant document chunks are retrieved.

Step 5 — Context Construction

The retrieved chunks are combined with the student's question and conversation context.

Step 6 — LLM Generation

The LLM receives:

Student question.
Retrieved document context.
Conversation history.
System instructions.
Step 7 — Answer Generation

The model generates an answer using the retrieved college information.

Step 8 — Source Display

The system returns the documents/pages used to generate the answer.

Step 9 — Unknown Question Handling

If the retrieval system cannot find sufficiently relevant information, the chatbot must not invent an answer.

It should respond with a clear message such as:

"I couldn't find this information in the college knowledge base. Please contact the college administration for accurate information."

RAG Guardrails

The chatbot must prioritize information retrieved from the college knowledge base.

The system should:

Avoid hallucinating college-specific information.
Use retrieved context when answering.
Refuse to confidently answer unsupported college-specific questions.
Display relevant sources.
Maintain document/page metadata.
Separate retrieved facts from general conversational responses.
Allow administrators to update outdated documents.
AI Workflow

The backend should implement a structured RAG service:

User Question
      ↓
Query Preprocessing
      ↓
Embedding Generation
      ↓
Vector Similarity Search
      ↓
Top-K Relevant Chunks
      ↓
Optional Re-ranking
      ↓
Context Construction
      ↓
Conversation History
      ↓
LLM
      ↓
Answer + Sources
      ↓
Chat History Storage

The RAG service should be independent from HTTP controllers so that it can be reused by different parts of the application.

Vector Database

The vector database must store embeddings generated from college document chunks.

Each vector record should contain:

documentId
chunkId
content
embedding
pageNumber
documentName
category
department
metadata

The system must support:

Similarity search.
Top-K retrieval.
Metadata filtering.
Document deletion.
Document re-indexing.
Updating embeddings when documents change.
Source / Reference Display

Every RAG-generated answer should provide source information whenever available.

Example:

Answer

Students must submit the admission application before the deadline mentioned in the admission notice.

Sources

Admission Guidelines 2026 — Page 4
B.Tech Admission Notice — Page 2

The frontend should allow users to click or expand the source information.

Chat History & Conversation Context

The system must persist conversations.

Each conversation should contain:

User ID.
Conversation title.
Messages.
Message role.
User question.
AI answer.
Sources.
Timestamp.
Retrieval metadata.

The chatbot should use recent conversation history when generating follow-up answers.

Example:

User:

What is the hostel fee?

AI:

The hostel fee is ₹XX according to the hostel fee document.

User:

What about mess charges?

The system should understand that "mess charges" refers to the same hostel-related context.

Admin Document Management

Administrators must have a dedicated document-management interface.

Admin functionality must include:

Upload document.
View documents.
Search documents.
Filter documents.
View processing status.
View document metadata.
Update document metadata.
Delete documents.
Re-process documents.
Re-index documents.
Replace outdated documents.
View document versions.

Document statuses may include:

UPLOADED → PROCESSING → PROCESSED → FAILED

Database Collections
Users

Stores authenticated users.

Fields:

name
email
password
role
createdAt
lastLogin

Roles:

admin | student

Documents

Stores uploaded document information.

Fields:

name
description
fileName
fileType
filePath
category
department
version
status
uploadedBy
uploadedAt
processedAt
DocumentChunks

Stores processed text chunks.

Fields:

documentId
chunkId
content
pageNumber
metadata
vectorId
Conversations

Stores student conversations.

Fields:

userId
title
createdAt
updatedAt
Messages

Stores individual chat messages.

Fields:

conversationId
role
content
sources
retrievalMetadata
createdAt
Feedback

Stores student feedback.

Fields:

messageId
userId
type
comment
createdAt
API Endpoints
Health & Authentication
GET /api/health — System health check.
POST /api/auth/register — Register student account.
POST /api/auth/login — Authenticate user.
GET /api/auth/me — Fetch current user.
POST /api/auth/logout — Logout user.
Chat
POST /api/chat — Ask RAG chatbot a question.
GET /api/chat/conversations — List conversations.
POST /api/chat/conversations — Create conversation.
GET /api/chat/conversations/:id — Fetch conversation.
DELETE /api/chat/conversations/:id — Delete conversation.
DELETE /api/chat/conversations/:id/messages — Clear conversation messages.
Documents
GET /api/documents — List documents.
GET /api/documents/:id — Get document details.
POST /api/documents/upload — Upload document.
PUT /api/documents/:id — Update document metadata.
POST /api/documents/:id/process — Process/re-process document.
POST /api/documents/:id/reindex — Re-index document.
DELETE /api/documents/:id — Delete document.
Sources
GET /api/documents/:id/sources — Retrieve document source information.
GET /api/documents/:id/pages/:page — Retrieve page/source details.
Feedback
POST /api/feedback — Submit answer feedback.
GET /api/feedback — Admin feedback analytics.
Frontend Pages

The application should provide the following pages:

/

Landing page featuring:

College chatbot introduction.
RAG explanation.
Feature overview.
Login/register CTA.
Responsive design.
/login

Login page featuring:

Email.
Password.
Validation.
Error states.
Authentication handling.
/register

Registration page featuring:

Name.
Email.
Password.
Confirm password.
Validation.
/chat

Main student chatbot interface featuring:

Chat messages.
Input box.
Send button.
Streaming response.
Source references.
Suggested questions.
Loading states.
Conversation sidebar.
/chat/[id]

Individual conversation page featuring:

Conversation history.
Follow-up questions.
Sources.
Feedback controls.
Conversation actions.
/documents

Admin document management page featuring:

Document table.
Upload button.
Search.
Filters.
Processing status.
Delete/update controls.
/documents/upload

Document upload page featuring:

Drag-and-drop upload.
File validation.
Metadata form.
Processing progress.
Success/error states.
/admin

Admin dashboard featuring:

Total documents.
Processed documents.
Failed documents.
Total conversations.
Questions answered.
User statistics.
Feedback statistics.
/settings

Settings page featuring:

Profile information.
Account settings.
Security settings.
Theme settings.
Backend Architecture

The backend should follow a clean layered architecture.

Routes

Responsible for:

HTTP routing.
Authentication middleware.
Request validation.
Controller mapping.
Controllers

Responsible only for:

Request parsing.
Calling services.
Response formatting.

Controllers must not directly access MongoDB.

Services

Business logic should be implemented in services such as:

authService.js
chatService.js
documentService.js
ragService.js
embeddingService.js
vectorService.js
conversationService.js
feedbackService.js
RAG Layer

Contains:

Document loader.
Text splitter.
Embedding generator.
Vector store.
Retriever.
Re-ranker.
Prompt builder.
RAG chain.
AI Layer

Contains:

LLM provider.
Prompt templates.
Answer generation.
Unknown-answer handling.
Context management.
Folder Structure
Frontend
client/
└── src/
    ├── components/
    │   ├── AppShell/
    │   ├── Chat/
    │   ├── ChatInput/
    │   ├── ChatMessage/
    │   ├── ConversationSidebar/
    │   ├── SourceReferences/
    │   ├── DocumentUpload/
    │   ├── DocumentTable/
    │   ├── AdminDashboard/
    │   └── ProtectedRoute/
    │
    ├── pages/
    │   ├── _app.js
    │   ├── index.js
    │   ├── login.js
    │   ├── register.js
    │   ├── chat/
    │   │   ├── index.js
    │   │   └── [id].js
    │   ├── documents/
    │   │   ├── index.js
    │   │   └── upload.js
    │   ├── admin.js
    │   └── settings.js
    │
    ├── store/
    │   ├── authStore.js
    │   └── chatStore.js
    │
    └── services/
        ├── api.js
        └── socket.js
Backend Structure
server/
└── src/
    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   └── vectorDb.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── chatRoutes.js
    │   ├── documentRoutes.js
    │   └── feedbackRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── chatController.js
    │   ├── documentController.js
    │   └── feedbackController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── chatService.js
    │   ├── documentService.js
    │   ├── conversationService.js
    │   └── feedbackService.js
    │
    ├── rag/
    │   ├── documentLoader.js
    │   ├── textSplitter.js
    │   ├── embeddingService.js
    │   ├── vectorStore.js
    │   ├── retriever.js
    │   ├── reranker.js
    │   ├── promptBuilder.js
    │   └── ragPipeline.js
    │
    ├── ai/
    │   ├── llmService.js
    │   └── promptTemplates.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Document.js
    │   ├── DocumentChunk.js
    │   ├── Conversation.js
    │   ├── Message.js
    │   └── Feedback.js
    │
    ├── middleware/
    │   ├── auth.js
    │   ├── admin.js
    │   ├── validation.js
    │   └── errorHandler.js
    │
    └── utils/
        ├── fileParser.js
        └── logger.js
Development Phases
Phase 1 — Project Setup & Authentication
Next.js frontend.
Express backend.
MongoDB connection.
JWT authentication.
Student/admin roles.
Zustand authentication store.
AppShell.
Protected routes.
Environment configuration.
Phase 2 — Document Management
Document upload.
File validation.
PDF/document text extraction.
Document metadata.
MongoDB document storage.
Admin document interface.
Processing status.
Phase 3 — RAG Pipeline
Text cleaning.
Chunking.
Metadata creation.
Embedding generation.
Vector database integration.
Similarity search.
Retriever.
Context construction.
Phase 4 — AI Chatbot
LLM integration.
RAG prompt.
Context-aware responses.
Unknown-question handling.
Source/reference generation.
Chat interface.
Conversation history.
Phase 5 — Admin & Knowledge Management
Admin dashboard.
Document update/delete.
Re-processing.
Re-indexing.
Document version management.
Department/category filtering.
Knowledge-base management.
Phase 6 — Advanced Features & Deployment
Streaming responses.
Suggested questions.
Feedback system.
Hybrid search.
Re-ranking.
Multilingual support.
Analytics.
Production deployment.
Performance optimization.
UI & UX Requirements

The interface must use a clean, modern college AI assistant design.

The UI should:

Be fully responsive.
Support desktop and mobile.
Use Tailwind CSS.
Provide dark/light theme support.
Include loading states.
Include skeleton loaders.
Provide clear error messages.
Display chatbot messages clearly.
Show source references below answers.
Display document processing status.
Provide an intuitive admin dashboard.
Support streaming AI responses.
Provide suggested questions.
Include 👍 / 👎 feedback controls.

The chat interface should feel similar to modern AI assistants while maintaining a professional college-information-console design.

Security Requirements

The application must:

Hash passwords using bcrypt.
Protect APIs using JWT.
Restrict admin APIs to administrators.
Validate uploaded files.
Limit upload file size.
Validate all request bodies.
Never expose API keys to the frontend.
Store secrets only in environment variables.
Secure MongoDB credentials.
Prevent unauthorized document access.
Prevent students from modifying the knowledge base.
Sanitize uploaded document metadata.
Apply rate limiting to authentication and chatbot endpoints.
Never expose internal vector database credentials.
Avoid storing sensitive API credentials in logs.

Required environment variables may include:

MONGODB_URI
JWT_SECRET
OPENROUTER_API_KEY
GEMINI_API_KEY
OPENAI_API_KEY
VECTOR_DB_URL
VECTOR_DB_API_KEY
CLIENT_URL
Bonus Features

The following features can be implemented after the core RAG system is working:

Multiple Knowledge Bases

Separate collections for:

Admissions.
Engineering.
MBA.
Hostel.
Library.
Placements.
Examination.
Department-Wise Search

Students can select:

All Departments
CSE
IT
ECE
Mechanical
Civil
Hybrid Search

Combine:

Keyword Search + Semantic Search

to improve retrieval accuracy.

Re-Ranking

Retrieve multiple chunks and use a re-ranking model to select the most relevant context before sending it to the LLM.

Multilingual Chatbot

Support languages such as:

English.
Hindi.
Marathi.
Voice Assistant

Support:

Voice Input → Speech-to-Text → RAG → LLM → Text-to-Speech

Document Versioning

Allow administrators to maintain multiple versions of college documents.

AI FAQ Generation

Automatically generate FAQs from uploaded documents.

Analytics

Admin dashboard can display:

Most asked questions.
Most searched departments.
Most referenced documents.
Failed/unknown questions.
Positive/negative feedback.
Daily/monthly chatbot usage.
Final Expected Outcome

The completed platform must allow a student to ask a college-related question in natural language, retrieve relevant information from the college's uploaded knowledge base, generate an answer using an LLM grounded in that retrieved information, and display the documents/pages used as sources.

The complete flow should be:

Student
   ↓
Chat Interface
   ↓
Question
   ↓
Embedding Generation
   ↓
Vector Database
   ↓
Semantic Search
   ↓
Relevant College Documents
   ↓
Context Construction
   ↓
LLM
   ↓
Grounded Answer
   ↓
Source References
   ↓
Chat History

The final application should feel like a modern AI college information assistant, combining the usability of ChatGPT with a controlled college-specific knowledge base. Most importantly, it must contain a real working RAG pipeline with document processing, embeddings, vector storage, semantic retrieval, contextual generation, and source references, rather than being a simple LLM chatbot.

Codex & AI Agent Implementation Instructions

The AI coding agent must:

Build the application phase by phase.
Follow the defined folder structure.
Keep controllers thin.
Put business logic inside services.
Keep the RAG pipeline modular.
Never call MongoDB directly from controllers.
Never expose API keys to the frontend.
Treat every secret as process.env.
Process every uploaded document through the complete RAG pipeline.
Store chunk metadata with every embedding.
Ensure vector records can be traced back to their source document.
Never generate college-specific answers without retrieved context when the question requires college knowledge.
Clearly handle unknown questions.
Return source references with RAG answers.
Store conversations and messages in MongoDB.
Allow administrators to re-process and re-index documents.
Keep vector database operations isolated inside the vector/RAG layer.
Make the system deployable.
Report the list of files created or changed at the end of every development phase.