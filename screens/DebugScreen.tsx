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

import { Colors, Spacing, Typography, BorderRadius } from '../constants/DesignSystem';

// ...

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.background,
    minHeight: '100%'
  },
  title: {
    ...Typography.h2,
    color: Colors.textMain
  },
  h2: {
    ...Typography.h3,
    color: Colors.textMain,
    marginBottom: Spacing.sm
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs
  },
  key: {
    ...Typography.bodySm,
    fontWeight: '600',
    color: Colors.textSecondary
  },
  val: {
    ...Typography.bodySm,
    color: Colors.textMain,
    flexShrink: 1,
    textAlign: 'right'
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md
  }
});
