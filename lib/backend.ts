/**
 * Backend Configuration - Multi-Backend Support
 *
 * The Civic Vigilance app supports multiple backends:
 * - **Supabase (RECOMMENDED)**: PostgreSQL + PostGIS, better free tier, unlimited reads
 * - Firebase (Optional/Legacy): Firestore + Firebase Auth
 * - SQLite (Development): Local testing without remote backend
 *
 * Set backend via EXPO_PUBLIC_BACKEND_MODE in .env:
 * - 'supabase' (recommended for production)
 * - 'firebase' (optional, legacy support)
 * - 'sqlite' (development only)
 *
 * See SUPABASE_SETUP.md for primary backend setup.
 * See docs/setup/firebase/ for Firebase setup (if needed).
 */

import { isFirebaseConfigured } from './firebase';
import { isSupabaseConfigured } from './supabase';

export type Backend = 'supabase' | 'firebase' | 'sqlite';

/**
 * Get the current backend type
 *
 * Returns the backend specified in EXPO_PUBLIC_BACKEND_MODE env variable.
 * Falls back to 'supabase' (recommended) if not specified.
 *
 * @returns Backend type from environment
 */
export function getBackend(): Backend {
  const mode = process.env.EXPO_PUBLIC_BACKEND_MODE as Backend;
  if (mode === 'sqlite' || mode === 'supabase' || mode === 'firebase') {
    return mode;
  }
  console.warn('[Backend] Invalid backend mode, defaulting to supabase');
  return 'supabase';
}

/**
 * Check if using a remote backend
 *
 * @returns true if using Supabase or Firebase, false for SQLite
 */
export function isRemoteBackend(): boolean {
  const backend = getBackend();
  return backend === 'supabase' || backend === 'firebase';
}

/**
 * Check if the current backend is properly configured
 *
 * @returns true if the selected backend has all required env variables set
 */
export function isBackendConfigured(): boolean {
  const backend = getBackend();
  if (backend === 'supabase') {
    return isSupabaseConfigured;
  }
  if (backend === 'firebase') {
    return isFirebaseConfigured;
  }
  // SQLite doesn't need configuration
  return true;
}
