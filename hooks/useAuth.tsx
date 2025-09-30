import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

type AuthSession = import('@supabase/supabase-js').Session | null;

type AuthContextType = {
  session: AuthSession;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  signUp: (email: string, password: string) => Promise<{ error?: string } | undefined>;
  resetPassword: (email: string) => Promise<{ error?: string } | undefined>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple' | 'facebook' | 'twitter') => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };
    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Keep the session fresh when app returns to foreground
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') await supabase.auth.refreshSession();
    });

    return () => {
      subscription.subscription.unsubscribe();
      sub.remove();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    session,
    isLoading,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
    },
    signUp: async (email, password) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
    },
    resetPassword: async (email) => {
      const redirectTo = Linking.createURL('auth/callback');
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error: error.message };
    },
    signOut: async () => {
      await supabase.auth.signOut();
      await AsyncStorage.clear();
    },
    signInWithProvider: async (provider) => {
      const redirectTo = Linking.createURL('auth/callback');
      await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    }
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

