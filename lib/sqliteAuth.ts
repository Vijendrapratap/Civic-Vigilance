import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { getDB, ensureSchema } from './db';

export type LocalUser = { id: number; email: string };

const SESSION_KEY = 'sqlite_session_user_id';

export async function initAuth() {
  ensureSchema();
  // Seed a default user if none exists for demo
}

export async function signUpLocal(email: string, password: string, fullName?: string): Promise<{ user?: LocalUser; error?: string }> {
  try {
    const db = getDB();
    const hash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();
    db.withTransactionSync?.(() => {
      db.execSync?.(`INSERT INTO users(email, password_hash, created_at) VALUES (?,?,?);`, [email, hash, now]);
      const id = (db.getFirstSync?.(`SELECT id FROM users WHERE email=?;`, [email]) as any)?.id as number;
      db.execSync?.(`INSERT OR REPLACE INTO profiles(user_id, full_name, created_at) VALUES (?,?,?);`, [id, fullName || null, now]);
    });
    const id = (getDB().getFirstSync?.(`SELECT id FROM users WHERE email=?;`, [email]) as any)?.id as number;
    await AsyncStorage.setItem(SESSION_KEY, String(id));
    return { user: { id, email } };
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (/UNIQUE/i.test(msg)) return { error: 'Email already registered' };
    return { error: msg };
  }
}

export async function signInLocal(email: string, password: string): Promise<{ user?: LocalUser; error?: string }> {
  try {
    const row: any = getDB().getFirstSync?.(`SELECT id, password_hash FROM users WHERE email=?;`, [email]);
    if (!row) return { error: 'Invalid email or password' };
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return { error: 'Invalid email or password' };
    await AsyncStorage.setItem(SESSION_KEY, String(row.id));
    return { user: { id: row.id, email } };
  } catch (e: any) { return { error: String(e?.message || e) }; }
}

export async function signOutLocal() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function currentUserLocal(): Promise<LocalUser | null> {
  const id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const row: any = getDB().getFirstSync?.(`SELECT email FROM users WHERE id=?;`, [Number(id)]);
  if (!row) return null;
  return { id: Number(id), email: row.email };
}

