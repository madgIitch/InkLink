import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config';

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Authentication service
 * Handles all Firebase Authentication operations
 */
export const authService = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async ({ email, password, displayName }: SignUpData): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    return user;
  },

  /**
   * Sign in with email and password
   */
  signIn: async ({ email, password }: SignInData): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  /**
   * Send password reset email
   */
  resetPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Get current user
   */
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },
};
