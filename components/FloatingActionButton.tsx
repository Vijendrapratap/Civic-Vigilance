import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.fab} onPress={onPress} accessibilityLabel="Create a new report">
      <Text style={styles.plus}>＋</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  plus: { color: '#fff', fontSize: 26, lineHeight: 26, marginTop: -2 }
});

