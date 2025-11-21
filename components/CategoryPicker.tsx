import React from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';

// PRD Section 16.1 - Issue Categories with Emojis
const CATS = [
  { key: 'pothole', label: '🚧 Potholes', emoji: '🚧' },
  { key: 'garbage', label: '🗑️ Garbage', emoji: '🗑️' },
  { key: 'streetlight', label: '💡 Streetlights', emoji: '💡' },
  { key: 'drainage', label: '🌊 Drainage', emoji: '🌊' },
  { key: 'water_supply', label: '💧 Water Supply', emoji: '💧' },
  { key: 'sewage', label: '🚰 Sewage', emoji: '🚰' },
  { key: 'traffic_signal', label: '🚦 Traffic Signals', emoji: '🚦' },
  { key: 'encroachment', label: '🚧 Encroachment', emoji: '🚧' },
  { key: 'stray_animals', label: '🐕 Stray Animals', emoji: '🐕' },
  { key: 'parks', label: '🌳 Parks', emoji: '🌳' },
  { key: 'other', label: '⚠️ Other', emoji: '⚠️' },
] as const;

export type CategoryKey = typeof CATS[number]["key"];
export const CATEGORY_EMOJIS: Record<CategoryKey, string> = {
  pothole: '🚧',
  garbage: '🗑️',
  streetlight: '💡',
  drainage: '🌊',
  water_supply: '💧',
  sewage: '🚰',
  traffic_signal: '🚦',
  encroachment: '🚧',
  stray_animals: '🐕',
  parks: '🌳',
  other: '⚠️',
};

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

