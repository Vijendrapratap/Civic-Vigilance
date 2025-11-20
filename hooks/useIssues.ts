import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBackend } from '../lib/backend';
import { Issue } from '../types';
import { createIssueSqlite, listIssues as listIssuesSqlite, ensureSeedIssues } from '../lib/sqliteIssues';
import { ensureSessionUserId } from '../lib/sqliteAuth';

type SortMode = 'trending' | 'newest' | 'nearby';

export function useIssues(sort: SortMode, coords?: { lat: number; lng: number }) {
  const [data, setData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      if (getBackend() === 'sqlite') {
        const uid = await ensureSessionUserId();
        ensureSeedIssues(uid);
        const list = listIssuesSqlite(sort);
        setData(list as any);
      } else if (getBackend() === 'supabase' && isSupabaseConfigured) {
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
  if (getBackend() === 'sqlite') {
    const localUserId = await ensureSessionUserId();
    return await (createIssueSqlite({ user_id: localUserId, ...payload }) as any);
  }

  // Supabase backend
  const { data, error } = await supabase.from('issues').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}
