import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../lib/policies';

export default function PolicyScreen({ route }: any) {
  const { type } = route.params as { type: 'privacy' | 'terms' };
  const text = type === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</Text>
      {text.split('\n\n').map((p, idx) => (
        <Text key={idx} style={styles.text}>{p}</Text>
      ))}
    </ScrollView>
  );
}

import { Colors, Spacing, Typography } from '../constants/DesignSystem';

// ...

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.background,
    minHeight: '100%'
  },
  title: {
    ...Typography.h2,
    color: Colors.textMain,
    marginBottom: Spacing.sm
  },
  text: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm
  }
});
