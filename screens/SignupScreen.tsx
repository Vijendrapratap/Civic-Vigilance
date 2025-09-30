import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async () => {
    if (password.length < 6) { setError('Password should be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    const res = await signUp(email, password);
    if (res?.error) setError(res.error); else setMessage('Check your email to confirm your account.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!message && <Text style={styles.message}>{message}</Text>}
      <TextField label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <View style={{ height: 10 }} />
      <TextField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
      <View style={{ height: 10 }} />
      <TextField label="Confirm password" placeholder="••••••••" secureTextEntry value={confirm} onChangeText={setConfirm} />
      <View style={{ height: 16 }} />
      <Button title="Sign up" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  error: { color: 'crimson' },
  message: { color: 'green' }
});
