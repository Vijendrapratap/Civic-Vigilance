import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Issue } from '../types';
import IssueCard from '../components/IssueCard';
import { useAuth } from '../hooks/useAuth';
import { listUserIssues } from '../lib/sqliteIssues';
import { isFirebaseConfigured, db as fdb, auth as fauth } from '../lib/firebase';
import { collection, getDocs, query as fsQuery, where, orderBy } from 'firebase/firestore';

export default function MyReportsScreen({ navigation }: any) {
  const { session } = useAuth();
  const [data, setData] = useState<Issue[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      if (isFirebaseConfigured && fdb) {
        const uid = fauth?.currentUser?.uid;
        if (!uid) return;
        try {
          const q = fsQuery(collection(fdb, 'issues'), where('user_id', '==', uid), orderBy('created_at', 'desc'));
          const snap = await getDocs(q);
          const items = snap.docs.map(d => ({ id: d.id, upvotes: 0, downvotes: 0, comments_count: 0, ...(d.data() as any) }));
          setData(items as any);
        } catch (_e) {
          // Fallback without orderBy if index missing
          const q2 = fsQuery(collection(fdb, 'issues'), where('user_id', '==', uid));
          const snap2 = await getDocs(q2);
          setData(snap2.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any);
        }
      } else if (!isSupabaseConfigured) {
        const all = listUserIssues(Number(session.user.id));
        setData(all as any);
      } else {
        const { data } = await supabase.from('issues').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        setData((data as any) || []);
      }
    };
    load();
  }, [session?.user?.id]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList data={data} keyExtractor={(it) => String((it as any).id)} renderItem={({ item }) => (
        <IssueCard item={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
      )} />
    </View>
  );
}
