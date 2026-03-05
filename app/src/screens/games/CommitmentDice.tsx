import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const PROMPTS = ["Text one reason you chose them today", "Send a photo of your favorite memory", "Commit to one chore this week"];

export default function CommitmentDice({ route, navigation }: any) {
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
      speakMarcie("You can't commit to nothing. Type something.");
      return;
    }
    speakMarcie("Commitment logged. I'll be watching.");
    HapticFeedbackSystem.success();
    Alert.alert("Commitment Sent", "Your partner has been notified.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: SPACING.regular }}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="body">Roll the dice for random acts of commitment! Small gestures build lasting bonds.</Typography>
          </View>
        </View>

        <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

        {!rolled ? (
            <View style={{ alignItems: 'center', padding: SPACING.regular }}>
                <Typography variant="h1" center>🎲</Typography>
                <SquishyButton onPress={roll} style={styles.rollBtn}>
                  <Typography variant="button" style={{ color: COLORS.textPrimary }}>Roll for Commitment</Typography>
                </SquishyButton>
            </View>
        ) : (
            <View style={{ gap: SPACING.regular }}>
                <Typography variant="body">Prompt:</Typography>
                <Typography variant="h2" center style={{ color: COLORS.gradientStart }}>{prompt}</Typography>
                <TextInput
                    style={styles.input}
                    placeholder="Your commitment..."
                    placeholderTextColor={COLORS.textHint}
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}>
                  <Typography variant="button" style={{ color: COLORS.textPrimary }}>Commit</Typography>
                </SquishyButton>
            </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Commitment Dice',
    description: 'Random acts of commitment',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  rollBtn: { 
    marginTop: SPACING.regular, 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: SPACING.xxlarge * 3, 
    marginTop: SPACING.small,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  doneBtn: { 
    marginTop: SPACING.regular, 
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular
  },
  avatarContainer: {
    width: SPACING.xxlarge + SPACING.medium,
    height: SPACING.xxlarge + SPACING.medium,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular
  },
  avatar: {
    width: SPACING.xxlarge,
    height: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
});
