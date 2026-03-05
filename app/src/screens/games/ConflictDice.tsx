import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Text, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { supabase, createGameSession, updateGameSession } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const SCENARIOS = ["Argue about thermostat", "Who does dishes?", "In-laws visiting", "Money stress"];
const CONSTRAINTS = ["No 'You' statements", "Whisper only", "Hold hands", "Rhyme every sentence"];

export default function ConflictDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [scenario, setScenario] = useState<string | null>(null);
  const [constraint, setConstraint] = useState<string | null>(null);
  const [rolled, setRolled] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      if (user) {
        const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
        if (couple.data?.couple_code) {
          const session = await createGameSession(gameId, user.id, couple.data.couple_code);
          setSessionId(session.id);
        }
      }
    });
  }, [gameId]);

  async function roll() {
    setRolled(true);
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const c = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setScenario(s);
    setConstraint(c);
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Rolling... Good luck with this combo.");

    if (sessionId) {
      // In a real implementation, we'd sync the random seed or result to the partner
      // via updateGameSession(sessionId, { state: JSON.stringify({ scenario: s, constraint: c }) })
      // For now, at least state update works
    }
  }

  async function finish() {
    if (sessionId) {
      await updateGameSession(sessionId, { finished_at: new Date().toISOString(), score: 100 });
    }
    Alert.alert("Scenario Complete", "Did you survive?", [{ text: "Yes", onPress: () => navigation.goBack() }]);
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
            <Text variant="sass">Practice conflict resolution with random scenarios! Constraints make communication more creative.</Text>
          </View>
        </View>

        {!rolled ? (
          <View style={{ alignItems: 'center', padding: SPACING.xlarge }}>
            <Text variant="h1" style={{ fontSize: TYPOGRAPHY.fontSize.displayLarge }}>🎲</Text>
            <SquishyButton onPress={roll} style={styles.rollBtn}>
              <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.gradientButton}
              >
                <Text variant="h2" style={{ color: COLORS.textPrimary }}>Roll Dice</Text>
              </LinearGradient>
            </SquishyButton>
          </View>
        ) : (
          <View style={{ gap: SPACING.regular }}>
            <View>
              <Text variant="body">Scenario:</Text>
              <Text variant="h2" style={{ color: COLORS.vibrantPink }}>{scenario}</Text>
            </View>
            <View>
              <Text variant="body">Constraint:</Text>
              <Text variant="h2" style={{ color: COLORS.mintGreen }}>{constraint}</Text>
            </View>
            <SquishyButton onPress={finish} style={styles.doneBtn}>
              <LinearGradient
                colors={[COLORS.mintGreen, COLORS.softViolet]}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.gradientButton}
              >
                <Text variant="h2" style={{ color: COLORS.textPrimary }}>We Did It</Text>
              </LinearGradient>
            </SquishyButton>
          </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Conflict Dice',
    description: 'Randomized conflict practice',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
  rollBtn: { 
    marginTop: SPACING.xlarge, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    width: '100%', 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  doneBtn: { 
    marginTop: SPACING.xlarge, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: SPACING.regular,
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
