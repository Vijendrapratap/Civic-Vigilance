import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Issue } from '../types';
import { castVote, getUserVote } from '../lib/votes';
import { composePostText, shareImageWithText, openTweetComposer } from '../lib/sharing';
import ActionBar from './ActionBar';
import { colors } from '../lib/theme';

export default function IssueCard({ item, onPress }: { item: Issue; onPress?: () => void }) {
  const [vote, setVote] = useState<-1 | 0 | 1>(0);
  const [up, setUp] = useState(item.upvotes ?? 0);
  const [down, setDown] = useState(item.downvotes ?? 0);

  useEffect(() => {
    getUserVote(item.id).then(setVote).catch(() => {});
  }, [item.id]);

  const onVote = async (val: -1 | 1) => {
    const prev = vote;
    // optimistic update
    if (val === 1) {
      if (prev === 1) { setVote(0); setUp(Math.max(0, up - 1)); }
      else if (prev === -1) { setVote(1); setDown(Math.max(0, down - 1)); setUp(up + 1); }
      else { setVote(1); setUp(up + 1); }
    } else {
      if (prev === -1) { setVote(0); setDown(Math.max(0, down - 1)); }
      else if (prev === 1) { setVote(-1); setUp(Math.max(0, up - 1)); setDown(down + 1); }
      else { setVote(-1); setDown(down + 1); }
    }
    try {
      const res = await castVote(item.id, val);
      if (typeof res.upvotes === 'number') setUp(res.upvotes);
      if (typeof res.downvotes === 'number') setDown(res.downvotes);
      setVote(res.vote);
    } catch { /* keep optimistic values */ }
  };

  const onShare = async () => {
    const text = composePostText({ description: item.title + '\n' + (item.address || ''), address: item.address, lat: item.lat, lng: item.lng });
    if (item.image_url) await shareImageWithText(item.image_url, text); else await openTweetComposer(text);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Open issue ${item.title}`}
      hitSlop={6}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta} numberOfLines={2}>
          {item.address || item.description}
        </Text>
        <ActionBar vote={vote} upvotes={up} downvotes={down} comments={item.comments_count ?? 0} onUpvote={() => onVote(1)} onDownvote={() => onVote(-1)} onComment={onPress} onShare={onShare} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)' },
  image: { width: '100%', height: 200 },
  content: { padding: 16 },
  title: { fontSize: 16, fontWeight: '800', marginBottom: 6, color: colors.text },
  meta: { color: colors.subtext },
  row: { flexDirection: 'row', marginTop: 10, gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center' }
});
