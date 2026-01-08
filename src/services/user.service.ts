import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config';
import { User, CreateUserData, UpdateUserData } from '../types';

const USERS_COLLECTION = 'users';

/**
 * User service
 * Handles all Firestore operations for users
 */
export const userService = {
  /**
   * Create a new user document in Firestore
   */
  createUser: async (data: CreateUserData): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, data.uid);

    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Get user by ID
   */
  getUser: async (uid: string): Promise<User | null> => {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      uid: userSnap.id,
      ...userSnap.data(),
    } as User;
  },

  /**
   * Update user data
   */
  updateUser: async (uid: string, data: UpdateUserData): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, uid);

    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Check if user document exists
   */
  userExists: async (uid: string): Promise<boolean> => {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  },
};
