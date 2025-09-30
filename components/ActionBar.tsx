import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCount } from '../lib/format';

type Props = {
  vote: -1 | 0 | 1;
  upvotes?: number;
  downvotes?: number;
  comments?: number;
  onUpvote: () => void;
  onDownvote: () => void;
  onComment?: () => void;
  onShare?: () => void;
};

export default function ActionBar({ vote, upvotes = 0, downvotes = 0, comments = 0, onUpvote, onDownvote, onComment, onShare }: Props) {
  return (
    <View style={styles.row}>
      <Chip onPress={onUpvote} active={vote === 1} icon="arrow-up" label={formatCount(upvotes)} />
      <Chip onPress={onDownvote} active={vote === -1} icon="arrow-down" label={formatCount(downvotes)} />
      {onComment && <Chip onPress={onComment} icon="chatbubble-outline" label={formatCount(comments)} />}
      {onShare && <Chip onPress={onShare} icon="share-social-outline" label="Share" />}
    </View>
  );
}

function Chip({ icon, label, onPress, active }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; active?: boolean; }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Ionicons name={icon} size={16} color={active ? '#fff' : '#222'} />
      <Text style={[styles.text, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f2f5' },
  active: { backgroundColor: '#111' },
  text: { color: '#222', fontWeight: '600' }
});

