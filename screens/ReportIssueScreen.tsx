import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { requestLocation, reverseGeocode } from '../lib/location';
import { composePostText, openTweetComposer, shareImageWithText } from '../lib/sharing';
import { suggestAuthorities } from '../lib/authorities';
import { createIssue } from '../hooks/useIssues';

export default function ReportIssueScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'pothole' | 'garbage' | 'streetlight' | 'water' | 'other'>('pothole');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const getLocation = async () => {
    const loc = await requestLocation();
    if (!loc) return;
    const lat = loc.coords.latitude;
    const lng = loc.coords.longitude;
    setCoords({ lat, lng });
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report an issue</Text>
      <View style={styles.row}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Upload" onPress={pickImage} />
      </View>
      {image && <Image source={{ uri: image }} style={{ width: '100%', height: 220, borderRadius: 8 }} />}

      <TextInput style={styles.input} placeholder="Short title" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Short description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Category (pothole/garbage/streetlight/water/other)" value={category} onChangeText={(t) => setCategory((t as any) || 'other')} />
      <View style={styles.row}>
        <Button title="Use my location" onPress={getLocation} />
      </View>
      {!!address && <Text style={styles.meta}>{address}</Text>}

      <View style={styles.row}>
        <Button title="Preview & Share" onPress={onShare} />
        <Button title="Submit" onPress={onSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  meta: { color: '#666' },
  row: { flexDirection: 'row', gap: 12 }
});
