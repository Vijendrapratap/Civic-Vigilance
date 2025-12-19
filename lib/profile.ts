import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { supabase, isSupabaseConfigured } from './supabase';
import { getBackend } from './backend';

import { User } from '../types';

export type UserProfile = Partial<User> & { id: string };

const PROFILE_KEY = 'demo_profile';
const PREFS_KEY = 'demo_notification_prefs';

export async function loadProfile(userId: string): Promise<UserProfile> {
  if (getBackend() === 'sqlite') {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    const parsed: UserProfile | null = raw ? JSON.parse(raw) : null;
    return parsed || { id: userId, full_name: 'Civic User', photoURL: undefined, createdAt: new Date() } as unknown as UserProfile;
  }

  // Supabase backend
  if (!isSupabaseConfigured) {
    return { id: userId, full_name: 'Civic User', photoURL: undefined, createdAt: new Date() } as unknown as UserProfile;
  }
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();

  // Cast DB response to User type logic (handling ID vs UID mismatch if necessary)
  if (data) {
    const userProfile: UserProfile = { ...data, uid: data.id, photoURL: data.avatar_url };
    return userProfile;
  }
  return { id: userId };
}

export async function saveProfile(p: UserProfile) {
  if (getBackend() === 'sqlite') {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    return p;
  }

  // Supabase backend
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  // Prepare payload - mapping camelCase types to snake_case DB columns if needed, 
  // currently assuming snake_case matches or Supabase JS handles it? 
  // Actually, db schema is snake_case. Types are camelCase mostly?
  // Checking types/index.ts: 
  // "preferences", "privacySettings" -> In DB they might be jsonb columns.
  // "anonymousMode" -> "anonymous_mode" in DB?
  // "privacyDefault" -> "privacy_default" in DB?
  // "twitterConnected" -> "twitter_connected"?

  // Let's create a clean valid payload
  const payload: any = {
    id: p.id,
    updated_at: new Date().toISOString(),
  };

  if (p.full_name !== undefined) payload.full_name = p.full_name;
  if (p.photoURL !== undefined) payload.avatar_url = p.photoURL; // Map photoURL to avatar_url DB column

  // Settings fields
  if (p.anonymousMode !== undefined) payload.anonymous_mode = p.anonymousMode;
  if (p.privacyDefault !== undefined) payload.privacy_default = p.privacyDefault;
  if (p.twitterConnected !== undefined) payload.twitter_connected = p.twitterConnected;
  if (p.preferences !== undefined) payload.preferences = p.preferences;
  if (p.privacySettings !== undefined) payload.privacy_settings = p.privacySettings;
  if (p.stats !== undefined) payload.stats = p.stats;

  const { data, error } = await supabase.from('profiles').upsert(payload).select('*').single();

  if (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
  return { ...data, uid: data.id, photoURL: data.avatar_url } as unknown as UserProfile;
}

export async function pickAvatar(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
  if (res.canceled) return null;
  return res.assets[0].uri;
}

export type NotificationPrefs = {
  issue_comments: boolean;
  my_reports_updates: boolean;
  mentions: boolean;
  nearby_issues: boolean;
  email_updates: boolean;
};

export async function loadPrefs(): Promise<NotificationPrefs> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : { issue_comments: true, my_reports_updates: true, mentions: true, nearby_issues: false, email_updates: false };
}

export async function savePrefs(p: NotificationPrefs) {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p));
}
