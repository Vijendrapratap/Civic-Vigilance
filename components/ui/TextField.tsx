import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
};

export default function TextField({ label, errorText, style, ...rest }: Props) {
  return (
    <View style={{ width: '100%' }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#9aa0a6"
        accessibilityLabel={label || (rest.placeholder as string) || undefined}
        {...rest}
      />
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, color: '#555', fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111',
  },
  error: { marginTop: 6, color: 'crimson' },
});
