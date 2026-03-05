import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';

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
    <View style={{ gap: SPACING.regular }}>
      <GlassCard padding="large">
        <Typography variant="h2">Surface Conflict</Typography>
        <Typography variant="sass" style={styles.conflict}>"{DREAMS[index].conflict}"</Typography>
        <Typography variant="body">What is the underlying dream?</Typography>
        <View style={{ gap: SPACING.small, marginTop: SPACING.small }}>
          {options.map((opt, i) => (
            <SquishyButton key={i} onPress={() => guess(opt)} style={styles.btn} variant="ghost">
              <Typography variant="body">{opt}</Typography>
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  conflict: { 
    fontSize: TYPOGRAPHY.fontSize.displaySmall, 
    color: COLORS.creativeChaos, 
    textAlign: 'center', 
    marginVertical: SPACING.regular 
  },
  btn: { 
    backgroundColor: COLORS.backgroundInput, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  },
});
