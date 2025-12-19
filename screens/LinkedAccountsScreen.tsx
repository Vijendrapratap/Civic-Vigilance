import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LinkedAccountsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linked Accounts</Text>
      <Text style={styles.text}>Social account linking is disabled in this build. Email/password is used for sign in.</Text>
      <Text style={styles.text}>You can enable providers later in Supabase and add linking here.</Text>
    </View>
  );
}

import { Colors, Spacing, Typography } from '../constants/DesignSystem';

// ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.background
  },
  title: {
    ...Typography.h3,
    color: Colors.textMain
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary
  }
});

