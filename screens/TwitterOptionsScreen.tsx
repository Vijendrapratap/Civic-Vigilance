/**
 * Twitter Posting Options Screen
 * Critical feature as per PDF section 2.3.5
 * Allows users to choose how to share their report:
 * 1. Post via @CivicVigilance (default, protects privacy)
 * 2. Post via personal Twitter account (build civic reputation)
 * 3. Don't post to Twitter (app only, complete privacy)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TwitterPostingMethod } from '../types';
import { colors } from '../lib/theme';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

interface TwitterOptionsScreenProps {
  navigation: any;
  route: {
    params: {
      reportData: {
        title: string;
        description?: string;
        category: string;
        imageUrl: string;
        lat: number;
        lng: number;
        address: string;
        accuracy: number;
        authorities: any[];
      };
    };
  };
}

export default function TwitterOptionsScreen({ navigation, route }: TwitterOptionsScreenProps) {
  const { reportData } = route.params;
  const { session } = useAuth();

  // Get user's default preference or default to civic_vigilance
  const [selectedMethod, setSelectedMethod] = useState<TwitterPostingMethod>(
    'civic_vigilance'
  );
  const [rememberChoice, setRememberChoice] = useState(false);

  const isTwitterConnected = false;
  const userTwitterHandle = '';

  const handleNext = () => {
    // Navigate to preview screen with selected method
    navigation.navigate('ReportPreview', {
      reportData,
      twitterMethod: selectedMethod,
      rememberChoice,
    });
  };

  const handleConnectTwitter = async () => {
    // Navigate to Twitter connection flow
    navigation.navigate('LinkedAccounts');
  };

  const renderOption = (
    method: TwitterPostingMethod,
    icon: string,
    title: string,
    handle: string | null,
    benefits: string[],
    note: string,
    disabled: boolean = false
  ) => {
    const isSelected = selectedMethod === method;

    return (
      <Pressable
        style={[
          styles.optionCard,
          isSelected && styles.optionCardSelected,
          disabled && styles.optionCardDisabled,
        ]}
        onPress={() => !disabled && setSelectedMethod(method)}
        disabled={disabled}
      >
        {/* Selection Radio Button */}
        <View style={styles.radioContainer}>
          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>

        {/* Option Content */}
        <View style={styles.optionContent}>
          {/* Title and Handle */}
          <Text style={styles.optionTitle}>{title}</Text>
          {handle && (
            <View style={styles.handleContainer}>
              <Ionicons name="logo-twitter" size={16} color="#1DA1F2" />
              <Text style={styles.handle}>{handle}</Text>
            </View>
          )}

          {/* Benefits List */}
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Note */}
          <Text style={styles.noteText}>{note}</Text>

          {/* Connect Twitter Button (for personal option if not connected) */}
          {method === 'personal' && !isTwitterConnected && (
            <Button
              title="Connect Twitter"
              onPress={handleConnectTwitter}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share on Twitter?</Text>
          <Text style={styles.headerSubtitle}>
            Choose how you want to share your civic report
          </Text>
        </View>

        {/* Option 1: Post via Civic Vigilance (DEFAULT/RECOMMENDED) */}
        {renderOption(
          'civic_vigilance',
          'shield-checkmark',
          'Post via @CivicVigilance',
          '@CivicVigilance',
          [
            'No Twitter account needed',
            'Your privacy protected',
            'Credited to you within app',
            'Authorities still notified',
          ],
          'This report will appear on the Civic Vigilance Twitter feed with your name credited in the app.'
        )}

        {/* Option 2: Post from My Twitter (if connected) */}
        {renderOption(
          'personal',
          'person',
          `Post via ${isTwitterConnected ? userTwitterHandle : 'My Twitter'}`,
          isTwitterConnected ? userTwitterHandle : null,
          [
            'Posted from your account',
            'Your followers see it',
            'Build your civic reputation',
          ],
          isTwitterConnected
            ? 'This report will be posted from your Twitter account.'
            : 'Connect your Twitter account to post from your personal profile.',
          !isTwitterConnected
        )}

        {/* Option 3: Don't Post to Twitter */}
        {renderOption(
          'none',
          'lock-closed',
          "Don't share on Twitter",
          null,
          ['Report visible in app only', 'Complete privacy', 'Authorities NOT notified on X'],
          'Note: Public Twitter posts often get faster responses from authorities.'
        )}

        {/* Remember Choice Checkbox */}
        <Pressable
          style={styles.checkboxContainer}
          onPress={() => setRememberChoice(!rememberChoice)}
        >
          <View style={[styles.checkbox, rememberChoice && styles.checkboxChecked]}>
            {rememberChoice && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Remember my choice</Text>
        </Pressable>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
          disabled={selectedMethod === 'personal' && !isTwitterConnected}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.subtext,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#00AEEF',
    backgroundColor: 'rgba(0, 174, 239, 0.05)',
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  radioContainer: {
    marginRight: 16,
    paddingTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.subtext,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#00AEEF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00AEEF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  handle: {
    fontSize: 14,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  benefitsList: {
    gap: 8,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmark: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 14,
    color: colors.text,
  },
  noteText: {
    fontSize: 13,
    color: colors.subtext,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.subtext,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00AEEF',
    borderColor: '#00AEEF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  nextButton: {
    width: '100%',
  },
});
