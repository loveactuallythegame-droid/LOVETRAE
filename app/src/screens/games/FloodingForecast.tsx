import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function FloodingForecast({ route, navigation }: any) {
  const { gameId } = route.params;
  const [bpm, setBpm] = useState(80);

  useEffect(() => {
    // Simulate heart rate rising
    const t = setInterval(() => {
      setBpm(b => Math.min(120, b + Math.floor(Math.random() * 5)));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  function calmDown() {
    HapticFeedbackSystem.pulse(2);
    setBpm(b => Math.max(60, b - 10));
    speakMarcie("Breathe... in... out...");
  }

  function finish() {
    Alert.alert("Forecast", bpm > 100 ? "Risk of Flooding! Take a break." : "Clear skies. Carry on.", [{ text: "OK", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Heart Rate Monitor</Text>
        <Text variant="keyword" style={styles.bpm}>{bpm} BPM</Text>
        <View style={styles.barWrap}>
            <View style={[styles.bar, { width: `${(bpm / 120) * 100}%`, backgroundColor: bpm > 100 ? '#E11637' : '#33DEA5' }]} />
        </View>
        <Text variant="body" style={{ textAlign: 'center', marginTop: 8 }}>
            {bpm > 100 ? "FLOODING IMMINENT" : "Safe Zone"}
        </Text>
        <SquishyButton onPress={calmDown} style={styles.btn}>
            <Text variant="header">Box Breathe</Text>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.checkBtn}>
            <Text variant="header">Check Forecast</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Flooding Forecast',
    description: 'Monitor physiology during conflict',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 350,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  bpm: { fontSize: 48, textAlign: 'center', marginVertical: 12, color: '#fff' },
  barWrap: { height: 20, backgroundColor: '#333', borderRadius: 10, overflow: 'hidden' },
  bar: { height: '100%' },
  btn: { marginTop: 20, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkBtn: { marginTop: 12, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
