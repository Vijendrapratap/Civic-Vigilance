import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '../constants/DesignSystem';

type Props = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  right?: React.ReactNode;
  tint?: string;
};

export default function ListItem({ title, subtitle, icon, onPress, right, tint }: Props) {
  // Use passed tint or default to Primary Light 
  const iconBg = tint || Colors.primaryLight;

  return (
    <Pressable
      onPress={onPress}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel={title}
      hitSlop={8}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={Colors.primaryDark} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />}
    </Pressable>
  );
}

// ... styles begin

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface, // Changed from #0f1715 (Black) to Surface (White/Light Grey)
    marginBottom: Spacing.sm,
    ...Shadows.sm, // Add subtle shadow for lift
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    backgroundColor: Colors.primaryLight, // Ensure icon bg is consistent
  },
  content: { flex: 1 },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textMain
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2
  }
});
