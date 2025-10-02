import { isFirebaseConfigured } from './firebase';
import { isSupabaseConfigured } from './supabase';

export type Backend = 'firebase' | 'supabase' | 'sqlite';

let override: Backend | null = null;

export function setBackendOverride(mode: Backend | null) {
  override = mode;
}

export function getBackend(): Backend {
  if (override) return override;
  const mode = (process.env.EXPO_PUBLIC_BACKEND_MODE || 'auto').toLowerCase();
  if (mode === 'sqlite') return 'sqlite';
  if (mode === 'firebase') return isFirebaseConfigured ? 'firebase' : 'sqlite';
  if (mode === 'supabase') return isSupabaseConfigured ? 'supabase' : 'sqlite';
  // auto (default)
  if (isFirebaseConfigured) return 'firebase';
  if (isSupabaseConfigured) return 'supabase';
  return 'sqlite';
}

export function isRemoteBackend(): boolean {
  const b = getBackend();
  return b === 'firebase' || b === 'supabase';
}
