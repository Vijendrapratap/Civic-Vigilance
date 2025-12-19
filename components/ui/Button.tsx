import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/DesignSystem';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, variant = 'primary', style }: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.5, transform: [] },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        isPrimary && styles.textInverse,
        isOutline && styles.textPrimary,
        isDanger && styles.textInverse,
        isGhost && styles.textPrimary,
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.pill, // Modern pill shape
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
    borderWidth: 0,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
    ...Shadows.sm,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    ...Typography.button,
  },
  textInverse: {
    color: Colors.surface,
  },
  textPrimary: {
    color: Colors.primary,
  },
});
