import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { getBackend } from '../lib/backend';

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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brandContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome back</Text>

        {!!error && <Text style={styles.error}>{error}</Text>}
        <TextField label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <View style={{ height: 10 }} />
        <TextField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
        <View style={{ height: 16 }} />
        <Button title="Sign in" onPress={onSubmit} />
        <View style={{ height: 16 }} />
        <Button
          title="Demo Login (Guest)"
          variant="outline"
          onPress={() => {
            setEmail('guest@civic.com');
            setPassword('password123');
            signIn('guest@civic.com', 'password123');
          }}
        />
        <View style={{ height: 8 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Forgot password" onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password?</Text></Pressable>
        <View style={{ height: 12 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Sign up" onPress={() => navigation.navigate('Signup')}><Text style={styles.link}>Don't have an account? Sign up</Text></Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: '#f7f7f8', justifyContent: 'center' },
  brandContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 280, height: 80 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  link: { color: '#0066cc', textAlign: 'center' },

  error: { color: 'crimson' }
});
