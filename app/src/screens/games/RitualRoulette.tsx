import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const COMBOS = [
  "Wine + Stargazing + Poetry",
  "Popcorn + Pillow Fort + Horror Movie",
  "Tea + Foot Rub + Silence",
  "Coffee + Walk + Gossiping",
];

export default function RitualRoulette({ route, navigation }: any) {
  const { gameId } = route.params;
  const [result, setResult] = useState('');
  const [spinning, setSpinning] = useState(false);

  function spin() {
    setSpinning(true);
    setResult('');
    let i = 0;
    const t = setInterval(() => {
        setResult(COMBOS[i % COMBOS.length]);
        i++;
        HapticFeedbackSystem.selection();
    }, ANIMATIONS.duration.fast);

    setTimeout(() => {
        clearInterval(t);
        const final = COMBOS[Math.floor(Math.random() * COMBOS.length)];
        setResult(final);
        setSpinning(false);
        speakMarcie(final);
        HapticFeedbackSystem.success();
    }, ANIMATIONS.duration.slower * 3);
  }

  function accept() {
    Alert.alert("Ritual Accepted", "Go do it. Take a photo.", [{ text: "On it", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: SPACING.regular }}>
      <GlassCard>
        <View style={{ alignItems: 'center', padding: SPACING.large }}>
            <Typography variant="h1" style={{ fontSize: TYPOGRAPHY.fontSize.displayLarge }}>🎰</Typography>
            <Typography variant="sass" style={styles.res}>{result || "?"}</Typography>
            <SquishyButton onPress={spin} style={styles.btn} disabled={spinning}>
                <Typography variant="h2">{spinning ? "Spinning..." : "Spin Wheel"}</Typography>
            </SquishyButton>
            {result && !spinning && (
                <SquishyButton onPress={accept} style={styles.accept}>
                    <Typography variant="h2">Accept Fate</Typography>
                </SquishyButton>
            )}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Ritual Roulette',
    description: 'Randomize your romance',
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
  res: { 
    textAlign: 'center', 
    marginVertical: SPACING.large, 
    color: COLORS.creativeChaos, 
    height: SPACING.xxxlarge 
  },
  btn: { 
    backgroundColor: COLORS.healingHospital, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    width: '100%', 
    alignItems: 'center' 
  },
  accept: { 
    marginTop: SPACING.regular, 
    backgroundColor: COLORS.success, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    width: '100%', 
    alignItems: 'center' 
  },
});
