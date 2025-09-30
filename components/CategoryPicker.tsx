import React from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';

const CATS = [
  { key: 'pothole', label: 'Pothole' },
  { key: 'garbage', label: 'Garbage' },
  { key: 'streetlight', label: 'Streetlight' },
  { key: 'water', label: 'Water Leak' },
  { key: 'other', label: 'Other' },
] as const;

export type CategoryKey = typeof CATS[number]["key"];

export default function CategoryPicker({ value, onChange }: { value: CategoryKey; onChange: (v: CategoryKey) => void; }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CATS.map(c => (
        <Pressable key={c.key} style={[styles.chip, value === c.key && styles.active]} onPress={() => onChange(c.key)}>
          <Text style={value === c.key ? styles.activeText : styles.text}>{c.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f0f2f5' },
  active: { backgroundColor: '#111' },
  text: { color: '#111' },
  activeText: { color: '#fff', fontWeight: '700' }
});

