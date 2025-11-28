/**
 * Authentication Hook - Supabase
 *
 * Core Functionality:
 * - Handles user authentication with Supabase
 * - Manages auth state across the app
 * - Provides sign in, sign up, and sign out methods
 *
 * This hook is optimized for the Civic Vigilance app's core mission:
 * connecting citizens with civic authorities via GPS-tagged reports.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// User Session type
interface User {
  id: string;
  email: string | null;
}

interface SimpleSession {
  user: User;
}

type AuthSession = SimpleSession | null;

interface AuthContextType {
  session: AuthSession;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; code?: string } | undefined>;
  signUp: (email: string, password: string) => Promise<{ error?: string; code?: string } | undefined>;
  resetPassword: (email: string) => Promise<{ error?: string; code?: string } | undefined>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * Manages authentication state using Supabase Auth.
 * Listens to auth state changes and updates the session accordingly.
 *
 * Features:
 * - Works on web, iOS, and Android
 * - Built-in security and scalability
 * - Google OAuth support
 * - PostgreSQL backend with PostGIS
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.error('Supabase is not configured. Please check your .env file.');
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }: { data: { session: any } }) => {
      if (supabaseSession) {
        setSession({
          user: {
            id: supabaseSession.user.id,
            email: supabaseSession.user.email ?? null,
          },
        });
      }
      setIsLoading(false);
    });

    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, supabaseSession: any) => {
      if (supabaseSession) {
        // User is signed in
        setSession({
          user: {
            id: supabaseSession.user.id,
            email: supabaseSession.user.email ?? null,
          },
        });
      } else {
        // User is signed out
        setSession(null);
      }
    });

    // Cleanup listener on unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Memoized authentication methods
   *
   * These methods handle Supabase authentication with proper error handling.
   * All errors are caught and returned in a user-friendly format.
   */
  const value = useMemo<AuthContextType>(() => ({
    session,
    isLoading,

    /**
     * Sign in with email and password
     *
     * @param email - User's email address
     * @param password - User's password
     * @returns Error object if sign in fails, undefined if successful
     */
    signIn: async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          return {
            error: error.message || 'Failed to sign in',
            code: error.status?.toString() || 'auth/unknown-error',
          };
        }

        // Session will be updated by onAuthStateChange listener
        return undefined;
      } catch (error: any) {
        console.error('[Auth] Sign in error:', error);
        return {
          error: error?.message || 'Failed to sign in',
          code: 'auth/unknown-error',
        };
      }
    },

    /**
     * Sign up with email and password
     *
     * @param email - User's email address
     * @param password - User's password (min 6 characters)
     * @returns Error object if sign up fails, undefined if successful
     */
    signUp: async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
          return {
            error: error.message || 'Failed to sign up',
            code: error.status?.toString() || 'auth/unknown-error',
          };
        }

        // Session will be updated by onAuthStateChange listener
        return undefined;
      } catch (error: any) {
        console.error('[Auth] Sign up error:', error);
        return {
          error: error?.message || 'Failed to sign up',
          code: 'auth/unknown-error',
        };
      }
    },

    /**
     * Send password reset email
     *
     * @param email - User's email address
     * @returns Error object if request fails, undefined if successful
     */
    resetPassword: async (email: string) => {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          return {
            error: error.message || 'Failed to send reset email',
            code: error.status?.toString() || 'auth/unknown-error',
          };
        }

        return undefined;
      } catch (error: any) {
        console.error('[Auth] Reset password error:', error);
        return {
          error: error?.message || 'Failed to send reset email',
          code: 'auth/unknown-error',
        };
      }
    },

    /**
     * Sign out current user
     */
    signOut: async () => {
      if (!isSupabaseConfigured) {
        console.error('[Auth] Supabase Auth not initialized');
        return;
      }

      try {
        await supabase.auth.signOut();
        // Session will be cleared by onAuthStateChange listener
      } catch (error: any) {
        console.error('[Auth] Sign out error:', error);
        // Clear session anyway
        setSession(null);
      }
    },
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Access authentication state and methods from any component.
 * Must be used within an AuthProvider component.
 *
 * @example
 * ```typescript
 * const { session, signIn, signOut } = useAuth();
 *
 * if (session) {
 *   // User is logged in
 *   console.log('User ID:', session.user.id);
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider component');
  }

  return context;
}
