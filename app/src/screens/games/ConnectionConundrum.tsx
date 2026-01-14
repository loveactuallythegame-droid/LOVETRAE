import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function ConnectionConundrum({ route, navigation }: any) {
  const { gameId } = route.params;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  function next() {
    if (round < 10) {
        setRound(r => r + 1);
        setScore(s => s + 50);
        speakMarcie("Correct. Faster.");
        HapticFeedbackSystem.selection();
    } else {
        finish();
    }
  }

  function finish() {
    speakMarcie("You survived. Barely. Here's your custom date night plan.");
    Alert.alert("Grand Finale Won", `Score: ${score + 50}. Custom Ritual Unlocked.`, [{ text: "Claim Prize", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Round {round}/10</Text>
        <Text variant="body" style={{ textAlign: 'center', marginVertical: 20 }}>
            [Rapid Fire Challenge Placeholder]
        </Text>
        <SquishyButton onPress={next} style={styles.btn}>
            <Text variant="header">Solve & Next</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Connection Conundrum',
    description: 'The Grand Finale Gauntlet',
    category: 'creative' as const,
    difficulty: 'hard' as const,
    xpReward: 500,
    currentStep: round,
    totalTime: 120,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, round]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#FA1F63', padding: 20, borderRadius: 12, alignItems: 'center' },
});
