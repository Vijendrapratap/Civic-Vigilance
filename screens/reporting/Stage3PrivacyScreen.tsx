/**
 * Stage 3: Privacy & Amplification Selection
 * PRD Section 5.2 - Stage 3: Privacy & Amplification (THE KEY FEATURE)
 *
 * This is the CORE DIFFERENTIATOR of CivicVigilance.
 * Users choose HOW to amplify their voice:
 * 1. 🛡️ Via @CivicVigilance (anonymous, app posts for them)
 * 2. 👤 Via My Twitter (public, user posts from their account)
 * 3. 🔒 App Only (100% private, no Twitter posting)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import { TwitterPostingMethod } from '../../types';

interface Props {
  onContinue: (privacyChoice: {
    method: TwitterPostingMethod;
    rememberChoice: boolean;
  }) => void;
  onBack: () => void;
  defaultMethod?: TwitterPostingMethod; // User's saved preference
}

export default function Stage3PrivacyScreen({ onContinue, onBack, defaultMethod }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<TwitterPostingMethod>(
    defaultMethod || 'civic_vigilance'
  );
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleContinue = () => {
    if (selectedMethod === 'personal') {
      // Check if Twitter is connected
      // TODO: Implement Twitter OAuth check
      Alert.alert(
        'Twitter Connection Required',
        'To post from your personal account, you need to connect your Twitter account.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Connect Twitter',
            onPress: () => {
              // TODO: Navigate to Twitter OAuth flow
              Alert.alert('Coming Soon', 'Twitter OAuth integration will be added soon.');
            },
          },
        ]
      );
      return;
    }

    onContinue({
      method: selectedMethod,
      rememberChoice,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose How to Amplify Your Voice</Text>
        <Text style={styles.subtitle}>
          Select how you want to share this issue with authorities and the community
        </Text>
      </View>

      {/* Option 1: Via @CivicVigilance (Recommended) */}
      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedMethod === 'civic_vigilance' && styles.optionCardSelected,
        ]}
        onPress={() => setSelectedMethod('civic_vigilance')}
      >
        <View style={styles.optionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="shield-checkmark"
              size={32}
              color={selectedMethod === 'civic_vigilance' ? '#2563EB' : '#6B7280'}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.titleRow}>
              <Text style={styles.optionTitle}>🛡️ Via @CivicVigilance</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            </View>
            <Text style={styles.optionSubtitle}>
              Post anonymously. Your identity is protected.
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Authorities tagged on Twitter</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Your identity is protected</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Visible to public + app community</Text>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>📋 How it works:</Text>
          <Text style={styles.howItWorksText}>
            • We post on Twitter from @CivicVigilance{'\n'}
            • Authorities are tagged automatically{'\n'}
            • Your name never appears publicly{'\n'}
            • Community can upvote to amplify
          </Text>
        </View>
      </TouchableOpacity>

      {/* Option 2: Via My Twitter */}
      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedMethod === 'personal' && styles.optionCardSelected,
        ]}
        onPress={() => setSelectedMethod('personal')}
      >
        <View style={styles.optionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="person"
              size={32}
              color={selectedMethod === 'personal' ? '#2563EB' : '#6B7280'}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.optionTitle}>👤 Via My Twitter</Text>
            <Text style={styles.optionSubtitle}>
              Build your civic reputation. Your followers see your impact.
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Posted from YOUR Twitter account</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Authorities tagged from you</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="information-circle" size={20} color="#F59E0B" />
            <Text style={styles.featureText}>Your identity is PUBLIC</Text>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>📋 How it works:</Text>
          <Text style={styles.howItWorksText}>
            • You post from your Twitter account{'\n'}
            • Your followers see your civic action{'\n'}
            • Build reputation as civic activist{'\n'}
            • Requires Twitter connection
          </Text>
        </View>
      </TouchableOpacity>

      {/* Option 3: App Only */}
      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedMethod === 'none' && styles.optionCardSelected,
        ]}
        onPress={() => setSelectedMethod('none')}
      >
        <View style={styles.optionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed"
              size={32}
              color={selectedMethod === 'none' ? '#2563EB' : '#6B7280'}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.optionTitle}>🔒 App Only</Text>
            <Text style={styles.optionSubtitle}>
              100% private. Visible only to app users. No Twitter posting.
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            <Text style={styles.featureText}>Visible to CivicVigilance app users</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.featureText}>NOT posted to Twitter</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.featureText}>Authorities NOT automatically notified</Text>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>📋 Use case:</Text>
          <Text style={styles.howItWorksText}>
            • Internal neighborhood tracking{'\n'}
            • RWA-only visibility{'\n'}
            • Testing before going public{'\n'}
            • Lower pressure on authorities
          </Text>
        </View>
      </TouchableOpacity>

      {/* Remember Choice Checkbox */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberChoice(!rememberChoice)}
        >
          <Ionicons
            name={rememberChoice ? 'checkbox' : 'square-outline'}
            size={24}
            color="#2563EB"
          />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Remember my choice for future reports</Text>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
        <Text style={styles.infoText}>
          You can always change this setting later in Settings → Privacy Defaults
        </Text>
      </View>

      <View style={{ height: 120 }} />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Button title="← Back" onPress={onBack} variant="outline" style={{ flex: 1 }} />
        <Button title="Next: Preview" onPress={handleContinue} style={{ flex: 2 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#23272F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23272F',
  },
  recommendedBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  featureList: {
    marginTop: 12,
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
  },
  howItWorks: {
    marginTop: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  howItWorksTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#23272F',
    marginBottom: 6,
  },
  howItWorksText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
});
