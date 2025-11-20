/**
 * Stage 4: Preview & Submit
 * PRD Section 5.2 - Stage 4: Preview & Submit
 *
 * Features:
 * - Mock tweet card preview (if Twitter posting)
 * - Authority tag list (editable)
 * - Information box about what happens next
 * - Navigation to edit previous stages
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import { TwitterPostingMethod, CategoryKey } from '../../types';

interface Props {
  photos: string[];
  title: string;
  description: string;
  category: CategoryKey;
  address: string;
  coords: { lat: number; lng: number };
  privacy: TwitterPostingMethod;
  onSubmit: () => void;
  onBack: () => void;
  onEditDetails: () => void;
  onEditPrivacy: () => void;
}

// Category emoji mapping (PRD Section 16.1)
const CATEGORY_EMOJIS: Record<CategoryKey, string> = {
  pothole: '🚧',
  garbage: '🗑️',
  streetlight: '💡',
  drainage: '🌊',
  water_supply: '💧',
  sewage: '🚰',
  traffic_signal: '🚦',
  encroachment: '🚧',
  stray_animals: '🐕',
  parks: '🌳',
  other: '⚠️',
};

export default function Stage4PreviewScreen({
  photos,
  title,
  description,
  category,
  address,
  coords,
  privacy,
  onSubmit,
  onBack,
  onEditDetails,
  onEditPrivacy,
}: Props) {
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load suggested authorities based on location + category
  useEffect(() => {
    // TODO: Implement smart authority matching (PRD Section 7.3)
    // For now, use placeholder authorities
    const suggestedAuthorities = [
      '@cityauthority',
      '@KalyanCorp',
      '@PublicWorks',
    ];
    setAuthorities(suggestedAuthorities);
  }, [coords, category]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('[Preview] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate mock tweet text (PRD Section 16.2)
  const generateTweetText = () => {
    const emoji = CATEGORY_EMOJIS[category];
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    let tweetText = `${emoji} ${category.replace(/_/g, ' ')} reported on ${dateStr}\n`;
    tweetText += `📍 ${address}\n`;
    tweetText += `🗺️ GPS: ${coords.lat.toFixed(5)}°N, ${coords.lng.toFixed(5)}°E\n`;
    tweetText += `Location: https://maps.google.com/?q=${coords.lat},${coords.lng}\n\n`;

    // Add authorities
    if (authorities.length > 0) {
      tweetText += `${authorities.join(' ')}\n\n`;
    }

    // Add description or title
    tweetText += `${description || title}\n\n`;
    tweetText += `Reported via CivicVigilance\n`;
    tweetText += `#CivicVigilance #${category}`;

    return tweetText;
  };

  const tweetText = privacy !== 'none' ? generateTweetText() : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Your Report</Text>
        <Text style={styles.headerSubtitle}>
          Preview how your issue will appear before posting
        </Text>
      </View>

      {/* Mock Tweet Card (if Twitter posting) */}
      {tweetText && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🐦 Twitter Preview</Text>
            <Pressable onPress={onEditPrivacy}>
              <Text style={styles.editLink}>Change</Text>
            </Pressable>
          </View>

          <View style={styles.tweetCard}>
            {/* Tweet Header */}
            <View style={styles.tweetHeader}>
              <View style={styles.tweetAvatar}>
                <Ionicons name="shield-checkmark" size={24} color="#1DA1F2" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.tweetUserRow}>
                  <Text style={styles.tweetUsername}>
                    {privacy === 'civic_vigilance' ? '@CivicVigilance' : 'Your Twitter'}
                  </Text>
                  {privacy === 'civic_vigilance' && (
                    <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" />
                  )}
                </View>
                <Text style={styles.tweetTime}>Now</Text>
              </View>
            </View>

            {/* Tweet Body */}
            <Text style={styles.tweetText}>{tweetText}</Text>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <View style={styles.tweetPhotos}>
                {photos.slice(0, 2).map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.tweetPhoto} />
                ))}
                {photos.length > 2 && (
                  <View style={styles.morePhotos}>
                    <Text style={styles.morePhotosText}>+{photos.length - 2}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <Text style={styles.privacyNote}>
            {privacy === 'civic_vigilance'
              ? '✅ Posted from @CivicVigilance account (anonymous)'
              : '✅ Posted from your Twitter account (public)'}
          </Text>
        </View>
      )}

      {/* Authorities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📢 Authorities Tagged</Text>
          <Pressable>
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.authoritiesList}>
          {authorities.map((handle, index) => (
            <View key={index} style={styles.authorityChip}>
              <Ionicons name="at" size={16} color="#2563EB" />
              <Text style={styles.authorityText}>{handle.replace('@', '')}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hintText}>
          📍 Based on your location in {address.split(',')[1]?.trim() || 'your area'}
        </Text>
      </View>

      {/* Issue Details Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Issue Details</Text>
          <Pressable onPress={onEditDetails}>
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Title:</Text>
            <Text style={styles.detailValue}>{title}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>
              {CATEGORY_EMOJIS[category]} {category.replace(/_/g, ' ')}
            </Text>
          </View>
          {description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{description}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{address}</Text>
          </View>
        </View>
      </View>

      {/* What Happens Next */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#2563EB" />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>ℹ️ What happens after you post?</Text>
          <Text style={styles.infoText}>
            ✅ Your issue appears in CivicVigilance feed{'\n'}
            {privacy !== 'none' && '✅ Authorities get tagged on Twitter\n'}
            ✅ Community can upvote to amplify{'\n'}
            ✅ More upvotes = More visibility{'\n\n'}
            ⚠️ Note: We don't track government action.{'\n'}
            We give your issue a louder voice.
          </Text>
        </View>
      </View>

      <View style={{ height: 120 }} />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Button title="← Back" onPress={onBack} variant="outline" style={{ flex: 1 }} />
        <Button
          title={isSubmitting ? 'Posting...' : 'Post Issue'}
          onPress={handleSubmit}
          style={{ flex: 2 }}
          disabled={isSubmitting}
        />
      </View>

      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Posting your issue...</Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#23272F',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#23272F',
  },
  editLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  tweetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tweetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tweetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tweetUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tweetUsername: {
    fontSize: 15,
    fontWeight: '700',
    color: '#23272F',
  },
  tweetTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  tweetText: {
    fontSize: 14,
    color: '#23272F',
    lineHeight: 20,
    marginBottom: 12,
  },
  tweetPhotos: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tweetPhoto: {
    width: '48%',
    height: 150,
    borderRadius: 12,
  },
  morePhotos: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 8,
  },
  morePhotosText: {
    color: '#fff',
    fontWeight: '700',
  },
  privacyNote: {
    fontSize: 13,
    color: '#059669',
    marginTop: 8,
  },
  authoritiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  authorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  authorityText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#23272F',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
});
