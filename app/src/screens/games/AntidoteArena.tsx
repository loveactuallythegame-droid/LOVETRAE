import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const SCENARIOS = [
  { text: "You never do the dishes! (Criticism)", options: ["Defensiveness", "Gentle Start-Up", "Stonewalling"], correct: 1 },
  { text: "I'm better than you. (Contempt)", options: ["Build Culture of Appreciation", "Defensiveness", "Flooding"], correct: 0 },
  { text: "It's not my fault! (Defensiveness)", options: ["Take Responsibility", "Criticism", "Contempt"], correct: 0 },
];

export default function AntidoteArena({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);

  function guess(idx: number) {
    if (idx === SCENARIOS[index].correct) {
      HapticFeedbackSystem.success();
      speakMarcie("Correct antidote applied.");
    } else {
      HapticFeedbackSystem.error();
      speakMarcie("Wrong. That just makes it worse.");
    }

    if (index < SCENARIOS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Arena Cleared", "You neutralized the toxins.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Threat Detected</Text>
        <Text variant="sass" style={styles.threat}>{SCENARIOS[index].text}</Text>
        <Text variant="body">Select the Antidote:</Text>
        <View style={{ gap: 8, marginTop: 8 }}>
          {SCENARIOS[index].options.map((opt, i) => (
            <SquishyButton key={i} onPress={() => guess(i)} style={styles.btn}>
              <Text variant="body">{opt}</Text>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Antidote Arena',
    description: 'Neutralize the Four Horsemen',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 350,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  threat: { fontSize: 20, color: '#FA1F63', marginVertical: 12, textAlign: 'center' },
  btn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8, alignItems: 'center' },
});
