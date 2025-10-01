import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SortBar from '../components/SortBar';
import IssueCard from '../components/IssueCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { useIssues } from '../hooks/useIssues';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/theme';

export default function FeedScreen() {
  const [sort, setSort] = useState<'trending' | 'newest' | 'nearby'>('trending');
  const { data } = useIssues(sort);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SortBar value={sort} onChange={setSort} />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <IssueCard item={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.placeholder}>
            <IssueCard item={{ id: 'demo1', user_id: 'demo', title: 'Pothole near Maple St.', description: 'Large pothole causing bikes to swerve.', category: 'pothole' as any, image_url: 'https://picsum.photos/seed/pothole/800/500', lat: 0, lng: 0, address: 'Maple St & 8th Ave', upvotes: 12, downvotes: 1, comments_count: 4, created_at: new Date().toISOString() }} onPress={() => {}} />
            <IssueCard item={{ id: 'demo2', user_id: 'demo', title: 'Streetlight not working', description: 'Dark corner near the park.', category: 'streetlight' as any, image_url: 'https://picsum.photos/seed/light/800/500', lat: 0, lng: 0, address: 'Pine Park', upvotes: 7, downvotes: 0, comments_count: 2, created_at: new Date().toISOString() }} onPress={() => {}} />
          </View>
        )}
      />
      <FloatingActionButton onPress={() => navigation.navigate('Report' as never)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  placeholder: { padding: 16, gap: 16 }
});
