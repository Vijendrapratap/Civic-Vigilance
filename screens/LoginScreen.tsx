import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }: any) {
  const { signIn, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const res = await signIn(email, password);
    if (res?.error) setError(res.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={onSubmit} />
      <View style={{ height: 8 }} />
      <Pressable onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password?</Text></Pressable>
      <View style={{ height: 8 }} />
      <Pressable onPress={() => navigation.navigate('Signup')}><Text style={styles.link}>Create an account</Text></Pressable>
      <View style={{ height: 24 }} />
      <Button title="Continue with Google" onPress={() => signInWithProvider('google')} />
      <View style={{ height: 8 }} />
      <Button title="Continue with Apple" onPress={() => signInWithProvider('apple')} />
      <View style={{ height: 8 }} />
      <Button title="Continue with Facebook" onPress={() => signInWithProvider('facebook')} />
      <View style={{ height: 8 }} />
      <Button title="Continue with Twitter (X)" onPress={() => signInWithProvider('twitter')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  link: { color: '#0066cc' },
  error: { color: 'crimson' }
});
