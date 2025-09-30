import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { supabase } from '../lib/supabase';
import { Comment, Issue } from '../types';

export default function PostDetailScreen({ route }: any) {
  const { id } = route.params as { id: string };
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.from('issues').select('*').eq('id', id).single();
      setIssue(data as any);
      const { data: c } = await supabase.from('comments').select('*').eq('issue_id', id).order('created_at', { ascending: true });
      setComments((c as any) || []);
    };
    run();
  }, [id]);

  const addComment = async () => {
    if (!content.trim()) return;
    const { data, error } = await supabase.from('comments').insert({ issue_id: id, content }).select('*').single();
    if (!error && data) setComments((prev) => [...prev, data as any]);
    setContent('');
  };

  if (!issue) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      {!!issue.address && <Text style={styles.meta}>{issue.address}</Text>}
      <Text style={{ marginVertical: 12 }}>{issue.description}</Text>
      <Text style={styles.h2}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <Text style={styles.comment}>• {item.content}</Text>}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
      <View style={styles.row}>
        <TextInput value={content} onChangeText={setContent} placeholder="Add a comment" style={styles.input} />
        <Button title="Send" onPress={addComment} />
      </View>
    </View>
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
