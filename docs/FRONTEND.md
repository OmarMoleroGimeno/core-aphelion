# Frontend Documentation

The frontend is a modern Single Page Application (SPA) built with **Vue 3** and **Vite**. It features a responsive design using **Tailwind CSS** and **PrimeVue** components.

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS & PrimeVue
- **Icons**: PrimeIcons

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable Vue components
├── layouts/         # Layout components (e.g., MainLayout)
├── router/          # Route definitions and navigation guards
├── services/        # API service modules
├── stores/          # Pinia state stores
├── utils/           # Utility functions
└── views/           # Page views (mapped to routes)
```

## Routing

The application uses `vue-router` for navigation.

### Routes

| Path | View | Access | Description |
|------|------|--------|-------------|
| `/login` | `LoginView` | Public | User login page. |
| `/` | `ChatListView` | Private | Redirects to `/chats`. |
| `/chats` | `ChatListView` | Private | List of all chat threads. |
| `/chats/new` | `ChatView` | Private | Interface for starting a new chat. |
| `/chats/:id` | `ChatView` | Private | Interface for a specific chat thread. |
| `/users` | `AdminView` | Admin | User management dashboard. |
| `/knowledge` | `KnowledgeBaseView` | Admin | Document management for RAG. |

### Navigation Guards

- **Global Guard**: Checks for `token` in localStorage.
- **`requiresAuth`**: Redirects to `/login` if no token is present.
- **`requiresAdmin`**: Redirects to `/chats` if user role is not `admin`.

## State Management (Pinia)

### Auth Store (`stores/auth.js`)
Manages user authentication state.
- **State**: `user`, `token`, `image`, `role`.
- **Actions**:
  - `login(email, password)`: Authenticates with backend and saves token.
  - `logout()`: Clears state and localStorage.
- **Persistence**: State is persisted to `localStorage` to survive page reloads.

### Chat Store (`stores/chat.js`)
Manages chat functionality.
- **State**: `messages`, `threads`, `currentRequest`, `isLoading`.
- **Features**:
  - **Caching**: Caches messages per thread to reduce API calls (`messagesCache`).
  - **Lazy Creation**: New threads are created on the backend only when the first message is sent.
  - **Real-time Updates**: Updates UI immediately (optimistic UI) while waiting for backend response.

## Key Components

### `ChatInterface.vue`
The main chat container. Handles message display and user input.

### `MessageBubble.vue`
Renders individual messages. Supports **Markdown** rendering for AI responses.

### `MainLayout.vue`
Provides the application shell, including the sidebar (desktop) or drawer (mobile) navigation.

## Styling

- **Tailwind CSS**: Used for layout, spacing, and typography.
- **Dark Mode**: Fully supported. The theme preference is stored in the `theme` store.
- **PrimeVue**: Used for complex interactive components like Dialogs, Toasts, and Menus.
