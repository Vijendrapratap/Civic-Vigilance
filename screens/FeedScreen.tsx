import React, { useState, useEffect } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import Header from '../components/Header';
import SortBar from '../components/SortBar';
import EnhancedIssueCard from '../components/EnhancedIssueCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { useIssues } from '../hooks/useIssues';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/theme';
import { calculateDistance } from '../lib/geohash';

export default function FeedScreen() {
  const [sort, setSort] = useState<'trending' | 'newest' | 'nearby'>('nearby'); // Changed to 'nearby' per PRD 5.3.1
  const { data } = useIssues(sort);
  const navigation = useNavigation<any>();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location for distance calculation (nearby sort)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.log('[Feed] Location error:', error);
      }
    })();
  }, []);

  // Calculate distance for nearby sort
  const getDistance = (lat?: number, lng?: number): number | undefined => {
    if (sort === 'nearby' && coords && lat !== undefined && lng !== undefined) {
      return calculateDistance(coords.lat, coords.lng, lat, lng);
    }
    return undefined;
  };

  // Empty state component with PRD philosophy messaging (Section 10.2)
  const EmptyState = () => {
    const emptyStates: Record<string, { emoji: string; title: string; message: string }> = {
      nearby: {
        emoji: '😊',
        title: 'No issues posted here yet',
        message: 'Your neighborhood looks quiet on the app,\nbut we know there are always things to improve.\n\nBe the first to report an issue!',
      },
      newest: {
        emoji: '🌟',
        title: 'No issues yet',
        message: 'CivicVigilance is growing!\n\nBe the first to report an issue and\nmake your community impossible to ignore.',
      },
      trending: {
        emoji: '🔥',
        title: 'Nothing trending yet',
        message: 'The community is just getting started.\n\nReport an issue and help amplify\nwhat matters in your city!',
      },
    };

    const state = emptyStates[sort] || emptyStates.nearby;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>{state.emoji}</Text>
        <Text style={styles.emptyTitle}>{state.title}</Text>
        <Text style={styles.emptyMessage}>{state.message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SortBar value={sort} onChange={setSort} />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <EnhancedIssueCard
            item={item}
            distance={getDistance(item.lat, item.lng)}
            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={<EmptyState />}
      />
      <FloatingActionButton onPress={() => navigation.navigate('Report' as never)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
