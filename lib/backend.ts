/**
 * Backend Configuration - Simplified for Firebase
 *
 * The Civic Vigilance app uses Firebase as its primary backend for:
 * - User authentication (Firebase Auth)
 * - Database (Firestore)
 * - File storage (Firebase Storage)
 * - Server-side logic (Cloud Functions)
 *
 * This simplified backend module removes unnecessary complexity
 * and focuses on the production-ready Firebase implementation.
 */

import { isFirebaseConfigured } from './firebase';

export type Backend = 'firebase' | 'sqlite' | 'supabase';

/**
 * Get the current backend type
 *
 * Returns the backend specified in EXPO_PUBLIC_BACKEND_MODE env variable.
 * Falls back to 'firebase' if not specified.
 *
 * @returns Backend type from environment
 */
export function getBackend(): Backend {
  const mode = process.env.EXPO_PUBLIC_BACKEND_MODE as Backend;
  if (mode === 'sqlite' || mode === 'supabase' || mode === 'firebase') {
    return mode;
  }
  console.warn('[Backend] Invalid backend mode, defaulting to firebase');
  return 'firebase';
}

/**
 * Check if using a remote backend
 *
 * @returns true - Firebase is always a remote backend
 */
export function isRemoteBackend(): boolean {
  return true;
}

/**
 * Check if Firebase is properly configured
 *
 * @returns true if all required Firebase env variables are set
 */
export function isBackendConfigured(): boolean {
  return isFirebaseConfigured;
}
