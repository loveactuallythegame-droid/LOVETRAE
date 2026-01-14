import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

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
    }, 100);

    setTimeout(() => {
        clearInterval(t);
        const final = COMBOS[Math.floor(Math.random() * COMBOS.length)];
        setResult(final);
        setSpinning(false);
        speakMarcie(final);
        HapticFeedbackSystem.success();
    }, 2000);
  }

  function accept() {
    Alert.alert("Ritual Accepted", "Go do it. Take a photo.", [{ text: "On it", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <View style={{ alignItems: 'center', padding: 20 }}>
            <Text variant="header" style={{ fontSize: 60 }}>🎰</Text>
            <Text variant="sass" style={styles.res}>{result || "?"}</Text>
            <SquishyButton onPress={spin} style={styles.btn} disabled={spinning}>
                <Text variant="header">{spinning ? "Spinning..." : "Spin Wheel"}</Text>
            </SquishyButton>
            {result && !spinning && (
                <SquishyButton onPress={accept} style={styles.accept}>
                    <Text variant="header">Accept Fate</Text>
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

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  res: { fontSize: 24, textAlign: 'center', marginVertical: 20, color: '#E4E831', height: 60 },
  btn: { backgroundColor: '#5C1459', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  accept: { marginTop: 12, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
});
