import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { requestLocation, reverseGeocode } from '../lib/location';
import { composePostText, openTweetComposer, shareImageWithText } from '../lib/sharing';
import { suggestAuthorities } from '../lib/authorities';
import { createIssue } from '../hooks/useIssues';
import Button from '../components/ui/Button';
import CategoryPicker, { CategoryKey } from '../components/CategoryPicker';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { colors } from '../lib/theme';

export default function ReportIssueScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryKey>('pothole');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const { coords: liveCoords, address: liveAddress, permissionStatus } = useLiveLocation();
  const [stage, setStage] = useState<'capture' | 'details'>('capture');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  useEffect(() => { if (camPermission && !camPermission.granted) { requestCamPermission(); } }, [camPermission?.status]);

  const takeLivePhoto = async () => {
    if (!camPermission || camPermission.status !== 'granted') {
      const { status } = await requestCamPermission();
      if (status !== 'granted') return;
    }
    try {
      const unsupported = !Constants.isDevice || Platform.OS === 'web' || typeof cameraRef.current?.takePictureAsync !== 'function';
      const res = unsupported
        ? { uri: 'https://picsum.photos/seed/civic/1200/800' }
        : await cameraRef.current?.takePictureAsync({ quality: 0.7, skipProcessing: true });
      if (res?.uri) {
        setImage(res.uri);
        if (liveCoords) setCoords({ lat: liveCoords.lat, lng: liveCoords.lng });
        if (liveAddress) setAddress(liveAddress);
        setStage('details');
      }
    } catch (e) { /* ignore */ }
  };

  const getLocation = async () => {
    if (liveCoords) { setCoords({ lat: liveCoords.lat, lng: liveCoords.lng }); setAddress(liveAddress); return; }
    const loc = await requestLocation();
    if (!loc) return;
    const lat = loc.coords.latitude; const lng = loc.coords.longitude; setCoords({ lat, lng });
    const addr = await reverseGeocode(lat, lng); setAddress(addr);
  };

  const onShare = async () => {
    const text = composePostText({ description: description || title, address, lat: coords?.lat, lng: coords?.lng, authorities: suggestAuthorities() });
    if (image) await shareImageWithText(image, text); else await openTweetComposer(text);
  };

  const onSubmit = async () => {
    try {
      await createIssue({ title: title || 'Civic issue', description, category, image_url: image ?? undefined, lat: coords?.lat, lng: coords?.lng, address });
      Alert.alert('Submitted', 'Your report has been created.');
      setImage(null); setTitle(''); setDescription(''); setAddress(''); setCoords(null);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create issue');
    }
  };

  if (stage === 'capture') {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Capture Issue</Text>
          <Text style={styles.headerMeta}>{liveAddress ? liveAddress : 'Locating…'}</Text>
          {liveCoords && (
            <Text style={styles.headerMeta}>Lat {liveCoords.lat.toFixed(5)} • Lng {liveCoords.lng.toFixed(5)} {liveCoords.accuracy ? `• ±${Math.round(liveCoords.accuracy)}m` : ''}</Text>
          )}
        </View>
        {camPermission?.granted ? (
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} flash={flash} />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Enable Camera" onPress={() => requestCamPermission()} />
          </View>
        )}
        <View style={styles.shutterRow}>
          <Pressable onPress={() => setFlash((p) => (p === 'off' ? 'on' : 'off'))} style={styles.smallBtn} accessibilityLabel="Toggle flash">
            <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={takeLivePhoto} style={styles.shutter} accessibilityLabel="Capture photo">
            <Ionicons name="camera" size={34} color="#111" />
          </Pressable>
          <Pressable onPress={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))} style={styles.smallBtn} accessibilityLabel="Flip camera">
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          </Pressable>
        </View>
        {!Constants.isDevice && <Text style={styles.simHint}>Simulator uses a sample image</Text>}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Describe the issue</Text>
        <TextInput
          style={styles.input}
          placeholder="Short title"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 110 }]}
          multiline
          placeholder="Short description"
          placeholderTextColor={colors.subtext}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Category</Text>
        <CategoryPicker value={category} onChange={setCategory} />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.row}>
          <Button title="Use current location" onPress={getLocation} variant="outline" style={{ flex: 1 }} />
          <Button title="Retake" onPress={() => setStage('capture')} variant="outline" style={{ flex: 1 }} />
        </View>
        {!!address && <Text style={styles.meta}>{address}</Text>}
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <Button title="Share preview" onPress={onShare} variant="outline" style={{ flex: 1 }} />
        <Button title="Submit" onPress={onSubmit} style={{ flex: 1 }} disabled={!image || !title || !coords} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: '700' },
  preview: { width: '100%', height: 240, borderRadius: 16 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 18, gap: 12, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, borderWidth: 1, borderColor: 'rgba(148,163,184,0.12)' },
  sectionTitle: { fontWeight: '800', fontSize: 14, color: colors.text },
  input: { backgroundColor: 'rgba(15,23,42,0.4)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.35)', borderRadius: 12, padding: 12, color: colors.text },
  meta: { color: colors.subtext },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  header: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#0b1a2a' },
  headerText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  headerMeta: { color: '#c9d3e0', marginTop: 4 },
  shutterRow: { position: 'absolute', bottom: 24, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  shutter: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#fff', borderWidth: 6, borderColor: '#e5e5e5', alignItems: 'center', justifyContent: 'center' },
  smallBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  simHint: { position: 'absolute', bottom: 8, alignSelf: 'center', color: '#888' }
});
