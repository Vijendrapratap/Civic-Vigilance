/**
 * Stage 5: Success Celebration
 * PRD Section 5.2 - Stage 5: Submission & Confirmation
 *
 * Features:
 * - Celebratory UI with animation
 * - Summary of what happened
 * - Action buttons (View Post, Share More, Done)
 * - Deep link to issue detail
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import { TwitterPostingMethod } from '../../types';

interface Props {
  issueId: string;
  privacy: TwitterPostingMethod;
  tweetUrl?: string;
  onViewPost: () => void;
  onShareMore: () => void;
  onDone: () => void;
}

export default function Stage5SuccessScreen({
  issueId,
  privacy,
  tweetUrl,
  onViewPost,
  onShareMore,
  onDone,
}: Props) {
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Celebration animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Success Icon with Animation */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={64} color="#fff" />
        </View>
      </Animated.View>

      {/* Success Message */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>🎉 Success!</Text>
        <Text style={styles.subtitle}>Your voice is now live!</Text>

        {/* What Happened Summary */}
        <View style={styles.summaryBox}>
          {privacy !== 'none' && (
            <View style={styles.summaryRow}>
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
              <Text style={styles.summaryText}>
                {privacy === 'civic_vigilance'
                  ? 'Posted to Twitter via @CivicVigilance'
                  : 'Posted from your Twitter account'}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Ionicons name="people" size={20} color="#2563EB" />
            <Text style={styles.summaryText}>Visible to your community</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="megaphone" size={20} color="#7C3AED" />
            <Text style={styles.summaryText}>Others can upvote to amplify</Text>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>The more upvotes, the harder to ignore.</Text>
          <Text style={styles.ctaText}>
            Share with neighbors to get more attention on this issue!
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="View Post"
            onPress={onViewPost}
            style={styles.primaryButton}
          />

          <Button
            title="Share More"
            onPress={onShareMore}
            variant="outline"
            style={styles.secondaryButton}
          />

          <Pressable onPress={onDone} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>

        {/* Tweet Link (if posted to Twitter) */}
        {tweetUrl && (
          <Pressable onPress={() => {
            // TODO: Open Twitter URL
            console.log('[Success] Opening tweet:', tweetUrl);
          }}>
            <Text style={styles.tweetLink}>🐦 View on Twitter</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34D399',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
  },
  ctaBox: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  doneButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  doneText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  tweetLink: {
    marginTop: 24,
    fontSize: 15,
    color: '#1DA1F2',
    fontWeight: '600',
  },
});
