/**
 * Authentication Hook - Simplified for Firebase
 *
 * Core Functionality:
 * - Handles user authentication with Firebase
 * - Manages auth state across the app
 * - Provides sign in, sign up, and sign out methods
 *
 * This hook is optimized for the Civic Vigilance app's core mission:
 * connecting citizens with civic authorities via GPS-tagged reports.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  isFirebaseConfigured,
  auth as fbAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fbSignOut,
} from '../lib/firebase';

// Firebase User Session type (simplified)
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
 * Manages authentication state using Firebase Auth.
 * Listens to auth state changes and updates the session accordingly.
 *
 * Why Firebase only:
 * - Simpler codebase (no SQLite/Supabase complexity)
 * - Works on web, iOS, and Android
 * - Built-in security and scalability
 * - Real-time sync for civic reports
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured || !fbAuth) {
      console.error('Firebase is not configured. Please check your .env file.');
      setIsLoading(false);
      return;
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(fbAuth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setSession({
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email,
          },
        });
      } else {
        // User is signed out
        setSession(null);
      }
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Memoized authentication methods
   *
   * These methods handle Firebase authentication with proper error handling.
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
      if (!fbAuth) {
        return { error: 'Firebase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        await signInWithEmailAndPassword(fbAuth, email, password);
        // Session will be updated by onAuthStateChanged listener
        return undefined;
      } catch (error: any) {
        console.error('[Auth] Sign in error:', error);
        return {
          error: error?.message || 'Failed to sign in',
          code: error?.code || 'auth/unknown-error',
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
      if (!fbAuth) {
        return { error: 'Firebase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        await createUserWithEmailAndPassword(fbAuth, email, password);
        // Session will be updated by onAuthStateChanged listener
        return undefined;
      } catch (error: any) {
        console.error('[Auth] Sign up error:', error);
        return {
          error: error?.message || 'Failed to sign up',
          code: error?.code || 'auth/unknown-error',
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
      if (!fbAuth) {
        return { error: 'Firebase Auth not initialized', code: 'auth/not-initialized' };
      }

      try {
        await sendPasswordResetEmail(fbAuth, email);
        return undefined;
      } catch (error: any) {
        console.error('[Auth] Reset password error:', error);
        return {
          error: error?.message || 'Failed to send reset email',
          code: error?.code || 'auth/unknown-error',
        };
      }
    },

    /**
     * Sign out current user
     */
    signOut: async () => {
      if (!fbAuth) {
        console.error('[Auth] Firebase Auth not initialized');
        return;
      }

      try {
        await fbSignOut(fbAuth);
        // Session will be cleared by onAuthStateChanged listener
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
