import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Text, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

export default function ConnectionConundrum({ route, navigation }: any) {
  const { gameId } = route.params;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  function next() {
    if (round < 10) {
        setRound(r => r + 1);
        setScore(s => s + 50);
        speakMarcie("Correct. Faster.");
        HapticFeedbackSystem.selection();
    } else {
        finish();
    }
  }

  function finish() {
    speakMarcie("You survived. Barely. Here's your custom date night plan.");
    Alert.alert("Grand Finale Won", `Score: ${score + 50}. Custom Ritual Unlocked.`, [{ text: "Claim Prize", onPress: () => navigation.goBack() }]);
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
            <Text variant="sass">Solve the connection conundrum! Test your relationship knowledge in rapid-fire challenges.</Text>
          </View>
        </View>

        <Text variant="h2">Round {round}/10</Text>
        <Text variant="body" style={{ textAlign: 'center', marginVertical: SPACING.xlarge }}>
            [Rapid Fire Challenge Placeholder]
        </Text>
        <SquishyButton onPress={next} style={styles.btn}>
            <LinearGradient
              colors={GRADIENTS.primary.colors}
              start={GRADIENTS.primary.start}
              end={GRADIENTS.primary.end}
              style={styles.gradientButton}
            >
                <Text variant="h2" style={{ color: COLORS.textPrimary }}>Solve & Next</Text>
            </LinearGradient>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Connection Conundrum',
    description: 'The Grand Finale Gauntlet',
    category: 'creative' as const,
    difficulty: 'hard' as const,
    xpReward: 500,
    currentStep: round,
    totalTime: 120,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, round]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  btn: { 
    padding: SPACING.xlarge, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: SPACING.xlarge,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xxlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover',
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
});
