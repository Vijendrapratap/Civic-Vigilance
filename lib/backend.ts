/**
 * Backend Configuration
 *
 * The Civic Vigilance app supports multiple backends:
 * - **Supabase (Production)**: PostgreSQL + PostGIS, Google OAuth, Storage
 * - SQLite (Development): Local testing without remote backend
 *
 * Set backend via EXPO_PUBLIC_BACKEND_MODE in .env:
 * - 'supabase' (recommended for production)
 * - 'sqlite' (development only)
 *
 * See SUPABASE_SETUP.md for backend setup.
 */

import { isSupabaseConfigured } from './supabase';

export type Backend = 'supabase' | 'sqlite';

/**
 * Get the current backend type
 *
 * Returns the backend specified in EXPO_PUBLIC_BACKEND_MODE env variable.
 * Falls back to 'supabase' if not specified.
 *
 * @returns Backend type from environment
 */
export function getBackend(): Backend {
  const mode = process.env.EXPO_PUBLIC_BACKEND_MODE as Backend;
  if (mode === 'sqlite' || mode === 'supabase') {
    return mode;
  }
  console.warn('[Backend] Invalid backend mode, defaulting to supabase');
  return 'supabase';
}

/**
 * Check if using a remote backend
 *
 * @returns true if using Supabase, false for SQLite
 */
export function isRemoteBackend(): boolean {
  const backend = getBackend();
  return backend === 'supabase';
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
  // SQLite doesn't need configuration
  return true;
}
