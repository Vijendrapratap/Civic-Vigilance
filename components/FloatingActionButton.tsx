import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.fab} onPress={onPress} accessibilityLabel="Open camera to report">
      <Ionicons name="camera" size={30} color="#0f1826" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 26,
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#00AEEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00AEEF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  
});
