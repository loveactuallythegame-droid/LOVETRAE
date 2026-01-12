import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function VibeSync({ navigation }: any) {
  const [myVibe, setMyVibe] = useState(50);
  const [step, setStep] = useState(1); // 1: Set, 2: Guess/Wait (simulated), 3: Reveal
  const [partnerVibe, setPartnerVibe] = useState(0);

  function lockVibe() {
    // Simulate partner value
    const sim = Math.floor(Math.random() * 100);
    setPartnerVibe(sim);
    setStep(3);
  }

  const diff = Math.abs(myVibe - partnerVibe);
  let msg = "";
  if (diff < 5) msg = "Psychic Match! (+25 XP)";
  else if (diff < 15) msg = "In Sync! (+15 XP)";
  else msg = "Vibe Mismatch. Talk it out.";

  return (
    <LinearGradient colors={['#2e0b1f', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Vibe Sync</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="header" style={{ textAlign: 'center' }}>
            {step === 3 ? "Results" : "Set Your Emotional Battery"}
          </Text>

          <View style={styles.sliderContainer}>
            <Text variant="header" style={styles.value}>{myVibe}%</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={myVibe}
              onValueChange={setMyVibe}
              minimumTrackTintColor="#FA1F63"
              maximumTrackTintColor="#FFFFFF"
              disabled={step === 3}
            />
            <View style={styles.labels}>
              <Text variant="body">Drained</Text>
              <Text variant="body">Charged</Text>
            </View>
          </View>

          {step === 3 && (
             <View style={{ marginTop: 20, alignItems: 'center', gap: 10 }}>
               <Text variant="body">Partner's Vibe (Simulated)</Text>
               <Text variant="header" style={{ color: '#E4E831' }}>{partnerVibe}%</Text>
               <Text variant="header" style={{ color: '#33DEA5', textAlign: 'center' }}>{msg}</Text>
             </View>
          )}

          {step !== 3 && (
            <SquishyButton onPress={lockVibe} style={styles.btn}>
              <Text variant="header">Lock In</Text>
            </SquishyButton>
          )}

          {step === 3 && (
             <SquishyButton onPress={() => setStep(1)} style={[styles.btn, { marginTop: 20 }]}>
               <Text variant="header">Play Again</Text>
             </SquishyButton>
          )}

        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20, justifyContent: 'center', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  card: { padding: 30, gap: 20 },
  sliderContainer: { alignItems: 'center', gap: 10, paddingVertical: 20 },
  value: { fontSize: 48, color: '#FA1F63' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center' }
});
