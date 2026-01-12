import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function NeedsDecoder({ navigation }: any) {
  const [emojis, setEmojis] = useState('');
  const [guess, setGuess] = useState('');
  const [step, setStep] = useState(1);

  return (
    <LinearGradient colors={['#2A1020', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">The Needs Decoder</Text>
        </View>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Partner A: Send 3 Emojis</Text>
            <Text variant="body">Describe your unmet need using only 3 emojis.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 🌧️☕️🐶"
              placeholderTextColor="#666"
              value={emojis}
              onChangeText={setEmojis}
              maxLength={10} // approx 3-4 chars
            />
            <SquishyButton onPress={() => setStep(2)} style={styles.btn}>
              <Text variant="header">Send Cipher</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Partner B: Decode It</Text>
            <Text variant="header" style={{ fontSize: 40, textAlign: 'center' }}>{emojis}</Text>
            <Text variant="body">What does A need?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., You need quiet time with the dog?"
              placeholderTextColor="#666"
              value={guess}
              onChangeText={setGuess}
            />
            <SquishyButton onPress={() => setStep(3)} style={styles.btn}>
              <Text variant="header">Check</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ color: '#E4E831', textAlign: 'center' }}>Decoded?</Text>
            <Text variant="body">Emojis: <Text variant="keyword">{emojis}</Text></Text>
            <Text variant="body">Guess: <Text variant="keyword">{guess}</Text></Text>
            <Text variant="body" style={{ marginTop: 20, fontStyle: 'italic', color: '#FA1F63' }}>
              Marcie: "If they guessed 'I need a divorce', we have a problem. If they guessed 'snacks', marry them again."
            </Text>
            <SquishyButton onPress={() => { setStep(1); setEmojis(''); setGuess(''); }} style={styles.btn}>
              <Text variant="header">Next Round</Text>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  card: { padding: 20, gap: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 15, color: '#fff', fontSize: 24, textAlign: 'center' },
  btn: { backgroundColor: '#BE1980', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 }
});
