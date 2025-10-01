import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../../lib/theme';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, variant = 'primary', style }: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        variant === 'ghost' && styles.ghost,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, (isOutline || variant === 'ghost') && { color: colors.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    backgroundColor: colors.card,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
