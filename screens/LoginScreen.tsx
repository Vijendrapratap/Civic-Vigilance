import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const res = await signIn(email, password);
    if (res?.error) setError(res.error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}> 
        <Ionicons name="shield-checkmark" size={24} color="#111" />
        <Text style={styles.brandText}>CivicVigilance</Text>
      </View>
      <Text style={styles.title}>Welcome back</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextField label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <View style={{ height: 10 }} />
      <TextField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
      <View style={{ height: 16 }} />
      <Button title="Sign in" onPress={onSubmit} />
      <View style={{ height: 8 }} />
      <Pressable onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password?</Text></Pressable>
      <View style={{ height: 12 }} />
      <Pressable onPress={() => navigation.navigate('Signup')}><Text style={styles.link}>Don’t have an account? Sign up</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: '#f7f7f8', justifyContent: 'center' },
  brand: { position: 'absolute', top: 60, left: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontWeight: '800', fontSize: 16 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12 },
  link: { color: '#0066cc' },
  error: { color: 'crimson' }
});
