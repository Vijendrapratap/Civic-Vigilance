/**
 * Firebase Configuration and Initialization (OPTIONAL/LEGACY)
 *
 * ⚠️ NOTE: Supabase is the RECOMMENDED backend for CivicVigilance.
 * See SUPABASE_SETUP.md for setup instructions.
 *
 * Firebase support is maintained for:
 * - Legacy deployments
 * - Users who prefer Firebase over Supabase
 * - Backward compatibility
 *
 * If you want to use Firebase instead of Supabase:
 * 1. Set EXPO_PUBLIC_BACKEND_MODE=firebase in .env
 * 2. Follow setup guide: docs/setup/firebase/FIREBASE_BACKEND_SETUP.md
 *
 * Environment variables required in .env:
 * - EXPO_PUBLIC_FIREBASE_API_KEY
 * - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID
 * - EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - EXPO_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Load Firebase configuration from environment variables
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

/**
 * Check if Firebase is properly configured
 * Requires at minimum: API key, Project ID, and App ID
 */
export const isFirebaseConfigured = Boolean(apiKey && projectId && appId);

/**
 * Public Firebase configuration (safe to expose)
 * Used for Firebase SDK initialization
 */
export const firebaseConfigPublic = isFirebaseConfigured
  ? { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }
  : null;

// Firebase service instances (initialized below if configured)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

/**
 * Initialize Firebase services
 *
 * This runs immediately when the module is imported.
 * Services are only initialized if Firebase is properly configured.
 */
if (isFirebaseConfigured) {
  try {
    const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };

    // Initialize Firebase app (or get existing instance)
    app = getApps().length > 0 ? getApps()[0] : initializeApp(config);

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    console.log('[Firebase] Successfully initialized with project:', projectId);
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
} else {
  console.warn(
    '[Firebase] Not configured. Set EXPO_PUBLIC_FIREBASE_* variables in .env file.\n' +
    'See FIREBASE_SETUP.md for setup instructions.'
  );
}

/**
 * Export Firebase services and authentication methods
 *
 * Usage:
 * ```typescript
 * import { auth, db, storage } from './lib/firebase';
 *
 * // Use in your components
 * if (auth && db) {
 *   // Firebase is ready
 * }
 * ```
 */
export {
  app,
  auth,
  db,
  storage,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fbSignOut,
};
