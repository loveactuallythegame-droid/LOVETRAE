import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

const PROMPTS = ["One value for our kids?", "What will they say at our funeral?", "Our signature tradition?"];

export default function LegacyDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [rolled, setRolled] = useState(false);

  function roll() {
    setRolled(true);
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(p);
    speakMarcie(p);
    HapticFeedbackSystem.heavyImpact();
  }

  function submit() {
    if (!response) {
      speakMarcie("Legacy requires words. Or action. Type.");
      return;
    }
    speakMarcie("Deep. I'm adding that to the archives.");
    HapticFeedbackSystem.success();
    Alert.alert("Legacy Recorded", "Saved for posterity.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        {!rolled ? (
            <View style={styles.diceContainer}>
                <Typography variant="h1" style={styles.diceEmoji}>🎲</Typography>
                <SquishyButton onPress={roll} style={styles.rollBtn}>
                  <Typography variant="h2">Roll Legacy Dice</Typography>
                </SquishyButton>
            </View>
        ) : (
            <View style={styles.promptContainer}>
                <Typography variant="body">Big Question:</Typography>
                <Typography variant="h2" style={styles.promptText}>{prompt}</Typography>
                <TextInput
                    style={styles.input}
                    placeholder="Your thoughts..."
                    placeholderTextColor={COLORS.textHint}
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}>
                  <Typography variant="h2">Save Legacy</Typography>
                </SquishyButton>
            </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Legacy Dice',
    description: 'Discuss big picture values',
    category: 'creative' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  diceContainer: {
    alignItems: 'center',
    padding: SPACING.large,
  },
  diceEmoji: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
  },
  rollBtn: { 
    marginTop: SPACING.large,
  },
  promptContainer: {
    gap: SPACING.regular,
  },
  promptText: {
    color: COLORS.brightYellow,
    textAlign: 'center',
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  doneBtn: { 
    marginTop: SPACING.regular,
  },
});
