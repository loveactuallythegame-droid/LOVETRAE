import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function FlashbackFrenzy({ navigation }: any) {
  const [emotion, setEmotion] = useState('');
  const [guess, setGuess] = useState('');
  const [step, setStep] = useState(1);

  return (
    <LinearGradient colors={['#101010', '#202040']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Flashback Frenzy</Text>
        </View>

        <GlassCard style={styles.card}>
            <View style={styles.imagePlaceholder}>
                <Text variant="header" style={{fontSize: 40}}>🌧️ 🪟</Text>
                <Text variant="body">Image: Rainy Window</Text>
            </View>
        </GlassCard>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Partner A: The Feeling</Text>
            <Text variant="body">What emotion does this trigger?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Abandonment, Fear..."
              placeholderTextColor="#666"
              value={emotion}
              onChangeText={setEmotion}
            />
            <SquishyButton onPress={() => setStep(2)} style={styles.btn}>
              <Text variant="header">Submit</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Partner B: The Guess</Text>
            <Text variant="body">Why does A feel that way? Guess the memory.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., That night I didn't come home..."
              placeholderTextColor="#666"
              value={guess}
              onChangeText={setGuess}
            />
            <SquishyButton onPress={() => setStep(3)} style={styles.btn}>
              <Text variant="header">Check Match</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ color: '#33DEA5', textAlign: 'center' }}>Match Analysis</Text>
            <Text variant="body">Emotion: <Text variant="keyword">{emotion}</Text></Text>
            <Text variant="body">Guess: <Text variant="keyword">{guess}</Text></Text>
            <Text variant="body" style={{ marginTop: 20, fontStyle: 'italic', color: '#BE1980' }}>
              Marcie: "Spot on. Listening level: 100. (+15 XP)"
            </Text>
            <SquishyButton onPress={() => { setStep(1); setEmotion(''); setGuess(''); }} style={styles.btn}>
              <Text variant="header">Next Image</Text>
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
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 15, color: '#fff', fontSize: 16 },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  imagePlaceholder: { height: 200, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
