import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function VowRemix({ route, navigation }: any) {
  const { gameId } = route.params;
  const [vow, setVow] = useState('');

  function submit() {
    if (!vow) {
      speakMarcie("Silence is not a vow. Write.");
      return;
    }
    speakMarcie("A modern classic. Frame it.");
    HapticFeedbackSystem.success();
    Alert.alert("Vow Renewed", "Saved to your profile.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: SPACING.regular }}>
      <GlassCard>
        <Typography variant="h2" center>Vow Remix</Typography>
        <Typography variant="body" center>Complete the sentence:</Typography>
        <Typography variant="sass" center style={styles.prompt}>"I vow to love you even when..."</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. you eat all the chips"
            placeholderTextColor={COLORS.textHint}
            value={vow}
            onChangeText={setVow}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="button">Seal Vow</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Vow Remix',
    description: 'Update your promises',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  prompt: { 
    fontSize: TYPOGRAPHY.fontSize.headerMedium, 
    textAlign: 'center', 
    marginVertical: SPACING.regular, 
    color: COLORS.success 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  btn: { 
    marginTop: SPACING.regular, 
    backgroundColor: COLORS.emotionalConnection, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  },
});
