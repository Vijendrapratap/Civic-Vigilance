import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isFirebaseConfigured, db as fdb, auth as fauth } from '../lib/firebase';
import { collection, getDocs, orderBy, query as fsQuery, limit as fsLimit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Issue } from '../types';
import { createIssueSqlite, listIssues as listIssuesSqlite, ensureSeedIssues } from '../lib/sqliteIssues';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ensureSessionUserId } from '../lib/sqliteAuth';

type SortMode = 'trending' | 'newest' | 'nearby';

export function useIssues(sort: SortMode, coords?: { lat: number; lng: number }) {
  const [data, setData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      if (isFirebaseConfigured && fdb) {
        try {
          let q;
          if (sort === 'newest') q = fsQuery(collection(fdb, 'issues'), orderBy('created_at', 'desc'), fsLimit(100));
          else if (sort === 'trending') q = fsQuery(collection(fdb, 'issues'), orderBy('score', 'desc'), fsLimit(100));
          else q = fsQuery(collection(fdb, 'issues'), orderBy('created_at', 'desc'), fsLimit(100));
          const snap = await getDocs(q);
          const list = snap.docs.map((d) => ({ id: d.id, upvotes: 0, downvotes: 0, comments_count: 0, ...d.data() } as any));
          setData(list as any);
        } catch (_e) { /* ignore */ }
      } else if (!isSupabaseConfigured) {
        const uid = await ensureSessionUserId();
        ensureSeedIssues(uid);
        const list = listIssuesSqlite(sort);
        setData(list as any);
      } else {
        let query = supabase.from('issues').select('*');
        if (sort === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sort === 'trending') {
          query = query.order('score', { ascending: false, nullsFirst: false });
        } else {
          // nearby: left as-is for demo
        }
        const { data, error } = await query.limit(100);
        if (!error && data) setData(data as any);
      }
      setLoading(false);
    };
    run();
  }, [sort, coords?.lat, coords?.lng]);

  return { data, loading };
}

export async function createIssue(payload: {
  title: string;
  description: string;
  category: string;
  image_url?: string;
  lat?: number;
  lng?: number;
  address?: string;
}) {
  if (isFirebaseConfigured && fdb) {
    const userId = fauth?.currentUser?.uid;
    if (!userId) throw new Error('Please sign in to submit');
    const docRef = await addDoc(collection(fdb, 'issues'), {
      user_id: userId,
      upvotes: 0,
      downvotes: 0,
      comments_count: 0,
      score: 0,
      created_at: serverTimestamp(),
      ...payload,
    });
    return { id: docRef.id, user_id: userId, upvotes: 0, downvotes: 0, comments_count: 0, score: 0, created_at: new Date().toISOString(), ...payload } as any;
  }
  if (!isSupabaseConfigured) {
    const localUserId = await ensureSessionUserId();
    return await (createIssueSqlite({ user_id: localUserId, ...payload }) as any);
  }
  const { data, error } = await supabase.from('issues').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}
