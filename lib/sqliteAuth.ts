import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDB, ensureSchema } from './db';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';

export type LocalUser = { id: number; email: string };

const SESSION_KEY = 'sqlite_session_user_id';

export async function initAuth() {
  ensureSchema();
  // Seed a default user if none exists for demo
}

// Ensure there is a valid session user id. If none, create a lightweight
// local account so inserts (issues, comments, votes) have a valid owner.
export async function ensureSessionUserId(): Promise<number> {
  const db = getDB();
  const existing = await AsyncStorage.getItem(SESSION_KEY);
  if (existing) return Number(existing);
  // Try to reuse the first user if any
  const any: any = db.getFirstSync?.('SELECT id FROM users ORDER BY id LIMIT 1');
  if (any?.id) {
    await AsyncStorage.setItem(SESSION_KEY, String(any.id));
    return any.id as number;
  }
  // Create an anonymous local user
  const now = new Date().toISOString();
  const email = `anonymous@local`;
  const hash = await makePasswordHash('anonymous');
  db.withTransactionSync?.(() => {
    db.execSync?.('INSERT INTO users(email, password_hash, created_at) VALUES (?,?,?)', [email, hash, now]);
    const id = (db.getFirstSync?.('SELECT last_insert_rowid() as id') as any)?.id as number;
    db.execSync?.('INSERT OR REPLACE INTO profiles(user_id, full_name, created_at) VALUES (?,?,?)', [id, 'Anonymous', now]);
    AsyncStorage.setItem(SESSION_KEY, String(id));
  });
  const out: any = db.getFirstSync?.('SELECT id FROM users WHERE email=?', [email]);
  return out?.id as number;
}

export async function signUpLocal(email: string, password: string, fullName?: string): Promise<{ user?: LocalUser; error?: string }> {
  try {
    const db = getDB();
    const hash = await makePasswordHash(password);
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
    const ok = await verifyPassword(password, row.password_hash);
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

// --- password helpers (Expo‑friendly: SHA‑256 with random salt) ---
async function makePasswordHash(password: string) {
  const salt = Buffer.from(await Random.getRandomBytesAsync(16)).toString('hex');
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
  return `sha256$${salt}$${digest}`;
}

async function verifyPassword(password: string, stored: string) {
  const [alg, salt, hash] = (stored || '').split('$');
  if (alg !== 'sha256' || !salt || !hash) return false;
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
  return digest === hash;
}
