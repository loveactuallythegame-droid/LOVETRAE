import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const STRESSORS = ["Work Deadlines", "Money", "Family Drama", "Health", "Chores", "Sleep"];

export default function StressSynergyLab({ route, navigation }: any) {
  const { gameId } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(s: string) {
    if (selected.includes(s)) setSelected(prev => prev.filter(i => i !== s));
    else setSelected(prev => [...prev, s]);
    HapticFeedbackSystem.selection();
  }

  function submit() {
    const count = selected.length;
    let rx = "Prescription: Hug for 20 seconds.";
    if (count > 3) rx = "Prescription: Cancel everything. Order takeout.";

    speakMarcie(`Detected ${count} stressors. ${rx}`);
    Alert.alert("Lab Results", rx, [{ text: "Apply Treatment", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Analyze Stressors</Text>
        <Text variant="body">What is weighing on you today?</Text>
        <View style={styles.grid}>
          {STRESSORS.map((s) => (
            <SquishyButton
              key={s}
              onPress={() => toggle(s)}
              style={[styles.item, selected.includes(s) ? styles.active : {}]}
            >
              <Text variant="body" style={{ color: selected.includes(s) ? '#000' : '#fff' }}>{s}</Text>
            </SquishyButton>
          ))}
        </View>
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Synthesize Plan</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Stress Synergy Lab',
    description: 'Coordinate stress management',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  item: { padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#fff' },
  active: { backgroundColor: '#E4E831', borderColor: '#E4E831' },
  btn: { marginTop: 16, backgroundColor: '#FA1F63', padding: 16, borderRadius: 12, alignItems: 'center' },
});
