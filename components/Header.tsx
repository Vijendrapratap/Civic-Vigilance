import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title = 'CivicVigilance' }: { title?: string }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="shield-checkmark" size={20} color="#fff" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
