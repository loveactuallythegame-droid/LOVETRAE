import { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { signInEmail, signUpEmail, signInWithGoogle, resetPassword } from '../../lib/supabase';
import { MarcieHost } from '../../components/ai-host';

type Props = {
  onAuthenticated: () => void;
  onForgot: () => void;
};

export default function SignInScreen({ onAuthenticated, onForgot }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doSignIn() {
    setLoading(true);
    setError(null);
    try {
      if (!email.includes('@') || password.length < 6) {
        setError('Please enter a valid email and a password of at least 6 characters.');
        setLoading(false);
        return;
      }
      await signInEmail(email, password);
      Haptics.selectionAsync();
      onAuthenticated();
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function doSignUp() {
    setLoading(true);
    setError(null);
    try {
      if (!email.includes('@') || password.length < 6) {
        setError('Please enter a valid email and a password of at least 6 characters.');
        setLoading(false);
        return;
      }
      await signUpEmail(email, password);
      Haptics.selectionAsync();
      onAuthenticated();
    } catch (e: any) {
      setError(e?.message || 'Sign-up failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function doGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(typeof window !== 'undefined' ? window.location.origin : undefined);
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MarcieHost mode={'idle'} size={180} float position={{ x: 24, y: 24 }} />
      <View style={{ padding: 16, gap: 12 }}>
        <GlassCard>
          <Text variant="header">Welcome to Your Relationship Reality Check</Text>
          <Text variant="body">Let’s Get Real — sign in or sign up to continue.</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
          />
          {error && <Text variant="sass">{error}</Text>}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <SquishyButton style={[styles.btn, { backgroundColor: '#33DEA5' }]} onPress={doSignIn}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text variant="header">Sign In</Text>}
            </SquishyButton>
            <SquishyButton style={styles.btn} onPress={doSignUp}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text variant="header">Sign Up</Text>}
            </SquishyButton>
          </View>
          <View style={{ height: 8 }} />
          <SquishyButton style={styles.btn} onPress={doGoogle}>
            <Text variant="header">Sign in with Google</Text>
          </SquishyButton>
          <View style={{ height: 8 }} />
          <SquishyButton style={styles.btn} onPress={onForgot}>
            <Text variant="header">Forgot Password</Text>
          </SquishyButton>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff' },
  btn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#5C1459', borderRadius: 12 },
});
