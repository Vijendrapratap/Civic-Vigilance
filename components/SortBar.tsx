import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function SortBar({ value, onChange }: { value: 'trending' | 'newest' | 'nearby'; onChange: (v: 'trending' | 'newest' | 'nearby') => void; }) {
  return (
    <View style={styles.wrap}>
      {(['trending', 'newest', 'nearby'] as const).map((k) => (
        <Pressable key={k} style={[styles.chip, value === k && styles.active]} onPress={() => onChange(k)}>
          <Text style={value === k ? styles.activeText : undefined}>{k}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#ddd' },
  active: { backgroundColor: '#111' },
  activeText: { color: '#fff' }
});

