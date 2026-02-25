/**
 * Stage 2: Add Details
 * PRD Section 5.2 - Stage 2: Add Details
 *
 * Features:
 * - Title field (max 80 chars)
 * - Category selector (11 categories with emojis)
 * - Description field (max 500 chars, optional)
 * - Location confirmation with map preview
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import CategoryPicker, { CategoryKey } from '../../components/CategoryPicker';
import { Colors, Shadows, Typography, Layout, BorderRadius } from '../../constants/DesignSystem';

interface Props {
  photos: string[];
  initialAddress: string;
  coords: { lat: number; lng: number };
  onContinue: (data: {
    title: string;
    category: CategoryKey;
    description: string;
    address: string;
    coords: { lat: number; lng: number };
  }) => void;
  onBack: () => void;
}

export default function Stage2DetailsScreen({
  photos,
  initialAddress,
  coords,
  onContinue,
  onBack,
}: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryKey>('pothole');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleContinue = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a short title for the issue.');
      return;
    }

    if (title.length > 80) {
      Alert.alert('Title Too Long', 'Title must be 80 characters or less.');
      return;
    }

    onContinue({
      title: title.trim(),
      category,
      description: description.trim(),
      address,
      coords,
    });
  };

  // Auto-suggest title based on category (PRD feature)
  const suggestTitle = () => {
    const suggestions: Record<CategoryKey, string> = {
      pothole: `Pothole near ${address.split(',')[0]}`,
      garbage: `Garbage issue at ${address.split(',')[0]}`,
      streetlight: `Streetlight not working on ${address.split(',')[0]}`,
      drainage: `Drainage problem at ${address.split(',')[0]}`,
      water_supply: `Water supply issue on ${address.split(',')[0]}`,
      sewage: `Sewage overflow at ${address.split(',')[0]}`,
      traffic_signal: `Traffic signal fault at ${address.split(',')[0]}`,
      encroachment: `Encroachment on ${address.split(',')[0]}`,
      stray_animals: `Stray animals at ${address.split(',')[0]}`,
      parks: `Park maintenance needed at ${address.split(',')[0]}`,
      other: `Civic issue at ${address.split(',')[0]}`,
    };
    setTitle(suggestions[category] || '');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo Preview */}
        <View style={styles.photoSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photoPreview} />
            ))}
          </ScrollView>
        </View>

        {/* Title Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Title</Text>
            <Text style={styles.charCount}>{title.length}/80</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Short title (e.g., Pothole on MG Road)"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />
          <Pressable onPress={suggestTitle}>
            <Text style={styles.suggestLink}>💡 Auto-suggest based on category</Text>
          </Pressable>
        </View>

        {/* Category Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.subtitle}>Select the type of issue</Text>
          <CategoryPicker value={category} onChange={setCategory} />
        </View>

        {/* Description Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add context: How long has this been here? Who is affected?"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            maxLength={500}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Location Confirmation Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>📍 Location Confirmation</Text>
            <Pressable onPress={() => setIsEditingAddress(!isEditingAddress)}>
              <Text style={styles.editLink}>{isEditingAddress ? 'Done' : 'Edit'}</Text>
            </Pressable>
          </View>

          <View style={styles.locationBox}>
            {isEditingAddress ? (
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            ) : (
              <Text style={styles.addressText}>{address}</Text>
            )}

            <Text style={styles.coordsText}>
              {coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E
            </Text>

            {/* TODO: Add map preview in v1.5 */}
            <Pressable style={styles.mapLink}>
              <Ionicons name="map-outline" size={16} color={Colors.primary} />
              <Text style={styles.mapLinkText}>View on map</Text>
            </Pressable>
          </View>
          <Text style={styles.hintText}>
            Tap coordinates to copy • Location helps tag the right authorities
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Button
          title="← Edit Photos"
          onPress={onBack}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title="Next: Privacy"
          onPress={handleContinue}
          style={{ flex: 2 }}
          disabled={!title.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    paddingBottom: 120,
  },
  photoSection: {
    marginBottom: 16,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.md,
    marginRight: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 16,
    marginBottom: 16,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.textMain,
  },
  subtitle: {
    fontSize: Typography.bodySm.fontSize,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: 12,
    fontSize: 16,
    color: Colors.textMain,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  suggestLink: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.primary,
  },
  locationBox: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: 12,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMain,
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapLinkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: BorderRadius.md,
    ...Shadows.lg,
  },
  editLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  addressInput: {
    backgroundColor: Colors.surface,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMain,
  },
});
