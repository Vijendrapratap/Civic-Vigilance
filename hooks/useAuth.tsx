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

type AuthSession = import('@supabase/supabase-js').Session | null;

type AuthContextType = {
  session: AuthSession;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  signUp: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  resetPassword: (email: string) => Promise<{ error?: string } | undefined>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (isFirebaseConfigured && fbAuth) {
        // Firebase: derive a simple session shape from currentUser
        const user = fbAuth.currentUser;
        if (user) setSession({ user: { id: user.uid, email: user.email } } as any);
        setIsLoading(false);
      } else if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } else {
        await initAuth();
        const user = await currentUserLocal();
        if (user) setSession({ user } as any);
      }
      if (!isFirebaseConfigured) setIsLoading(false);
    };
    init();

    if (isFirebaseConfigured && fbAuth) {
      const unsub = onAuthStateChanged(fbAuth, (u: any) => {
        if (u) setSession({ user: { id: u.uid, email: u.email } } as any);
        else setSession(null);
        setIsLoading(false);
      });
      return () => { unsub(); };
    } else if (isSupabaseConfigured) {
      const { data: subscription } = supabase.auth.onAuthStateChange((_event: any, s: any) => setSession(s));
      const sub = AppState.addEventListener('change', async (state) => { if (state === 'active') await supabase.auth.refreshSession(); });
      return () => { subscription.subscription.unsubscribe(); sub.remove(); };
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    session,
    isLoading,
    signIn: async (email, password) => {
      if (isFirebaseConfigured && fbAuth) {
        try { await signInWithEmailAndPassword(fbAuth, email, password); }
        catch (e: any) { return { error: e?.message || 'Failed to sign in' }; }
      } else if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
      } else {
        const res = await signInLocal(email, password);
        if (res.error) return { error: res.error };
        setSession({ user: res.user } as any);
      }
    },
    signUp: async (email, password) => {
      if (isFirebaseConfigured && fbAuth) {
        try { await createUserWithEmailAndPassword(fbAuth, email, password); }
        catch (e: any) { return { error: e?.message || 'Failed to sign up' }; }
      } else if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message };
      } else {
        const res = await signUpLocal(email, password);
        if (res.error) return { error: res.error };
        setSession({ user: res.user } as any);
      }
    },
    resetPassword: async (email) => {
      if (isFirebaseConfigured && fbAuth) {
        try { await sendPasswordResetEmail(fbAuth, email); }
        catch (e: any) { return { error: e?.message || 'Failed to send reset email' }; }
      } else if (isSupabaseConfigured) {
        const redirectTo = Linking.createURL('auth/callback');
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) return { error: error.message };
      }
    },
    signOut: async () => {
      if (isFirebaseConfigured && fbAuth) await fbSignOut(fbAuth);
      if (isSupabaseConfigured) await supabase.auth.signOut();
      await signOutLocal();
      setSession(null);
    }
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
