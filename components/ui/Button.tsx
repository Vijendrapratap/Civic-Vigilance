import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, Animated, View } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/DesignSystem';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, variant = 'primary', size = 'md', icon, style }: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';

  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 12,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 4,
    }).start();
  };

  // Size styles
  const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const textSizeStyle = size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Animated.View style={[
        styles.base,
        sizeStyle,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isSecondary && styles.secondary,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
        { transform: [{ scale: scaleValue }] }
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.text,
          textSizeStyle,
          isPrimary && styles.textInverse,
          isOutline && styles.textPrimary,
          isSecondary && styles.textPrimary,
          isDanger && styles.textInverse,
          isGhost && styles.textPrimary,
        ]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 60,
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
    borderWidth: 0,
    shadowColor: Colors.primary, // Tinted shadow
  },
  secondary: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 0,
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
    ...Shadows.sm,
    shadowColor: Colors.error,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.border,
    shadowOpacity: 0,
  },
  // Text
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
  textInverse: {
    color: Colors.textInverse,
  },
  textPrimary: {
    color: Colors.primary,
  },
  iconContainer: {
    marginRight: 8,
  },
});
