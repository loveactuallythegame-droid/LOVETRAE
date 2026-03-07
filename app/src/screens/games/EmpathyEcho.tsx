import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const WORRY = "I feel overwhelmed by my job insecurity right now.";

export default function EmpathyEcho({ route, navigation }: any) {
  const { gameId } = route.params;
  const [response, setResponse] = useState('');

  function check() {
    const r = response.toLowerCase();
    if (r.includes('fix') || r.includes('solution') || r.includes('should')) {
      speakMarcie("Stop trying to fix it. Just listen.");
      HapticFeedbackSystem.error();
    } else if (r.length < 10) {
        speakMarcie("Too short. Empathy requires more than a grunt.");
    } else {
      speakMarcie("That sounds like validation. Good.");
      HapticFeedbackSystem.success();
      Alert.alert("Empathy Scored", "You made them feel seen.", [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={styles.gapContainer}>
      <GlassCard>
        <Typography variant="h2" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h3" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
        
        <Typography variant="h3" style={styles.sectionTitle}>Partner's Worry</Typography>
        <Typography variant="h3" style={styles.worry}>"{WORRY}"</Typography>
        <Typography variant="body">Respond with validation ONLY (no fixing):</Typography>
        <TextInput
            style={styles.input}
            placeholder="That sounds really hard..."
            placeholderTextColor={COLORS.textHint}
            value={response}
            onChangeText={setResponse}
            multiline
        />
        <SquishyButton onPress={check} style={styles.btn}>
            <Typography variant="button">Send Echo</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Empathy Echo',
    description: 'Validate without fixing',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => check()} />;
}

const styles = StyleSheet.create({
  gapContainer: {
    gap: SPACING.regular,
  },
  sectionTitle: {
    marginTop: SPACING.large,
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    marginBottom: SPACING.regular,
  },
  worry: { 
    textAlign: 'center', 
    marginVertical: SPACING.large, 
    color: COLORS.textPrimary,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    marginTop: SPACING.regular,
  },
  btn: { 
    marginTop: SPACING.large,
  },
});
