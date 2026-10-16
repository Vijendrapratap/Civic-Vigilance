import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/DesignSystem';

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
  wrap: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceHighlight },
  active: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  activeText: { color: Colors.textInverse, fontWeight: '700' },
  text: { color: Colors.textSecondary, fontWeight: '600' },
});
