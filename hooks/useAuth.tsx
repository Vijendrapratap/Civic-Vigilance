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
import { User as ProfileUser } from '../types';
import * as Crypto from 'expo-crypto';

// User Session type (Auth User)
interface AuthUser {
  id: string;
  email: string | null;
}

interface SimpleSession {
  user: AuthUser;
}

type AuthSession = SimpleSession | null;

interface AuthContextType {
  session: AuthSession;
  profile: ProfileUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; code?: string } | undefined>;
  signInAsGuest: () => Promise<{ error?: string; code?: string } | undefined>;
  signUp: (email: string, password: string) => Promise<{ data?: any; error?: string; code?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; code?: string } | undefined>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth] Error fetching profile:', error);
        return null;
      }
      return data as ProfileUser;
    } catch (e) {
      console.error('[Auth] Exception fetching profile:', e);
      return null;
    }
  };

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.error('Supabase is not configured. Please check your .env file.');
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: supabaseSession } }: { data: { session: any } }) => {
      if (supabaseSession) {
        setSession({
          user: {
            id: supabaseSession.user.id,
            email: supabaseSession.user.email ?? null,
          },
        });
        // Fetch profile
        const userProfile = await fetchProfile(supabaseSession.user.id);
        setProfile(userProfile);
      }
      setIsLoading(false);
    });

    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, supabaseSession: any) => {
      if (supabaseSession) {
        // User is signed in
        const authUser = {
          id: supabaseSession.user.id,
          email: supabaseSession.user.email ?? null,
        };
        setSession({ user: authUser });

        // Only fetch profile if not already loaded or if user changed
        setProfile(prev => {
          if (prev?.uid === authUser.id) return prev;
          // Trigger fetch (async side effect handling in separate Effect would be cleaner, but doing it here for immediacy)
          fetchProfile(authUser.id).then(p => setProfile(p));
          return prev;
        });
      } else {
        // User is signed out
        setSession(null);
        setProfile(null);
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
    profile,
    isLoading,

    refreshProfile: async () => {
      if (session?.user.id) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
    },

    /**
     * Sign in as guest with a unique anonymous session
     * No hardcoded credentials - generates a random UUID-based identity
     */
    signInAsGuest: async () => {
      const guestId = `guest-${Crypto.randomUUID()}`;

      setSession({ user: { id: guestId, email: '__guest__' } });
      setProfile({
        id: guestId,
        username: 'Guest_User',
        full_name: 'Guest User',
        email: '__guest__',
        anonymousMode: false,
        stats: { totalPosts: 5, totalUpvotes: 34, totalComments: 12, totalShares: 8 },
        createdAt: new Date(),
        lastLoginAt: new Date(),
        googleConnected: false,
        twitterConnected: false,
        privacyDefault: 'twitter',
        alwaysAskTwitterMethod: true,
        isVerified: false,
        preferences: {
          notifications: {
            nearby: false, comments: false, upvotes: false, replies: false,
            twitter: false, digest: false, trending: false, similar: false,
          },
        },
        privacySettings: { profileVisibility: 'public', showLocation: true },
      } as any);

      return undefined;
    },

    /**
     * Sign in with email and password
     *
     * @param email - User's email address
     * @param password - User's password
     * @returns Error object if sign in fails, undefined if successful
     */
    signIn: async (email: string, password: string) => {
      // Guest mode check - triggered from "Try Demo" button
      if (email === '__guest__') {
        return value.signInAsGuest();
      }

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
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
          return {
            data,
            error: error.message || 'Failed to sign up',
            code: error.status?.toString() || 'auth/unknown-error',
          };
        }

        // Session will be updated by onAuthStateChange listener
        return { data };
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
        setProfile(null);
      }
    },
  }), [session, profile, isLoading]);

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
 * const { session, profile, signIn, signOut } = useAuth();
 *
 * if (session) {
 *   // User is logged in
 *   console.log('User ID:', session.user.id);
 *   console.log('Username:', profile?.username);
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
