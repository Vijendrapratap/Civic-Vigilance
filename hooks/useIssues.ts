import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Issue } from '../types';

type SortMode = 'trending' | 'newest' | 'nearby';

export function useIssues(sort: SortMode, coords?: { lat: number; lng: number }) {
  const [data, setData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      let query = supabase.from('issues').select('*');
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'trending') {
        query = query.order('score', { ascending: false, nullsFirst: false });
      } else {
        // naive distance sort if available
      }
      const { data, error } = await query.limit(100);
      if (!error && data) setData(data as any);
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
  const { data, error } = await supabase.from('issues').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}
