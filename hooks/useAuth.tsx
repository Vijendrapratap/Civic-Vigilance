import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { AppState } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initAuth, signInLocal, signOutLocal, signUpLocal, currentUserLocal } from '../lib/sqliteAuth';
import {
  isFirebaseConfigured,
  auth as fbAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fbSignOut,
} from '../lib/firebase';
import { getBackend, setBackendOverride } from '../lib/backend';

type AuthSession = import('@supabase/supabase-js').Session | null;

type AuthContextType = {
  session: AuthSession;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  signUp: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  resetPassword: (email: string) => Promise<{ error?: string } | undefined>;
  signOut: () => Promise<void>;
  signInGuest?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const backend = getBackend();
      if (backend === 'firebase' && fbAuth) {
        // Firebase: derive a simple session shape from currentUser
        const user = fbAuth.currentUser;
        if (user) setSession({ user: { id: user.uid, email: user.email } } as any);
        setIsLoading(false);
      } else if (backend === 'supabase') {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } else {
        await initAuth();
        const user = await currentUserLocal();
        if (user) setSession({ user } as any);
      }
      if (getBackend() !== 'firebase') setIsLoading(false);
      if (getBackend() === 'sqlite' && process.env.EXPO_PUBLIC_AUTO_GUEST === 'true') {
        const user = await currentUserLocal();
        if (!user) {
          const { ensureSessionUserId } = await import('../lib/sqliteAuth');
          const id = await ensureSessionUserId();
          setSession({ user: { id } } as any);
        }
      }
    };
    init();

    if (getBackend() === 'firebase' && fbAuth) {
      const unsub = onAuthStateChanged(fbAuth, (u: any) => {
        if (u) setSession({ user: { id: u.uid, email: u.email } } as any);
        else setSession(null);
        setIsLoading(false);
      });
      return () => { unsub(); };
    } else if (getBackend() === 'supabase') {
      const { data: subscription } = supabase.auth.onAuthStateChange((_event: any, s: any) => setSession(s));
      const sub = AppState.addEventListener('change', async (state) => { if (state === 'active') await supabase.auth.refreshSession(); });
      return () => { subscription.subscription.unsubscribe(); sub.remove(); };
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    session,
    isLoading,
    signIn: async (email, password) => {
      const backend = getBackend();
      if (backend === 'firebase' && fbAuth) {
        try { await signInWithEmailAndPassword(fbAuth, email, password); }
        catch (e: any) { return { error: e?.message || 'Failed to sign in', code: e?.code }; }
      } else if (backend === 'supabase') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message, code: 'supabase_error' };
      } else {
        const res = await signInLocal(email, password);
        if (res.error) return { error: res.error };
        setSession({ user: res.user } as any);
      }
    },
    signUp: async (email, password) => {
      const backend = getBackend();
      if (backend === 'firebase' && fbAuth) {
        try { await createUserWithEmailAndPassword(fbAuth, email, password); }
        catch (e: any) { return { error: e?.message || 'Failed to sign up', code: e?.code }; }
      } else if (backend === 'supabase') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message, code: 'supabase_error' };
      } else {
        const res = await signUpLocal(email, password);
        if (res.error) return { error: res.error };
        setSession({ user: res.user } as any);
      }
    },
    resetPassword: async (email) => {
      const backend = getBackend();
      if (backend === 'firebase' && fbAuth) {
        try { await sendPasswordResetEmail(fbAuth, email); }
        catch (e: any) { return { error: e?.message || 'Failed to send reset email', code: e?.code }; }
      } else if (backend === 'supabase') {
        const redirectTo = Linking.createURL('auth/callback');
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) return { error: error.message, code: 'supabase_error' };
      }
    },
    signOut: async () => {
      const backend = getBackend();
      if (backend === 'firebase' && fbAuth) await fbSignOut(fbAuth);
      if (backend === 'supabase') await supabase.auth.signOut();
      await signOutLocal();
      setBackendOverride(null);
      setSession(null);
    },
    signInGuest: async () => {
      setBackendOverride('sqlite');
      await initAuth();
      const { ensureSessionUserId } = await import('../lib/sqliteAuth');
      const uid = await ensureSessionUserId();
      setSession({ user: { id: uid, email: 'guest@local' } } as any);
    }
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
