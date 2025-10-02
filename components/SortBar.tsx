import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

export default function SortBar({ value, onChange }: { value: 'trending' | 'newest' | 'nearby'; onChange: (v: 'trending' | 'newest' | 'nearby') => void; }) {
  return (
    <View style={styles.wrap}>
      {(['trending', 'newest', 'nearby'] as const).map((k) => (
        <Pressable
          key={k}
          style={[styles.chip, value === k && styles.active]}
          onPress={() => onChange(k)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === k }}
          accessibilityLabel={`Sort by ${k}`}
          hitSlop={8}
        >
          <Text style={value === k ? styles.activeText : styles.text}>{k}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(148,163,184,0.35)', backgroundColor: 'rgba(15, 23, 42, 0.6)' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  activeText: { color: '#fff', fontWeight: '700' },
  text: { color: colors.subtext, fontWeight: '600' }
});
