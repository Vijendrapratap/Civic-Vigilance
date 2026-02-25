import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCount } from '../lib/format';
import { Colors, BorderRadius } from '../constants/DesignSystem';

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
      <Chip onPress={onUpvote} active={vote === 1} icon="arrow-up" label={formatCount(upvotes)} a11yLabel="Upvote" />
      <Chip onPress={onDownvote} active={vote === -1} icon="arrow-down" label={formatCount(downvotes)} a11yLabel="Downvote" />
      {onComment && <Chip onPress={onComment} icon="chatbubble-outline" label={formatCount(comments)} a11yLabel="Open comments" />}
      {onShare && <Chip onPress={onShare} icon="share-social-outline" label="Share" a11yLabel="Share" />}
    </View>
  );
}

function Chip({ icon, label, onPress, active, a11yLabel }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; active?: boolean; a11yLabel?: string; }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.active]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={a11yLabel || label}
      hitSlop={8}
    >
      <Ionicons name={icon} size={16} color={active ? '#fff' : Colors.textMain} />
      <Text style={[styles.text, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(148, 163, 184, 0.18)' },
  active: { backgroundColor: Colors.primary },
  text: { color: Colors.textMain, fontWeight: '700' }
});
