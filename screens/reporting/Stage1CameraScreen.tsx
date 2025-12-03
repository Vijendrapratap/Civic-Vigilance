/**
 * Stage 1: Photo Capture with GPS Overlay
 * PRD Section 5.2 - Stage 1: Photo Capture
 *
 * Features:
 * - Live GPS overlay with full address
 * - Flash and camera flip controls
 * - Multi-capture support (up to 3 photos)
 * - Retake option
 * - Gallery import option
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import Button from '../../components/ui/Button';

interface Props {
  onContinue: (photos: string[], coords: { lat: number; lng: number }, address: string) => void;
  onCancel?: () => void;
}

export default function Stage1CameraScreen({ onContinue, onCancel }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const { coords, address, accuracy, permissionStatus } = useLiveLocation();

  // Request camera permission on mount
  useEffect(() => {
    if (camPermission && !camPermission.granted) {
      requestCamPermission();
    }
  }, [camPermission?.status]);

  const takeLivePhoto = async () => {
    // Check if we already have 3 photos (max per PRD)
    if (photos.length >= 3) {
      Alert.alert('Maximum Photos', 'You can add up to 3 photos per report.');
      return;
    }

    if (!camPermission || camPermission.status !== 'granted') {
      const { status } = await requestCamPermission();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Camera access is needed to capture photo evidence.');
        return;
      }
    }

    try {
      const unsupported =
        !Constants.isDevice ||
        Platform.OS === 'web' ||
        typeof cameraRef.current?.takePictureAsync !== 'function';

      const res = unsupported
        ? { uri: 'https://picsum.photos/seed/civic/1200/800' }
        : await cameraRef.current?.takePictureAsync({
            quality: 0.92,  // High quality for evidence (92%)
            skipProcessing: true  // Fast capture
          });

      if (res?.uri) {
        setPhotos([...photos, res.uri]);
      }
    } catch (e) {
      console.error('[Camera] Error taking photo:', e);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    if (photos.length >= 3) {
      Alert.alert('Maximum Photos', 'You can add up to 3 photos per report.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.92,  // High quality for evidence
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        // Use current location, not EXIF data (PRD requirement)
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (e) {
      console.error('[Camera] Error picking from gallery:', e);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      Alert.alert('Photo Required', 'Please capture at least one photo to continue.');
      return;
    }

    if (!coords) {
      Alert.alert('Location Required', 'GPS location is needed to tag the authorities.');
      return;
    }

    // Check GPS accuracy (PRD requirement: minimum 100m)
    if (accuracy && accuracy > 100) {
      Alert.alert(
        'Poor GPS Signal',
        `GPS accuracy is ${Math.round(accuracy)}m. Move to an open area for better accuracy, or continue anyway.`,
        [
          { text: 'Try Again', style: 'cancel' },
          {
            text: 'Continue Anyway',
            onPress: () => onContinue(photos, coords, address),
          },
        ]
      );
      return;
    }

    onContinue(photos, coords, address);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* GPS Overlay Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Capture Evidence</Text>
        {address ? (
          <Text style={styles.headerAddress}>{address}</Text>
        ) : (
          <Text style={styles.headerAddress}>📍 Locating...</Text>
        )}
        {coords && (
          <Text style={styles.headerCoords}>
            🎯 {coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E
            {accuracy && ` • ±${Math.round(accuracy)}m`}
          </Text>
        )}
        {accuracy && accuracy > 100 && (
          <Text style={styles.warningText}>⚠️ Move to open area for better GPS accuracy</Text>
        )}
      </View>

      {/* Camera View */}
      {camPermission?.granted ? (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} flash={flash} />
      ) : (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#6B7280" />
          <Text style={styles.permissionText}>Camera access needed</Text>
          <Text style={styles.permissionSubtext}>
            We need camera access to capture photo evidence
          </Text>
          <Button title="Enable Camera" onPress={() => requestCamPermission()} />
        </View>
      )}

      {/* Photo Thumbnails (if any) */}
      {photos.length > 0 && (
        <View style={styles.thumbnailContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.thumbnailWrapper}>
                <Image source={{ uri: photo }} style={styles.thumbnail} />
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Camera Controls */}
      <View style={styles.shutterRow}>
        <Pressable
          onPress={() => setFlash((p) => (p === 'off' ? 'on' : 'off'))}
          style={styles.smallBtn}
          accessibilityLabel="Toggle flash"
        >
          <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={22} color="#fff" />
        </Pressable>

        <Pressable onPress={takeLivePhoto} style={styles.shutter} accessibilityLabel="Capture photo">
          <Ionicons name="camera" size={34} color="#111" />
          {photos.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{photos.length}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))}
          style={styles.smallBtn}
          accessibilityLabel="Flip camera"
        >
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="📷 Gallery"
          onPress={pickFromGallery}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title={`Continue (${photos.length}/3)`}
          onPress={handleContinue}
          style={{ flex: 2 }}
          disabled={photos.length === 0 || !coords}
        />
      </View>

      {!Constants.isDevice && (
        <Text style={styles.simHint}>Simulator uses sample images</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(11, 26, 42, 0.95)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  headerAddress: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 4,
  },
  headerCoords: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  warningText: {
    color: '#FCD34D',
    fontSize: 12,
    marginTop: 4,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 16,
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  thumbnailContainer: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  thumbnailWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  shutterRow: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shutter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#2563EB',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  smallBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  simHint: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    color: '#888',
    fontSize: 12,
  },
});
