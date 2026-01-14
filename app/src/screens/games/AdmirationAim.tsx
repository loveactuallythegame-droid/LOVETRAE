import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const WORDS = ["Patient", "Witty", "Stubborn", "Messy", "Kind", "Lazy"];

export default function AdmirationAim({ route, navigation }: any) {
  const { gameId } = route.params;
  const [score, setScore] = useState(0);

  function shoot(word: string) {
    if (word === "Stubborn" || word === "Messy" || word === "Lazy") {
      HapticFeedbackSystem.error();
      speakMarcie("Oof. Criticisms aren't cute.");
      setScore(s => Math.max(0, s - 10));
    } else {
      HapticFeedbackSystem.success();
      speakMarcie("Hit! They'll like that one.");
      setScore(s => s + 20);
    }
  }

  function finish() {
    Alert.alert("Target Practice Over", `Admiration Score: ${score}`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Admiration AR</Text>
        <Text variant="body">Tap the compliments. Dodge the critiques.</Text>
        <View style={styles.grid}>
          {WORDS.map((w) => (
            <SquishyButton key={w} onPress={() => shoot(w)} style={styles.target}>
              <Text variant="body">{w}</Text>
            </SquishyButton>
          ))}
        </View>
        <Text variant="keyword" style={{ textAlign: 'center', marginTop: 12 }}>Score: {score}</Text>
        <SquishyButton onPress={finish} style={styles.btn}>
            <Text variant="header">Finish Round</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Admiration Aim',
    description: 'Shoot compliments, not criticisms',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 20 },
  target: { padding: 20, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: '#FA1F63' },
  btn: { marginTop: 20, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
