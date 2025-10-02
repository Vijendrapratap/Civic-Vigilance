import { isFirebaseConfigured } from './firebase';
import { isSupabaseConfigured } from './supabase';

export type Backend = 'firebase' | 'supabase' | 'sqlite';

export function getBackend(): Backend {
  if (isFirebaseConfigured) return 'firebase';
  if (isSupabaseConfigured) return 'supabase';
  return 'sqlite';
}

