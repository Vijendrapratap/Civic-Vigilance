/**
 * Username Selection Screen
 * PRD Section 5.1.1 - Step 2: Username Selection
 *
 * User can choose:
 * 1. Anonymous (auto-generated: Anonymous_Citizen_XXXX)
 * 2. Custom username (validated)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import {
  generateAnonymousUsername,
  validateUsername,
  suggestAlternativeUsernames,
  isAnonymousUsername,
} from '../lib/username';
import { saveProfile } from '../lib/profile';

export default function UsernameSelectionScreen() {
  const navigation = useNavigation();
  const { session, refreshProfile } = useAuth();
  const [mode, setMode] = useState<'anonymous' | 'custom'>('anonymous');
  const [anonymousUsername, setAnonymousUsername] = useState(generateAnonymousUsername());
  const [customUsername, setCustomUsername] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [keepAnonymous, setKeepAnonymous] = useState(true);

  // Regenerate anonymous username when user taps
  const regenerateAnonymous = () => {
    setAnonymousUsername(generateAnonymousUsername());
  };

  // Validate custom username as user types
  useEffect(() => {
    if (mode === 'custom' && customUsername.length > 0) {
      const validation = validateUsername(customUsername);
      setValidationError(validation.isValid ? null : validation.error || null);
    } else {
      setValidationError(null);
    }
  }, [customUsername, mode]);

  const handleContinue = async () => {
    const finalUsername = mode === 'anonymous' ? anonymousUsername : customUsername;
    const isAnonymous = mode === 'anonymous' ? true : keepAnonymous;

    if (mode === 'custom') {
      // Validate custom username
      const validation = validateUsername(customUsername);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid username');
        return;
      }
    }

    setIsSaving(true);

    try {
      if (!session?.user?.id) {
        throw new Error('No user session found');
      }

      // Save username to profile
      if (__DEV__) console.log('[UsernameSelection] Saving username to profile...', {
        username: finalUsername,
        anonymousMode: isAnonymous,
        userId: session.user.id,
      });

      // Update user profile with username
      await saveProfile({
        id: session.user.id,
        full_name: finalUsername, // Storing in full_name as per current schema
        // Note: We're storing username in full_name field for now
      });

      if (__DEV__) console.log('[UsernameSelection] Username saved successfully. Refreshing profile...');

      await refreshProfile();

      if (__DEV__) console.log('[UsernameSelection] Profile refreshed.');

      // Show success message
      Alert.alert(
        'Welcome!',
        `Your username has been set to: ${finalUsername}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to the main app tabs
              // @ts-ignore
              navigation.navigate('AppTabs');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('[UsernameSelection] Error saving username:', error);
      Alert.alert('Error', error.message || 'Failed to save username. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Voice</Text>
          <Text style={styles.subtitle}>How you'll appear to the community</Text>
        </View>

        {/* Anonymous Option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            mode === 'anonymous' && styles.optionCardSelected,
          ]}
          onPress={() => setMode('anonymous')}
        >
          <View style={styles.optionHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={32}
              color={mode === 'anonymous' ? '#2563EB' : '#666'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.optionTitle}>Anonymous (Recommended)</Text>
              <Text style={styles.optionSubtitle}>
                Your identity is protected. Tap to regenerate.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.usernameDisplay}
            onPress={regenerateAnonymous}
            disabled={mode !== 'anonymous'}
          >
            <Text style={styles.username}>🎭 {anonymousUsername}</Text>
            <Ionicons name="refresh" size={20} color="#2563EB" />
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        {/* Custom Username Option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            mode === 'custom' && styles.optionCardSelected,
          ]}
          onPress={() => setMode('custom')}
        >
          <View style={styles.optionHeader}>
            <Ionicons
              name="person-outline"
              size={32}
              color={mode === 'custom' ? '#2563EB' : '#666'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.optionTitle}>Custom Username</Text>
              <Text style={styles.optionSubtitle}>
                Build your civic reputation
              </Text>
            </View>
          </View>

          {mode === 'custom' && (
            <View style={styles.customInputContainer}>
              <TextField
                label="Enter custom username"
                placeholder="e.g., RoadWarrior"
                value={customUsername}
                onChangeText={setCustomUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
              {validationError && (
                <Text style={styles.errorText}>❌ {validationError}</Text>
              )}
              {!validationError && customUsername.length >= 3 && (
                <Text style={styles.successText}>✓ Username is valid</Text>
              )}

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setKeepAnonymous(!keepAnonymous)}
                >
                  <Ionicons
                    name={keepAnonymous ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#2563EB"
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>
                  Keep me anonymous (you can still post anonymously even with a custom username)
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.noteText}>
            You can always post anonymously regardless of username. Change this later in Settings.
          </Text>
        </View>

        <Button
          title={isSaving ? 'Saving...' : 'Continue'}
          onPress={handleContinue}
          disabled={
            isSaving ||
            (mode === 'custom' &&
              (customUsername.length < 3 || !!validationError))
          }
        />

        {isSaving && (
          <ActivityIndicator style={{ marginTop: 16 }} color="#2563EB" />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fafafa',
    minHeight: '100%',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  optionCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#23272F',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  usernameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    padding: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#23272F',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginVertical: 8,
  },
  customInputContainer: {
    marginTop: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  successText: {
    color: '#34D399',
    fontSize: 14,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
