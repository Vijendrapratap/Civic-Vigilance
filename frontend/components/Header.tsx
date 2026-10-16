import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Colors, Spacing, Shadows } from '../constants/DesignSystem';

export default function Header() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require('../assets/Featured_Image.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

// ... (imports)

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md, // slightly taller
    backgroundColor: Colors.surface,
    // Remove solid border, add modern shadow
    borderBottomWidth: 0,
    ...Shadows.sm,
    zIndex: 10, // Ensure shadow casts on content
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 140, // Slightly smaller, elegant logo
    height: 28
  }
});
