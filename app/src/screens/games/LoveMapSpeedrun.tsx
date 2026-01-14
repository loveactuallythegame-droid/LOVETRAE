import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const QUESTIONS = [
  { q: "What is their go-to comfort snack this month?", a: ["Chips", "Ice Cream", "Chocolate", "Pizza"], correct: 1 },
  { q: "Name one person they vented to last week.", a: ["Mom", "Best Friend", "Coworker", "You"], correct: 3 },
  { q: "What is their current favorite song?", a: ["Pop", "Rock", "Jazz", "Silence"], correct: 0 },
];

export default function LoveMapSpeedrun({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  function answer(idx: number) {
    if (idx === QUESTIONS[index].correct) {
      setScore(s => s + 100);
      HapticFeedbackSystem.success();
      speakMarcie("Correct. You're paying attention.");
    } else {
      HapticFeedbackSystem.error();
      speakMarcie("Wrong. They changed that ages ago. Keep up.");
    }

    if (index < QUESTIONS.length - 1) {
      setIndex(i => i + 1);
    } else {
      finish();
    }
  }

  function finish() {
    Alert.alert("Speedrun Complete", `Score: ${score}`, [{ text: "OK", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Question {index + 1}</Text>
        <Text variant="body">{QUESTIONS[index].q}</Text>
        <View style={styles.grid}>
          {QUESTIONS[index].a.map((ans, i) => (
            <SquishyButton key={i} onPress={() => answer(i)} style={styles.option}>
              <Text variant="body">{ans}</Text>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Love Map Speedrun',
    description: 'How well do you know their current world?',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  option: { width: '48%', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8, alignItems: 'center' },
});
