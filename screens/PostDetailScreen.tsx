import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Comment, IssueWithUserData } from '../types';
import { getIssueByIdSqlite, listCommentsSqlite, addCommentSqlite, castVoteSqlite, getUserVoteSqlite } from '../lib/sqliteIssues';
import ActionBar from '../components/ActionBar';
import { castVote, getUserVote } from '../lib/votes';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { isFirebaseConfigured, db as fdb, auth as fauth } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, query as fsQuery, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { formatCount, getTimeAgo } from '../lib/format';
import { CATEGORY_EMOJIS } from '../components/CategoryPicker';

export default function PostDetailScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const [issue, setIssue] = useState<IssueWithUserData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [vote, setVote] = useState<-1 | 0 | 1>(0);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
  const { session } = useAuth();
  const localUserId = Number((session as any)?.user?.id || 1);

  useEffect(() => {
    const run = async () => {
      if (isFirebaseConfigured && fdb) {
        // Issue
        const iref = doc(fdb, 'issues', String(id));
        const isnap = await getDoc(iref);
        if (isnap.exists()) {
          const data: any = { id: String(id), ...isnap.data() };
          setIssue(data as Issue);
          setUp(data?.upvotes ?? 0); setDown(data?.downvotes ?? 0);
        }
        // Comments (top-level collection filtered by issue_id)
        try {
          const q = fsQuery(collection(fdb, 'comments'), where('issue_id', '==', String(id)), orderBy('created_at', 'asc'));
          const csnap = await getDocs(q);
          const c = csnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          setComments(c as any);
        } catch (_e) {
          const q2 = fsQuery(collection(fdb, 'comments'), where('issue_id', '==', String(id)));
          const csnap2 = await getDocs(q2);
          setComments(csnap2.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any);
        }
      } else if (!isSupabaseConfigured) {
        const i = await getIssueByIdSqlite(Number(id));
        setIssue(i as any);
        const c = await listCommentsSqlite(Number(id));
        setComments(c as any);
        setUp((i as any)?.upvotes ?? 0); setDown((i as any)?.downvotes ?? 0);
      } else {
        const { data } = await supabase.from('issues').select('*').eq('id', id).single();
        setIssue(data as any);
        const { data: c } = await supabase.from('comments').select('*').eq('issue_id', id).order('created_at', { ascending: true });
        setComments((c as any) || []);
        setUp((data as any)?.upvotes ?? 0); setDown((data as any)?.downvotes ?? 0);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    if (!isSupabaseConfigured) { try { setVote(getUserVoteSqlite(Number(id), localUserId)); } catch {}
    } else { getUserVote(id).then(setVote).catch(() => {}); }
  }, [id, localUserId]);

  const addComment = useCallback(async () => {
    if (!content.trim()) return;
    if (isFirebaseConfigured && fdb) {
      const uid = fauth?.currentUser?.uid;
      if (!uid) return;
      const payload = { issue_id: String(id), user_id: uid, content, parent_id: replyTo || null, created_at: serverTimestamp() };
      const ref = await addDoc(collection(fdb, 'comments'), payload as any);
      setComments((prev) => [...prev, { id: ref.id, ...payload } as any]);
    } else if (!isSupabaseConfigured) {
      const c = await addCommentSqlite(Number(id), localUserId, content, replyTo ? Number(replyTo) : undefined);
      setComments((prev) => [...prev, c as any]);
    } else {
      const { data, error } = await supabase.from('comments').insert({ issue_id: id, content, parent_id: replyTo }).select('*').single();
      if (!error && data) setComments((prev) => [...prev, data as any]);
    }
    setContent('');
    setReplyTo(null);
  }, [content, id, replyTo, localUserId]);

  const onVote = async (val: -1 | 1) => {
    const prev = vote;
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
      const res = isSupabaseConfigured ? await castVote(id, val) : await castVoteSqlite(Number(id), localUserId, val as any);
      if (typeof res.upvotes === 'number') setUp(res.upvotes);
      if (typeof res.downvotes === 'number') setDown(res.downvotes);
      setVote(res.vote);
    } catch { /* ignore */ }
  };

  // Memoize expensive computations
  const privacyIndicator = useMemo(() => {
    if (!issue) return null;
    const isPostedToTwitter = !!issue.tweetUrl;
    if (isPostedToTwitter) {
      return { icon: 'logo-twitter', text: 'Posted to Twitter', color: '#1DA1F2' };
    }
    return { icon: 'lock-closed', text: 'App Only', color: '#6B7280' };
  }, [issue?.tweetUrl]);

  const categoryEmoji = useMemo(() =>
    issue ? CATEGORY_EMOJIS[issue.category as keyof typeof CATEGORY_EMOJIS] || '⚠️' : '⚠️',
    [issue?.category]
  );

  const handleShare = useCallback(() => {
    console.log('[Detail] Share issue:', id);
    // TODO: Implement native share
  }, [id]);

  const tree = useMemo(() => {
    const map = new Map<string, any[]>();
    const roots: any[] = [];
    comments.forEach(c => { map.set(c.id, []); });
    comments.forEach(c => {
      if (c.parentId) {
        const arr = map.get(c.parentId) || [];
        arr.push(c); map.set(c.parentId, arr);
      } else {
        roots.push(c);
      }
    });
    function renderNode(c: any, level = 0) {
      const maxNestLevel = 5; // PRD: 5-level nesting max
      const actualLevel = Math.min(level, maxNestLevel);

      return (
        <View key={c.id} style={{
          paddingLeft: 8 + actualLevel * 12,
          paddingVertical: 12,
          borderLeftWidth: actualLevel > 0 ? 2 : 0,
          borderLeftColor: '#E5E7EB',
          marginBottom: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
            <Text style={{ fontWeight: '600', color: '#4B5563', marginLeft: 4, fontSize: 14 }}>
              {(c as any).anonymousUsername || 'Anonymous_Citizen'}
            </Text>
            <Text style={{ color: '#9CA3AF', marginLeft: 8, fontSize: 12 }}>
              {c.createdAt ? getTimeAgo(c.createdAt) : 'just now'}
            </Text>
          </View>
          <Text style={{ color: '#23272F', fontSize: 15, lineHeight: 22 }}>{c.content}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
            <Pressable onPress={() => setReplyTo(c.id)}>
              <Text style={{ color: '#2563EB', fontWeight: '600', fontSize: 14 }}>Reply</Text>
            </Pressable>
          </View>
          {(map.get(c.id) || []).map(child => renderNode(child, level + 1))}
        </View>
      );
    }
    return roots.map(r => renderNode(r));
  }, [comments]);

  if (!issue) return null;

  const tweetUrl = issue.tweetUrl;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Full-size Photo */}
      {issue.imageUrl && (
        <Image
          source={{ uri: issue.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}

      {/* Category + Title */}
      <View style={styles.headerSection}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
          <Text style={styles.categoryText}>
            {issue.category ? issue.category.replace(/_/g, ' ') : 'other'}
          </Text>
        </View>
        <Text style={styles.title}>{issue.title || 'Untitled Issue'}</Text>

        {/* User Info */}
        <View style={styles.userRow}>
          <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
          <Text style={styles.username}>
            {issue.anonymousUsername || 'Anonymous_Citizen'}
            {issue.isVerified && ' ⭐'}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.timeAgo}>{getTimeAgo(issue.createdAt)}</Text>
        </View>

        {/* Location */}
        {issue.address && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.address}>{issue.address}</Text>
          </View>
        )}

        {/* Privacy/Twitter Badge */}
        {privacyIndicator && (
          <View style={styles.privacyRow}>
            <Ionicons name={privacyIndicator.icon as any} size={14} color={privacyIndicator.color} />
            <Text style={[styles.privacyText, { color: privacyIndicator.color }]}>
              {privacyIndicator.text}
            </Text>
          </View>
        )}

        {/* Description */}
        <Text style={styles.description}>{issue.description || 'No description provided.'}</Text>
      </View>

      {/* Community Impact Section (PRD Section 5.4.2) */}
      <View style={styles.impactSection}>
        <Text style={styles.sectionTitle}>Community Impact</Text>
        <View style={styles.impactRow}>
          <View style={styles.impactItem}>
            <Ionicons name="arrow-up" size={24} color="#FF6B3D" />
            <Text style={styles.impactValue}>{formatCount(up)}</Text>
            <Text style={styles.impactLabel}>Upvotes</Text>
          </View>
          <View style={styles.impactItem}>
            <Ionicons name="chatbubble" size={24} color="#2563EB" />
            <Text style={styles.impactValue}>{formatCount(comments.length)}</Text>
            <Text style={styles.impactLabel}>Comments</Text>
          </View>
          <View style={styles.impactItem}>
            <Ionicons name="share-social" size={24} color="#34D399" />
            <Text style={styles.impactValue}>{formatCount(issue.shares || 0)}</Text>
            <Text style={styles.impactLabel}>Shares</Text>
          </View>
          {tweetUrl && issue.metrics?.twitterImpressions && (
            <View style={styles.impactItem}>
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              <Text style={styles.impactValue}>{formatCount(issue.metrics.twitterImpressions)}</Text>
              <Text style={styles.impactLabel}>Views</Text>
            </View>
          )}
        </View>
      </View>

      {/* Twitter Amplification Card (if posted to Twitter) */}
      {tweetUrl && (
        <TouchableOpacity
          style={styles.twitterCard}
          onPress={() => Linking.openURL(tweetUrl)}
          activeOpacity={0.7}
        >
          <View style={styles.twitterCardHeader}>
            <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
            <Text style={styles.twitterCardTitle}>Amplified on Twitter</Text>
          </View>
          <Text style={styles.twitterCardSubtitle}>
            This issue has been posted to Twitter and tagged with relevant authorities
          </Text>
          <View style={styles.twitterCardButton}>
            <Text style={styles.twitterCardButtonText}>View Tweet</Text>
            <Ionicons name="open-outline" size={16} color="#1DA1F2" />
          </View>
        </TouchableOpacity>
      )}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {/* Upvote Button */}
        <Pressable onPress={() => onVote(1)} style={styles.voteButton} hitSlop={8}>
          <Ionicons
            name={vote === 1 ? 'arrow-up' : 'arrow-up-outline'}
            size={28}
            color={vote === 1 ? '#FF6B3D' : '#6B7280'}
          />
          <Text style={[styles.voteCount, vote === 1 && styles.voteCountActive]}>{formatCount(up)}</Text>
        </Pressable>

        {/* Share Button */}
        <Pressable onPress={handleShare} style={styles.shareButton} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color="#2563EB" />
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>
          Comments ({comments.length})
        </Text>

        {comments.length === 0 ? (
          <View style={styles.emptyComments}>
            <Ionicons name="chatbubble-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyCommentsText}>No comments yet</Text>
            <Text style={styles.emptyCommentsSubtext}>Be the first to join the conversation</Text>
          </View>
        ) : (
          <View style={styles.commentsTree}>{tree}</View>
        )}
      </View>

      {/* Comment Input */}
      <View style={styles.commentInputSection}>
        {replyTo && (
          <View style={styles.replyingTo}>
            <Text style={styles.replyingToText}>Replying to comment...</Text>
            <Pressable onPress={() => setReplyTo(null)} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </Pressable>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={replyTo ? 'Write a reply...' : 'Join the conversation...'}
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
            accessibilityLabel={replyTo ? 'Reply' : 'Comment'}
          />
          <Pressable
            onPress={addComment}
            style={[styles.sendButton, !content.trim() && styles.sendButtonDisabled]}
            disabled={!content.trim()}
          >
            <Ionicons name="send" size={20} color={content.trim() ? '#2563EB' : '#D1D5DB'} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: 100,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  headerSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 12,
    lineHeight: 32,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#23272F',
    lineHeight: 24,
  },
  impactSection: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 12,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#23272F',
    marginTop: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  twitterCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  twitterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  twitterCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  twitterCardSubtitle: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 12,
    lineHeight: 20,
  },
  twitterCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  twitterCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1DA1F2',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  voteCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  voteCountActive: {
    color: '#FF6B3D',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  commentsSection: {
    padding: 16,
  },
  commentsTree: {
    marginTop: 12,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  commentInputSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  replyingTo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  replyingToText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#23272F',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
});
