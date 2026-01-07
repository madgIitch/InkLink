# InkLink

Mobile app built with React Native (Expo) and Supabase.

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

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your Supabase credentials:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

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
├── config/          # App configuration (env, supabase)
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
  - [x] Supabase configuration
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
