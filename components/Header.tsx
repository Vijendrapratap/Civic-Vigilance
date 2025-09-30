import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title = 'CivicVigilance' }: { title?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' }
});

