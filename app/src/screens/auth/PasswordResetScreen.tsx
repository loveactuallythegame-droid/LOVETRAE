import { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { resetPassword } from '../../lib/supabase';

type Props = {
  onSent: () => void;
};

export default function PasswordResetScreen({ onSent }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setError(null);
    try {
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      await resetPassword(email, typeof window !== 'undefined' ? window.location.origin : undefined);
      Haptics.selectionAsync();
      onSent();
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <GlassCard>
        <Text variant="header">Reset Your Password</Text>
        <Text variant="body">Enter your email and we’ll send you a reset link.</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        {error && <Text variant="sass">{error}</Text>}
        <SquishyButton onPress={send} style={styles.btn}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text variant="header">Send Reset Link</Text>}
        </SquishyButton>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff' },
  btn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12, marginTop: 12 },
});
