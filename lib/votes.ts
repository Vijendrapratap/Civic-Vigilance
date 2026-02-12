import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { getBackend } from './backend';

/** Retry helper with exponential backoff */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

const VOTES_KEY = 'demo_votes'; // { [issueId: string]: -1 | 0 | 1 }

async function readVotes(): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(VOTES_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function writeVotes(map: Record<string, number>) {
  await AsyncStorage.setItem(VOTES_KEY, JSON.stringify(map));
}

export async function getUserVote(issueId: string): Promise<-1 | 0 | 1> {
  // Handle dummy issues or fallback if backend is sqlite
  if (getBackend() === 'sqlite' || issueId.startsWith('dummy-')) {
    const map = await readVotes();
    return ((map[issueId] as any) ?? 0) as -1 | 0 | 1;
  }

  // Supabase backend
  if (!isSupabaseConfigured) return 0;
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return 0;
  const { data } = await supabase.from('votes').select('value').eq('issue_id', issueId).limit(1).single();
  return ((data?.value as any) ?? 0) as -1 | 0 | 1;
}

export async function castVote(issueId: string, value: -1 | 1): Promise<{ vote: -1 | 0 | 1; upvotes?: number; downvotes?: number; }> {
  if (getBackend() === 'sqlite' || issueId.startsWith('dummy-')) {
    const map = await readVotes();
    const current = (map[issueId] ?? 0) as -1 | 0 | 1;
    const next = current === value ? 0 : value;
    map[issueId] = next;
    await writeVotes(map);

    // For dummy issues, we return the vote. The UI handles the count optimistically.
    // If we wanted to be fancy we'd fetch the base count and adjust, but optimistic is enough.
    return { vote: next };
  }

  // Supabase backend
  if (!isSupabaseConfigured) return { vote: 0 };
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return { vote: 0 };

  return withRetry(async () => {
    // Fetch current vote
    const { data: cur } = await supabase.from('votes').select('id,value').eq('issue_id', issueId).limit(1).single();
    const next = cur?.value === value ? 0 : value;
    if (next === 0 && cur?.id) {
      await supabase.from('votes').delete().eq('id', cur.id);
    } else {
      // upsert by unique (user_id, issue_id)
      await supabase.from('votes').upsert({ issue_id: issueId, value: next || 1 });
    }

    // Read updated counts
    const { data: issue } = await supabase.from('issues').select('upvotes,downvotes').eq('id', issueId).single();
    return { vote: next as any, upvotes: issue?.upvotes, downvotes: issue?.downvotes };
  });
}
