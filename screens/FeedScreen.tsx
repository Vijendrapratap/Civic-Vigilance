import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SortBar from '../components/SortBar';
import IssueCard from '../components/IssueCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { useIssues } from '../hooks/useIssues';
import { useNavigation } from '@react-navigation/native';

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <IssueCard item={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
        )}
      />
      <FloatingActionButton onPress={() => navigation.navigate('Report' as never)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' }
});
