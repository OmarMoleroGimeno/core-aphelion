# Backend Documentation

The backend is built with **Express.js** and integrates with **Firebase Firestore** for data persistence, **Firebase Authentication** (via custom JWT implementation), **Pinecone** for vector storage, and **OpenAI** for AI capabilities.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Vector Database**: Pinecone
- **AI/LLM**: OpenAI API (GPT-4o / GPT-3.5-turbo)
- **Authentication**: JWT (JSON Web Tokens) & Passport.js (Google OAuth)

## Authentication

The application uses a custom JWT-based authentication system.

- **Middleware**: `authenticateToken` verifies the `Authorization: Bearer <token>` header.
- **Strategies**:
  - **Google OAuth**: Uses `passport-google-oauth20`.
  - **Local Auth**: Email/Password login (managed by Admin).

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/google` | Initiates Google OAuth flow. |
| `GET` | `/api/auth/google/callback` | Callback URL for Google OAuth. Redirects to frontend with token. |
| `POST` | `/api/auth/login` | Login with email and password. Returns JWT. |

### User Management (Admin Only)

Requires `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all registered users. |
| `POST` | `/api/users` | Create a new user manually. |
| `DELETE` | `/api/users/:id` | Delete a user. |
| `PUT` | `/api/users/:id/password` | Update a user's password. |

### Documents (RAG)

Endpoints for managing uploaded documents for Retrieval-Augmented Generation.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List all documents uploaded by the current user. |
| `POST` | `/api/documents` | Upload a PDF file. Extracts text, chunks it, and indexes it in Pinecone. |
| `DELETE` | `/api/documents/:id` | Delete a document and its associated vectors from Pinecone. |

### Chat Threads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/threads` | List all chat threads for the current user. |
| `POST` | `/api/threads` | Create a new chat thread. |
| `PUT` | `/api/threads/:id` | Update a thread's title. |
| `DELETE` | `/api/threads/:id` | Delete a thread and all its messages. |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/threads/:id/messages` | Get all messages for a specific thread. |
| `POST` | `/api/threads/:id/messages` | Send a user message. Triggers RAG search and AI response. |

## RAG Service (`rag.js`)

The Retrieval-Augmented Generation service handles document processing and context retrieval.

1.  **Ingestion**:
    -   **Parsing**: Uses `pdf-parse` to extract text from uploaded PDFs.
    -   **Chunking**: Splits text into chunks of 1000 characters with 200 character overlap.
    -   **Embedding**: Generates embeddings using OpenAI's `text-embedding-3-small` model.
    -   **Indexing**: Upserts vectors to Pinecone with metadata (`userId`, `fileName`, `text`).

2.  **Retrieval**:
    -   When a user sends a message, the query is embedded.
    -   Pinecone is queried for the top 3 most relevant chunks filtered by `userId`.
    -   The retrieved text is injected into the system prompt as context.

## Environment Variables

Required variables in `server/.env`:

```env
PORT=3000
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=...
FIREBASE_PROJECT_ID=...
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```
