import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from './env';

/**
 * Firebase Web SDK configuration for Expo
 *
 * Note: We use the Firebase Web SDK (not @react-native-firebase)
 * because it's compatible with Expo managed workflow.
 *
 * To set up:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project (or select existing)
 * 3. Add a Web app (not iOS/Android) - the Web SDK works on mobile with Expo
 * 4. Copy the config values to your .env file
 * 5. Enable Authentication (Email/Password) in Firebase Console
 * 6. Create Firestore Database in test mode
 */
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

// Initialize Firebase only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with AsyncStorage for session persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
