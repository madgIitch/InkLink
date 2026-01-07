# InkLink

Mobile app built with React Native (Expo) and Firebase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Add a **Web App** to your project (yes, web app - the Firebase Web SDK works on mobile with Expo)
- Enable **Authentication** → Sign-in method → Email/Password
- Create **Firestore Database** in test mode
- Copy `.env.example` to `.env` and add your Firebase Web App credentials:
  - `EXPO_PUBLIC_FIREBASE_API_KEY`
  - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
  - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `EXPO_PUBLIC_FIREBASE_APP_ID`

## Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run android  # Android
npm run ios      # iOS (macOS only)
npm run web      # Web browser
```

## Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

## Project Structure

```
src/
├── config/          # App configuration (env, firebase)
├── features/        # Feature modules
│   ├── auth/        # Authentication
│   └── home/        # Home feature
├── navigation/      # Navigation setup
├── shared/          # Shared resources
│   ├── components/  # Reusable components (Button, Input, Screen)
│   ├── hooks/       # Custom hooks
│   ├── styles/      # Theme and design tokens
│   └── constants/   # App constants
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Sprint Progress

- [x] Sprint 0 - Setup completed
  - [x] React Native + Expo + TypeScript
  - [x] Feature-based folder structure
  - [x] Firebase configuration (Auth, Firestore, Storage)
  - [x] Environment variables
  - [x] Base UI components (Button, Input, Screen)
  - [x] Theme and design tokens
  - [x] Navigation setup
  - [x] ESLint + Prettier
  - [x] Login screen (dummy)

## Next Steps

- Sprint 1: Authentication + Profile
- Sprint 2: Core Feature v1 (Create + List)
- Sprint 3: Core Feature v2 (Update/Delete + UX)
