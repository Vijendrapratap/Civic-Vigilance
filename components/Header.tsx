import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/theme';

export default function Header({ title = 'CivicVigilance' }: { title?: string }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' }
});
