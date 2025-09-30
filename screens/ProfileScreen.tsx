import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen({ navigation }: any) {
  const { session, signOut } = useAuth();
  const email = session?.user?.email;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>{email}</Text>
      <View style={{ height: 12 }} />
      <Button title="My Reports" onPress={() => navigation.navigate('MyReports')} />
      <View style={{ height: 8 }} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <View style={{ height: 8 }} />
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' }
});
