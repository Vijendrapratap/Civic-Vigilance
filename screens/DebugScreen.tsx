import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getBackend } from '../lib/backend';
import { isSupabaseConfigured } from '../lib/supabase';

export default function DebugScreen() {
  const backend = getBackend();
  const supaUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supaAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Info</Text>
      <Row k="Backend" v={backend} />
      <Row k="Supabase configured" v={String(isSupabaseConfigured)} />
      <View style={styles.card}>
        <Text style={styles.h2}>Supabase</Text>
        <Row k="url" v={supaUrl || '(not set)'} />
        <Row k="anon key" v={supaAnonKey ? `${supaAnonKey.substring(0, 20)}...` : '(not set)'} />
      </View>
      <Text style={styles.hint}>Note: Restart Expo after changing .env (use cache clear).</Text>
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}><Text style={styles.key}>{k}</Text><Text style={styles.val}>{v}</Text></View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  h2: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f2f4f8' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  key: { color: '#333', fontWeight: '600' },
  val: { color: '#111' },
  hint: { color: '#666', marginTop: 12 }
});
