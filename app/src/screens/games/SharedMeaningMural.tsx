import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const SYMBOLS = ["🏔️ Mountains", "🌊 Ocean", "🏡 Home", "✈️ Travel", "🎨 Art", "👪 Family"];

export default function SharedMeaningMural({ route, navigation }: any) {
  const { gameId } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(sym: string) {
    if (selected.includes(sym)) setSelected(s => s.filter(i => i !== sym));
    else setSelected(s => [...s, sym]);
    HapticFeedbackSystem.selection();
  }

  function finish() {
    if (selected.length === 0) {
      speakMarcie("A blank canvas? How existential.");
      return;
    }
    const match = selected.length > 1; // Simulation
    speakMarcie(match ? "You picked similar vibes. Cute." : "Interesting mix. Chaos or complexity?");
    Alert.alert("Mural Created", `Symbols: ${selected.join(", ")}`, [{ text: "Hang It", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Co-Create Your Mural</Text>
        <Text variant="body">Pick symbols that represent "Us":</Text>
        <View style={styles.grid}>
          {SYMBOLS.map((s) => (
            <SquishyButton
              key={s}
              onPress={() => toggle(s)}
              style={[styles.item, selected.includes(s) ? styles.active : {}]}
            >
              <Text variant="body" style={{ color: selected.includes(s) ? '#000' : '#fff' }}>{s}</Text>
            </SquishyButton>
          ))}
        </View>
        <SquishyButton onPress={finish} style={styles.btn}>
          <Text variant="header">Reveal Mural</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Shared Meaning Mural',
    description: 'Visualize your shared culture',
    category: 'creative' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  item: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fff', width: '48%', alignItems: 'center' },
  active: { backgroundColor: '#E4E831', borderColor: '#E4E831' },
  btn: { marginTop: 20, backgroundColor: '#FA1F63', padding: 16, borderRadius: 12, alignItems: 'center' },
});
