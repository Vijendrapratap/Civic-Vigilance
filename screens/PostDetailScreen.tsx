import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, ScrollView } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Comment, Issue } from '../types';
import { getIssueByIdSqlite, listCommentsSqlite, addCommentSqlite, castVoteSqlite, getUserVoteSqlite } from '../lib/sqliteIssues';
import ActionBar from '../components/ActionBar';
import { castVote, getUserVote } from '../lib/votes';
import { useAuth } from '../hooks/useAuth';

export default function PostDetailScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const [issue, setIssue] = useState<Issue | null>(null);
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
      if (!isSupabaseConfigured) {
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

  const addComment = async () => {
    if (!content.trim()) return;
    if (!isSupabaseConfigured) {
      const c = await addCommentSqlite(Number(id), localUserId, content, replyTo ? Number(replyTo) : undefined);
      setComments((prev) => [...prev, c as any]);
    } else {
      const { data, error } = await supabase.from('comments').insert({ issue_id: id, content, parent_id: replyTo }).select('*').single();
      if (!error && data) setComments((prev) => [...prev, data as any]);
    }
    setContent('');
    setReplyTo(null);
  };

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

  const tree = useMemo(() => {
    const map = new Map<string, any[]>();
    const roots: any[] = [];
    comments.forEach(c => { map.set(c.id, []); });
    comments.forEach(c => {
      if (c.parent_id) {
        const arr = map.get(c.parent_id) || [];
        arr.push(c); map.set(c.parent_id, arr);
      } else {
        roots.push(c);
      }
    });
    function renderNode(c: any, level = 0) {
      return (
        <View key={c.id} style={{ paddingLeft: 8 + level * 16, paddingVertical: 10, borderLeftWidth: level > 0 ? 2 : 0, borderLeftColor: '#e5e7eb' }}>
          <Text style={{ fontWeight: '700' }}>@user</Text>
          <Text style={{ marginTop: 4 }}>{c.content}</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Pressable onPress={() => setReplyTo(c.id)}><Text style={{ color: '#0066cc', fontWeight: '600' }}>Reply</Text></Pressable>
          </View>
          {(map.get(c.id) || []).map(child => renderNode(child, level + 1))}
        </View>
      );
    }
    return roots.map(r => renderNode(r));
  }, [comments]);

  if (!issue) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      {!!issue.address && <Text style={styles.meta}>{issue.address}</Text>}
      <Text style={{ marginVertical: 12 }}>{issue.description}</Text>
      <ActionBar vote={vote} upvotes={up} downvotes={down} comments={comments.length} onUpvote={() => onVote(1)} onDownvote={() => onVote(-1)} />
      <Text style={styles.h2}>Comments</Text>
      <View>{tree}</View>
      <View style={[styles.row, { marginTop: 16 }]}>
        {replyTo && <Pressable onPress={() => setReplyTo(null)}><Text style={{ color: '#0066cc', marginRight: 8 }}>Cancel reply</Text></Pressable>}
        <TextInput value={content} onChangeText={setContent} placeholder={replyTo ? 'Reply…' : 'Join the conversation'} style={styles.input} />
        <Button title="Send" onPress={addComment} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  h2: { fontSize: 16, fontWeight: '600', marginTop: 16 },
  comment: { paddingVertical: 6 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 }
});
