import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import ListItem from '../components/ListItem';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile, saveProfile, pickAvatar } from '../lib/profile';

export default function ProfileScreen({ navigation }: any) {
  const { session, signOut } = useAuth();
  const userId = session?.user?.id || 'demo-user';
  const email = session?.user?.email || 'demo@example.com';
  const [name, setName] = useState<string>('Civic User');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [joined, setJoined] = useState<string>('2025');

  useEffect(() => {
    const run = async () => {
      const p = await loadProfile(userId);
      setName(p.full_name || 'Civic User');
      setAvatar(p.avatar_url || null);
      const y = (p.created_at ? new Date(p.created_at) : new Date()).getFullYear();
      setJoined(String(y));
    };
    run();
  }, [userId]);

  const onChangeAvatar = async () => {
    const uri = await pickAvatar();
    if (!uri) return;
    const updated = await saveProfile({ id: userId, full_name: name, avatar_url: uri });
    setAvatar(updated.avatar_url || uri);
  };

  const onLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again to report issues.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => signOut() }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Profile</Text>
      <Pressable onPress={onChangeAvatar} accessibilityLabel="Change avatar">
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}><Ionicons name="person" size={40} color="#222" /></View>
        )}
      </Pressable>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.joined}>Joined {joined}</Text>

      <View style={{ height: 14 }} />
      <View style={styles.card}>
        <ListItem icon="document-text-outline" title="My Reports" onPress={() => navigation.navigate('MyReports')} />
        <ListItem icon="settings-outline" title="Settings" onPress={() => navigation.navigate('Settings')} />
        <ListItem icon="bug-outline" title="Debug Info" onPress={() => navigation.navigate('Debug')} />
      </View>

      <View style={styles.card}>
        <ListItem icon="notifications-outline" title="Notifications" subtitle="Manage your alerts" onPress={() => navigation.navigate('Notifications')} />
        <ListItem icon="link-outline" title="Linked Accounts" onPress={() => navigation.navigate('LinkedAccounts')} />
      </View>

      <View style={styles.card}>
        <ListItem icon="shield-outline" title="Privacy Policy" onPress={() => navigation.navigate('Policy', { type: 'privacy' })} />
        <ListItem icon="document-outline" title="Terms of Service" onPress={() => navigation.navigate('Policy', { type: 'terms' })} />
      </View>

      <View style={{ height: 20 }} />
      <Button title="Log out" onPress={onLogout} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0b1210' },
  pageTitle: { color: '#e6f0ec', textAlign: 'center', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', backgroundColor: '#ddd' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  name: { color: '#e6f0ec', textAlign: 'center', fontSize: 22, fontWeight: '800', marginTop: 16 },
  joined: { color: '#9aa0a6', textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: 'transparent', marginTop: 16 },
});
