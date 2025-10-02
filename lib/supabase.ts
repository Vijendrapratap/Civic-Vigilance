import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && anon);

let supabase: SupabaseClient | any;

if (isSupabaseConfigured) {
  supabase = createClient(url as string, anon as string, {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
} else {
  // Prevent crash when env is missing so UI can boot.
  // Any call into the client will behave as a no‑op with empty data.
  console.warn(
    'Supabase env not set. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env to enable auth and data.'
  );
  const ok = <T>(data: T) => ({ data, error: null as any });
  const noop = async () => ({ data: null as any, error: { message: 'Supabase not configured' } });
  const emptySelect = async () => ok<any[]>([]);

  supabase = {
    auth: {
      getSession: async () => ok<{ session: any }>({ session: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: noop,
      signUp: noop,
      resetPasswordForEmail: noop,
      signOut: async () => ok(null),
      refreshSession: async () => ok(null)
    },
    from: (_: string) => ({
      select: emptySelect,
      insert: noop,
      update: noop,
      delete: noop,
      eq: (_col: string, _val: any) => ({ select: emptySelect, order: () => ({ select: emptySelect }), single: async () => ok(null) }),
      order: () => ({ select: emptySelect }),
      single: async () => ok(null),
      limit: () => ({ select: emptySelect })
    })
  } as any;
}

export { supabase };
