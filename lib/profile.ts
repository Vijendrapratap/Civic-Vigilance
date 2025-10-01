import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { supabase, isSupabaseConfigured } from './supabase';
import { isFirebaseConfigured, db as fdb } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
};

const PROFILE_KEY = 'demo_profile';
const PREFS_KEY = 'demo_notification_prefs';

export async function loadProfile(userId: string): Promise<UserProfile> {
  if (isFirebaseConfigured && fdb) {
    const ref = doc(fdb, 'profiles', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: userId, ...(snap.data() as any) };
    return { id: userId, full_name: 'Civic User', avatar_url: null, created_at: new Date().toISOString() };
  }
  if (!isSupabaseConfigured) {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    const parsed: UserProfile | null = raw ? JSON.parse(raw) : null;
    return parsed || { id: userId, full_name: 'Civic User', avatar_url: null, created_at: new Date().toISOString() };
  }
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return (data as any) || { id: userId };
}

export async function saveProfile(p: UserProfile) {
  if (isFirebaseConfigured && fdb) {
    const ref = doc(fdb, 'profiles', p.id);
    await setDoc(ref, { full_name: p.full_name ?? null, avatar_url: p.avatar_url ?? null, created_at: p.created_at || serverTimestamp() }, { merge: true });
    return p;
  }
  if (!isSupabaseConfigured) {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    return p;
  }
  const { data, error } = await supabase.from('profiles').upsert({ id: p.id, full_name: p.full_name, avatar_url: p.avatar_url }).select('*').single();
  if (error) throw error; return data as UserProfile;
}

export async function pickAvatar(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
  if (res.canceled) return null; return res.assets[0].uri;
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
