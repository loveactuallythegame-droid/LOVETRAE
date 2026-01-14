import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const ROUNDS = [
  { context: "They are stonewalling you.", options: ["Yell louder", "Take a 20m break", "Ignore them back"], correct: 1 },
  { context: "They just criticized your cooking.", options: ["Criticize their cleaning", "Explain your feelings", "Defend yourself"], correct: 1 },
];

export default function RepairRelay({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);

  function choose(idx: number) {
    if (idx === ROUNDS[index].correct) {
      speakMarcie("Good repair. Baton passed.");
      HapticFeedbackSystem.success();
    } else {
      speakMarcie("That's an escalation, not a repair. Try again.");
      HapticFeedbackSystem.error();
      return;
    }

    if (index < ROUNDS.length - 1) {
      setIndex(i => i + 1);
    } else {
      finish();
    }
  }

  function finish() {
    Alert.alert("Relay Won", "Conflict de-escalated.", [{ text: "Victory", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Lap {index + 1}</Text>
        <Text variant="body" style={styles.ctx}>{ROUNDS[index].context}</Text>
        <View style={{ gap: 8 }}>
          {ROUNDS[index].options.map((opt, i) => (
            <SquishyButton key={i} onPress={() => choose(i)} style={styles.btn}>
              <Text variant="body">{opt}</Text>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Repair Relay',
    description: 'Race to fix the conflict',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  ctx: { fontSize: 18, textAlign: 'center', marginVertical: 16 },
  btn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8, alignItems: 'center' },
});
