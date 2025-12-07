# Core Aphelion - Chat Application

A modern chat application built with Vue 3, Firebase, and Express.js featuring dark mode, mobile-responsive design, and real-time messaging.

## Features

- 🎨 **Modern UI**: Built with Vue 3 and PrimeVue components
- 🌙 **Dark Mode**: Full dark mode support with theme persistence
- 📱 **Mobile Responsive**: Drawer navigation for mobile devices
- 🔐 **Authentication**: Firebase Authentication integration
- 💬 **Real-time Chat**: Firestore-powered chat with markdown support
- 🎯 **State Management**: Pinia stores for auth, chat, and theme
- 🚀 **Fast Development**: Vite for lightning-fast HMR

## Documentation

For detailed documentation, please refer to:

- [Frontend Documentation](docs/FRONTEND.md)
- [Backend Documentation](docs/BACKEND.md)

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - State management
- **PrimeVue** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Express.js** - Web server framework
- **Firebase Admin SDK** - Firebase integration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/OmarMoleroGimeno/core-aphelion.git
cd core-aphelion
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Save the downloaded JSON file as `server/serviceAccountKey.json`

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and update the values:

```env
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=your-actual-project-id
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
core-aphelion/
├── src/
│   ├── components/        # Vue components
│   │   ├── ChatInterface.vue
│   │   ├── MessageBubble.vue
│   │   ├── MessageInput.vue
│   │   └── MessageList.vue
│   ├── layouts/          # Layout components
│   │   └── MainLayout.vue
│   ├── stores/           # Pinia stores
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── theme.js
│   ├── views/            # Page views
│   │   ├── ChatView.vue
│   │   ├── LoginView.vue
│   │   └── AdminView.vue
│   ├── router/           # Vue Router
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── server/
│   ├── index.js          # Express server
│   ├── firebase.js       # Firebase configuration
│   ├── database.js       # Database utilities
│   └── .env.example      # Environment variables template
├── public/               # Static assets
└── package.json
```

## Configuration Files

### Required Files (Not in Git)

These files contain sensitive information and must be created locally:

- `server/.env` - Environment variables
- `server/serviceAccountKey.json` - Firebase credentials

### Example Files (In Git)

Template files to help you get started:

- `server/.env.example` - Environment variables template
- `server/serviceAccountKey.example.json` - Service account structure

## Security

⚠️ **Important**: Never commit these files to Git:
- `server/.env`
- `server/serviceAccountKey.json`
- `*.db` (database files)
- `*.log` (log files)

These are already included in `.gitignore`.

## Development

### Frontend Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

```bash
cd server
node index.js        # Start server
```

## Troubleshooting

### Firebase Connection Issues

If you see "Firebase operations will fail" warnings:

1. Verify `server/serviceAccountKey.json` exists and is valid
2. Check that `GOOGLE_APPLICATION_CREDENTIALS` in `.env` points to the correct file
3. Ensure your Firebase project has Firestore enabled

### CORS Errors

Update `CORS_ORIGIN` in `server/.env` to match your frontend URL.

### Port Already in Use

Change the `PORT` in `server/.env` to a different port number.

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
