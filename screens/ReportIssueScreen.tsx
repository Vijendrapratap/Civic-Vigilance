import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import { requestLocation, reverseGeocode } from '../lib/location';
import { composePostText, openTweetComposer, shareImageWithText } from '../lib/sharing';
import { suggestAuthorities } from '../lib/authorities';
import { createIssue } from '../hooks/useIssues';
import Button from '../components/ui/Button';
import CategoryPicker, { CategoryKey } from '../components/CategoryPicker';
import { useLiveLocation } from '../hooks/useLiveLocation';

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
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Enable Camera" onPress={() => requestCamPermission()} />
          </View>
        )}
        <View style={styles.shutterRow}>
          <Pressable onPress={takeLivePhoto} style={styles.shutter} accessibilityLabel="Capture photo" />
          {!Constants.isDevice && <Text style={{ color: '#888', marginTop: 8 }}>Simulator uses a sample image</Text>}
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && <Image source={{ uri: image }} style={{ width: '100%', height: 240, borderRadius: 12 }} />}
      <TextInput style={styles.input} placeholder="Short title" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, { height: 110 }]} multiline placeholder="Short description" value={description} onChangeText={setDescription} />
      <CategoryPicker value={category} onChange={setCategory} />
      <View style={styles.row}>
        <Button title="Use current location" onPress={getLocation} variant="outline" />
        <Button title="Retake" onPress={() => setStage('capture')} variant="outline" />
      </View>
      {!!address && <Text style={styles.meta}>{address}</Text>}
      <View style={styles.row}>
        <Button title="Share preview" onPress={onShare} variant="outline" />
        <Button title="Submit" onPress={onSubmit} disabled={!image || !title || !coords} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 12 },
  meta: { color: '#666' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  header: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#0b1a2a' },
  headerText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  headerMeta: { color: '#c9d3e0', marginTop: 4 },
  shutterRow: { padding: 16, backgroundColor: '#000', alignItems: 'center' },
  shutter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', borderWidth: 8, borderColor: '#e5e5e5' }
});
