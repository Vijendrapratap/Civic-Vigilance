import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Issue } from '../types';

export default function IssueCard({ item, onPress }: { item: Issue; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta} numberOfLines={2}>
          {item.address || item.description}
        </Text>
        <View style={styles.row}>
          <Text>⬆ {item.upvotes ?? 0}</Text>
          <Text> ⬇ {item.downvotes ?? 0}</Text>
          <Text> 💬 {item.comments_count ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12, elevation: 1 },
  image: { width: '100%', height: 180 },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { color: '#555' },
  row: { flexDirection: 'row', marginTop: 8 }
});
