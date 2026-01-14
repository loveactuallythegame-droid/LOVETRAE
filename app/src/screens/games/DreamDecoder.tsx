import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const DREAMS = [
  { conflict: "Dishes left in sink", dream: "Need for Order/Safety" },
  { conflict: "Working late", dream: "Financial Security" },
  { conflict: "Not texting back", dream: "Connection/Reassurance" },
];

export default function DreamDecoder({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);

  function guess(dream: string) {
    if (dream === DREAMS[index].dream) {
      HapticFeedbackSystem.success();
      speakMarcie("Exactly. It's never just about the dishes.");
    } else {
      HapticFeedbackSystem.warning();
      speakMarcie("Not quite. Dig deeper.");
      return;
    }

    if (index < DREAMS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Dreams Decoded", "You see the hidden meaning.", [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const options = DREAMS.map(d => d.dream).sort(() => Math.random() - 0.5);

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Surface Conflict</Text>
        <Text variant="sass" style={styles.conflict}>"{DREAMS[index].conflict}"</Text>
        <Text variant="body">What is the underlying dream?</Text>
        <View style={{ gap: 8, marginTop: 8 }}>
          {options.map((opt, i) => (
            <SquishyButton key={i} onPress={() => guess(opt)} style={styles.btn}>
              <Text variant="body">{opt}</Text>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Dream Decoder',
    description: 'Find the dream within the conflict',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 400,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  conflict: { fontSize: 24, color: '#E4E831', textAlign: 'center', marginVertical: 16 },
  btn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8, alignItems: 'center' },
});
