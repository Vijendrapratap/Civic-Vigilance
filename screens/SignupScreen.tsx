import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { getBackend } from '../lib/backend';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const backend = getBackend();

  const onSubmit = async () => {
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await signUp(email, password);

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      // Success! Navigate to username selection (PRD Section 5.1.1)
      // @ts-ignore - navigation type
      navigation.navigate('UsernameSelection');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join the civic movement</Text>
      <Text style={styles.backend}>Backend: {backend}</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextField
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      <View style={{ height: 10 }} />
      <TextField
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      <View style={{ height: 10 }} />
      <TextField
        label="Confirm password"
        placeholder="••••••••"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        editable={!isLoading}
      />
      <View style={{ height: 16 }} />
      <Button
        title={isLoading ? 'Creating account...' : 'Sign up'}
        onPress={onSubmit}
        disabled={isLoading}
      />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fafafa' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 4, color: '#23272F' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  backend: { color: '#666', fontSize: 12, marginBottom: 8 },
  error: { color: '#EF4444', backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8 },
  message: { color: '#34D399', backgroundColor: '#D1FAE5', padding: 12, borderRadius: 8 }
});
