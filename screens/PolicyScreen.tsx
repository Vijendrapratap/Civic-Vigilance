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

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  text: { color: '#444', lineHeight: 20 }
});
