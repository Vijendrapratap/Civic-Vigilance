import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Issue } from '../types';
import IssueCard from '../components/IssueCard';
import { useAuth } from '../hooks/useAuth';
import { listUserIssues } from '../lib/sqliteIssues';
import { getBackend } from '../lib/backend';

export default function MyReportsScreen({ navigation }: any) {
  const { session } = useAuth();
  const [data, setData] = useState<Issue[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;

      // GUEST MODE DUMMY DATA
      if (session.user.id === 'dummy-user-123') {
        setData([{
          id: 'dummy-my-1',
          userId: 'dummy-user-123',
          title: 'My First Report: Uneven Sidewalk',
          description: 'The sidewalk near the school is broken and dangerous for children.',
          category: 'pothole',
          photos: ['https://images.unsplash.com/photo-1596484552993-3d752dd30c33?auto=format&fit=crop&q=80&w=800'],
          location: { lat: 19.1000, lng: 72.8900, address: 'School Lane, Mumbai', geohash: 'te7u' },
          privacy: 'personal',
          status: 'pending',
          anonymousUsername: 'Guest_User',
          metrics: { upvotes: 5, downvotes: 0, comments: 1, shares: 0 },
          moderation: { flagged: false, reviewed: false, status: 'active' },
          authorities: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
        return;
      }

      if (getBackend() === 'sqlite') {
        const all = listUserIssues(Number(session.user.id));
        setData(all as any);
      } else if (isSupabaseConfigured) {
        const { data } = await supabase
          .from('issues')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        setData((data as any) || []);
      }
    };
    load();
  }, [session?.user?.id]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={data}
        keyExtractor={(it) => String((it as any).id)}
        renderItem={({ item }) => (
          <IssueCard item={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
