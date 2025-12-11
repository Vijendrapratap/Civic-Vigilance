import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBackend } from '../lib/backend';
import { Issue } from '../types';
import { createIssueSqlite, listIssues as listIssuesSqlite, ensureSeedIssues } from '../lib/sqliteIssues';
import { ensureSessionUserId } from '../lib/sqliteAuth';
import { useAuth } from './useAuth';

type SortMode = 'trending' | 'newest' | 'nearby';

export function useIssues(sort: SortMode, coords?: { lat: number; lng: number }) {
  const [data, setData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth(); // Use context session which has the dummy user

  /* DUMMY DATA FOR GUEST MODE */
  const DUMMY_ISSUES: Issue[] = [
    {
      id: 'dummy-1',
      userId: 'user-1',
      title: 'Pothole on Main St causing traffic',
      description: 'Large pothole in the middle lane causing severe slowdowns during rush hour. Several cars have been damaged.',
      category: 'pothole',
      photos: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800'],
      location: { lat: 19.0760, lng: 72.8777, address: 'Main Street, Mumbai', geohash: 'te7u' },
      privacy: 'personal',
      status: 'posted',
      anonymousUsername: 'Citizen_One',
      metrics: { upvotes: 42, downvotes: 2, comments: 15, shares: 8 },
      moderation: { flagged: false, reviewed: true, status: 'active' },
      authorities: [],
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
    },
    {
      id: 'dummy-2',
      userId: 'user-2',
      title: 'Overflowing Garbage Bin',
      description: 'The garbage bin at the market entrance has been overflowing for 3 days. Foul smell and attracting stray animals.',
      category: 'garbage',
      photos: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800'],
      location: { lat: 19.0800, lng: 72.8800, address: 'Market Road, Mumbai', geohash: 'te7u' },
      privacy: 'civic_vigilance',
      status: 'pending',
      anonymousUsername: 'Eco_Warrior',
      metrics: { upvotes: 128, downvotes: 5, comments: 45, shares: 32 },
      moderation: { flagged: false, reviewed: false, status: 'active' },
      authorities: [],
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(),
    },
    {
      id: 'dummy-3',
      userId: 'user-3',
      title: 'Broken Streetlight',
      description: 'Streetlight #452 is not working. The area is very dark and unsafe at night for pedestrians.',
      category: 'streetlight',
      photos: ['https://images.unsplash.com/photo-1555677284-6a6f9716399a?auto=format&fit=crop&q=80&w=800'],
      location: { lat: 19.0820, lng: 72.8820, address: 'Park Avenue, Mumbai', geohash: 'te7u' },
      privacy: 'personal',
      status: 'posted',
      anonymousUsername: 'Night_Owl',
      metrics: { upvotes: 15, downvotes: 0, comments: 3, shares: 1 },
      moderation: { flagged: false, reviewed: false, status: 'active' },
      authorities: [],
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(),
    }
  ];

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      // Check for guest user in session (using logic from useAuth context)
      const isGuest = session?.user?.email === 'guest@civic.com';

      if (isGuest) {
        // Return dummy data for visualization
        console.log('[useIssues] Serving dummy data for Guest Mode');
        await new Promise(r => setTimeout(r, 500)); // Fake network delay
        setData(DUMMY_ISSUES);
        setLoading(false);
        return;
      }

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
