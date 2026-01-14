import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function TurningTowardTally({ route, navigation }: any) {
  const { gameId } = route.params;
  const [streak, setStreak] = useState(0);

  function logResponse() {
    setStreak(s => s + 1);
    speakMarcie(streak < 3 ? "Good start." : "Look at you, emotional availability champion.");
    HapticFeedbackSystem.success();
  }

  function finish() {
    Alert.alert("Tally Saved", `You turned toward ${streak} bids today.`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Turning Toward Tally</Text>
        <Text variant="body">Did you respond to a bid (text/call/look) in {"<"}5 min?</Text>
        <Text variant="keyword" style={styles.count}>{streak}</Text>
        <SquishyButton onPress={logResponse} style={styles.btn}>
            <Text variant="header">Yes, I Turned Toward</Text>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.done}>
            <Text variant="header">Finish Logging</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Turning Toward Tally',
    description: 'Track your responsiveness',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  count: { fontSize: 60, textAlign: 'center', marginVertical: 20 },
  btn: { backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
  done: { marginTop: 12, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, alignItems: 'center' },
});
