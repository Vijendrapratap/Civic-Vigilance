import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const res = await resetPassword(email);
    if (res?.error) setError(res.error); else setMessage('Password reset link sent if the email exists.');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Reset password</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!message && <Text style={styles.message}>{message}</Text>}
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Button title="Send reset link" onPress={onSubmit} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  error: { color: 'crimson' },
  message: { color: 'green' }
});
