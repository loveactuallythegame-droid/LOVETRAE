import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function DenialDetector({ navigation }: any) {
  const [transcript, setTranscript] = useState('');
  const [count, setCount] = useState<number | null>(null);

  function analyze() {
    // Simple count of "fine" (case insensitive)
    const matches = transcript.match(/fine/gi);
    const c = matches ? matches.length : 0;
    setCount(c);
  }

  return (
    <LinearGradient colors={['#200a0a', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">The Denial Detector</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="header">Say It: "Everything's fine."</Text>
          <Text variant="body">Describe how you feel right now. Don't hold back.</Text>
          <TextInput
            style={styles.input}
            placeholder="Type what you would say (or use dictation)..."
            placeholderTextColor="#666"
            value={transcript}
            onChangeText={setTranscript}
            multiline
          />
          <SquishyButton onPress={analyze} style={styles.btn}>
            <Text variant="header">Audit for Denial</Text>
          </SquishyButton>
        </GlassCard>

        {count !== null && (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ textAlign: 'center' }}>"Fine" Count: {count}</Text>
            {count < 2 ? (
              <Text variant="body" style={{ color: '#33DEA5', textAlign: 'center' }}>
                Low Denial! (+15 XP). You're actually expressing feelings.
              </Text>
            ) : (
              <Text variant="body" style={{ color: '#FA1F63', textAlign: 'center' }}>
                Denial Champion. (-5 XP). You said 'fine' {count} times. You are not fine.
              </Text>
            )}
            <Text variant="body" style={{ marginTop: 20, fontStyle: 'italic', textAlign: 'center' }}>
                Marcie: {count < 2 ? "Proud of you." : "Emotional Bottleneck unlocked. 🏆"}
            </Text>
            <SquishyButton onPress={() => { setTranscript(''); setCount(null); }} style={[styles.btn, { backgroundColor: '#333' }]}>
              <Text variant="header">Try Again</Text>
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
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 15, color: '#fff', fontSize: 16, minHeight: 120 },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
});
