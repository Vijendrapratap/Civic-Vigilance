import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, Animated } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/DesignSystem';

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
  startIcon?: React.ReactNode;
};

export default function TextField({ label, errorText, style, startIcon, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={{ width: '100%', marginBottom: Spacing.sm }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        !!errorText && styles.inputError,
        style
      ]}>
        {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label || (rest.placeholder as string) || undefined}
          {...rest}
        />
      </View>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: Colors.textSecondary,
    ...Typography.bodySm,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  input: {
    flex: 1,
    color: Colors.textMain,
    ...Typography.body,
    height: '100%',
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
  iconContainer: {
    marginRight: 10,
  },
  error: {
    marginTop: 4,
    color: Colors.error,
    ...Typography.caption,
    marginLeft: 4,
  },
});
