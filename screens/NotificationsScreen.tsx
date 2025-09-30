import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { loadPrefs, savePrefs, NotificationPrefs } from '../lib/profile';

export default function NotificationsScreen() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  useEffect(() => { loadPrefs().then(setPrefs); }, []);

  if (!prefs) return null;
  const update = async (k: keyof NotificationPrefs, v: boolean) => {
    const next = { ...prefs, [k]: v };
    setPrefs(next); await savePrefs(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Row label="Comments on issues" value={prefs.issue_comments} onValueChange={(v) => update('issue_comments', v)} />
      <Row label="Updates to my reports" value={prefs.my_reports_updates} onValueChange={(v) => update('my_reports_updates', v)} />
      <Row label="Mentions & replies" value={prefs.mentions} onValueChange={(v) => update('mentions', v)} />
      <Row label="Nearby issues" value={prefs.nearby_issues} onValueChange={(v) => update('nearby_issues', v)} />
      <Row label="Email updates" value={prefs.email_updates} onValueChange={(v) => update('email_updates', v)} />
      <Text style={styles.hint}>You can change OS-level permissions in iOS Settings.</Text>
    </View>
  );
}

function Row({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={{ flex: 1 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  hint: { color: '#666', marginTop: 12 }
});

