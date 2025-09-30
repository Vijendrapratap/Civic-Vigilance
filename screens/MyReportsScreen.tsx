import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import { Issue } from '../types';
import IssueCard from '../components/IssueCard';
import { useAuth } from '../hooks/useAuth';

export default function MyReportsScreen({ navigation }: any) {
  const { session } = useAuth();
  const [data, setData] = useState<Issue[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase.from('issues').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      setData((data as any) || []);
    };
    load();
  }, [session?.user?.id]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList data={data} keyExtractor={(it) => it.id} renderItem={({ item }) => (
        <IssueCard item={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
      )} />
    </View>
  );
}
