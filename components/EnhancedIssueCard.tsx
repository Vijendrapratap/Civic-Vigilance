/**
 * Enhanced Issue Card - PRD Section 5.3.2 Compliant
 *
 * Design Specs:
 * - Card Dimensions: 100% width, min-height 280px, 12px radius
 * - Shadow: box-shadow: 0 2px 8px rgba(0,0,0,0.1)
 * - Background: Soft White (#F4F4F5)
 * - Padding: 16px all sides
 *
 * Elements:
 * - Category emoji + title
 * - Photo thumbnail (16:9 ratio)
 * - Distance + address
 * - Username (with ⭐ if verified)
 * - Time ago
 * - Twitter indicator (🐦 Posted / 🔒 App Only)
 * - Vote arrows + count
 * - Comment count + Share button
 */

import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IssueWithUserData } from '../types';
import { castVote, getUserVote } from '../lib/votes';
import { formatCount, getTimeAgo, formatDistance } from '../lib/format';
import { CATEGORY_EMOJIS } from './CategoryPicker';

interface Props {
  item: IssueWithUserData;
  onPress?: () => void;
  distance?: number; // Distance in km (for nearby sort)
}

function EnhancedIssueCard({ item, onPress, distance }: Props) {
  const [vote, setVote] = useState<-1 | 0 | 1>(0);
  const [upvotes, setUpvotes] = useState(item.upvotes ?? 0);

  useEffect(() => {
    getUserVote(item.id).then(setVote).catch(() => {});
  }, [item.id]);

  const onVote = useCallback(async (val: -1 | 1) => {
    const prev = vote;
    // Optimistic update
    if (val === 1) {
      if (prev === 1) {
        setVote(0);
        setUpvotes(Math.max(0, upvotes - 1));
      } else {
        setVote(1);
        setUpvotes(upvotes + 1);
      }
    }

    try {
      const res = await castVote(item.id, val);
      if (typeof res.upvotes === 'number') setUpvotes(res.upvotes);
      setVote(res.vote);
    } catch {
      // Revert on error
      setVote(prev);
      setUpvotes(item.upvotes ?? 0);
    }
  }, [vote, upvotes, item.id, item.upvotes]);

  // Memoize expensive computations
  const categoryEmoji = useMemo(() =>
    CATEGORY_EMOJIS[item.category as keyof typeof CATEGORY_EMOJIS] || '⚠️',
    [item.category]
  );

  const privacyIndicator = useMemo(() => {
    // Check if issue has tweetUrl (means it was posted to Twitter)
    const isPostedToTwitter = !!item.tweetUrl;

    if (isPostedToTwitter) {
      return { icon: 'logo-twitter', text: 'Posted to Twitter', color: '#1DA1F2' };
    }
    return { icon: 'lock-closed', text: 'App Only', color: '#6B7280' };
  }, [item.tweetUrl]);

  const timeAgo = useMemo(() => getTimeAgo(item.createdAt), [item.createdAt]);
  const formattedDistance = useMemo(() => formatDistance(distance), [distance]);

  const handleShare = useCallback(() => {
    // TODO: Implement native share functionality
  }, [item.id]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Issue: ${item.title}, ${upvotes} upvotes`}
      activeOpacity={0.7}
    >
      {/* Category Emoji + Title */}
      <View style={styles.titleRow}>
        <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
        <Text style={styles.category}>{item.category.replace(/_/g, ' ')}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Photo Thumbnail (16:9 ratio) */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.photo} resizeMode="cover" />
      )}

      {/* Metadata Row */}
      <View style={styles.metaRow}>
        {/* Distance (if nearby sort) */}
        {distance !== undefined && formattedDistance !== '' && (
          <View style={styles.metaItem}>
            <Ionicons name="location" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{formattedDistance}</Text>
          </View>
        )}

        {/* Address */}
        <View style={[styles.metaItem, { flex: 1 }]}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.address || 'Location unknown'}
          </Text>
        </View>
      </View>

      {/* User + Time Row */}
      <View style={styles.userRow}>
        <Ionicons name="person-circle-outline" size={14} color="#6B7280" />
        <Text style={styles.username}>
          {item.anonymousUsername || 'Anonymous_Citizen'}
          {item.isVerified && ' ⭐'}
        </Text>
        <Text style={styles.separator}>•</Text>
        <Ionicons name="time-outline" size={14} color="#6B7280" />
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>

      {/* Twitter Indicator */}
      <View style={styles.privacyRow}>
        <Ionicons name={privacyIndicator.icon as any} size={12} color={privacyIndicator.color} />
        <Text style={[styles.privacyText, { color: privacyIndicator.color }]}>
          {privacyIndicator.text}
        </Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {/* Upvote Button */}
        <Pressable
          onPress={() => onVote(1)}
          style={styles.voteButton}
          hitSlop={8}
        >
          <Ionicons
            name={vote === 1 ? 'arrow-up' : 'arrow-up-outline'}
            size={24}
            color={vote === 1 ? '#FF6B3D' : '#6B7280'}
          />
          <Text style={[styles.voteCount, vote === 1 && styles.voteCountActive]}>
            {formatCount(upvotes)}
          </Text>
        </Pressable>

        {/* Comment Count */}
        <Pressable onPress={onPress} style={styles.actionButton} hitSlop={8}>
          <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
          <Text style={styles.actionText}>{formatCount(item.commentsCount || 0)}</Text>
        </Pressable>

        {/* Share Button */}
        <Pressable
          onPress={handleShare}
          style={styles.actionButton}
          hitSlop={8}
        >
          <Ionicons name="share-outline" size={18} color="#2563EB" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4F4F5', // Soft White per PRD
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 280,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 12,
    lineHeight: 22,
  },
  photo: {
    width: '100%',
    height: 180, // 16:9 ratio approximation
    borderRadius: 12,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  separator: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  timeAgo: {
    fontSize: 14,
    color: '#6B7280',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voteCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  voteCountActive: {
    color: '#FF6B3D', // Vibrant Orange per PRD
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

// Export memoized component for better performance
export default memo(EnhancedIssueCard);
