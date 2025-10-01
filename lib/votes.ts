import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { isFirebaseConfigured, db as fdb, auth as fauth } from './firebase';
import { doc, getDoc, runTransaction, increment } from 'firebase/firestore';

const VOTES_KEY = 'demo_votes'; // { [issueId: string]: -1 | 0 | 1 }

async function readVotes(): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(VOTES_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function writeVotes(map: Record<string, number>) {
  await AsyncStorage.setItem(VOTES_KEY, JSON.stringify(map));
}

export async function getUserVote(issueId: string): Promise<-1 | 0 | 1> {
  if (isFirebaseConfigured && fdb) {
    const uid = fauth?.currentUser?.uid;
    if (!uid) return 0;
    const vref = doc(fdb, 'issue_votes', `${uid}_${issueId}`);
    const snap = await getDoc(vref);
    return ((snap.exists() ? (snap.data() as any).value : 0) ?? 0) as -1 | 0 | 1;
  }
  if (!isSupabaseConfigured) {
    const map = await readVotes();
    return ((map[issueId] as any) ?? 0) as -1 | 0 | 1;
  }
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return 0;
  const { data } = await supabase.from('votes').select('value').eq('issue_id', issueId).limit(1).single();
  return ((data?.value as any) ?? 0) as -1 | 0 | 1;
}

export async function castVote(issueId: string, value: -1 | 1): Promise<{ vote: -1 | 0 | 1; upvotes?: number; downvotes?: number; }>
{
  if (isFirebaseConfigured && fdb) {
    const uid = fauth?.currentUser?.uid;
    if (!uid) return { vote: 0 };
    const vref = doc(fdb, 'issue_votes', `${uid}_${issueId}`);
    const iref = doc(fdb, 'issues', issueId);
    let result: -1 | 0 | 1 = 0;
    await runTransaction(fdb, async (tx) => {
      const vsnap = await tx.get(vref);
      const current: -1 | 0 | 1 = vsnap.exists() ? ((vsnap.data() as any).value as any) : 0;
      const next: -1 | 0 | 1 = current === value ? 0 : value;
      result = next;
      // Compute deltas
      let du = 0, dd = 0;
      if (current === 0 && next === 1) du = 1;
      else if (current === 0 && next === -1) dd = 1;
      else if (current === 1 && next === 0) du = -1;
      else if (current === -1 && next === 0) dd = -1;
      else if (current === -1 && next === 1) { du = 1; dd = -1; }
      else if (current === 1 && next === -1) { du = -1; dd = 1; }

      if (du !== 0 || dd !== 0) {
        tx.update(iref, { upvotes: increment(du), downvotes: increment(dd), score: increment(du - dd) });
      }
      if (next === 0) tx.delete(vref); else tx.set(vref, { user_id: uid, issue_id: issueId, value: next });
    });
    // Note: returning counts requires reading the issue; keep lightweight
    return { vote: result };
  }
  if (!isSupabaseConfigured) {
    const map = await readVotes();
    const current = (map[issueId] ?? 0) as -1 | 0 | 1;
    const next = current === value ? 0 : value;
    map[issueId] = next;
    await writeVotes(map);
    // We cannot know global counts reliably; let UI adjust locally
    return { vote: next };
  }

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return { vote: 0 };
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
}
