import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const INGREDIENTS = ["Coffee", "Tea", "News", "Music", "Cuddles", "Walk", "Silence", "Podcast"];

export default function RitualBuilder({ route, navigation }: any) {
  const { gameId } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    if (selected.includes(item)) {
      setSelected(s => s.filter(i => i !== item));
    } else {
      if (selected.length >= 3) {
        speakMarcie("Three ingredients max. Keep it simple.");
        return;
      }
      setSelected(s => [...s, item]);
      HapticFeedbackSystem.selection();
    }
  }

  function submit() {
    if (selected.length < 2) {
      speakMarcie("A ritual needs at least two things. Try harder.");
      return;
    }
    const name = selected.join(" + ");
    speakMarcie(`Ah, the "${name}" ritual. Very cozy.`);
    Alert.alert("Ritual Built", `You created: ${name}`, [{ text: "Save", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Build a Morning Ritual</Text>
        <Text variant="body">Select 2-3 ingredients:</Text>
        <View style={styles.grid}>
          {INGREDIENTS.map((ing) => (
            <SquishyButton
              key={ing}
              onPress={() => toggle(ing)}
              style={[styles.item, selected.includes(ing) ? styles.active : {}]}
            >
              <Text variant="body" style={{ color: selected.includes(ing) ? '#000' : '#fff' }}>{ing}</Text>
            </SquishyButton>
          ))}
        </View>
        <Text variant="keyword" style={{ marginTop: 12, textAlign: 'center' }}>
            {selected.join(" + ")}
        </Text>
        <SquishyButton onPress={submit} style={styles.submit}><Text variant="header">Build Ritual</Text></SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Ritual Builder',
    description: 'Design a shared habit',
    category: 'creative' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  item: { padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#fff' },
  active: { backgroundColor: '#33DEA5', borderColor: '#33DEA5' },
  submit: { marginTop: 16, backgroundColor: '#FA1F63', padding: 16, borderRadius: 12, alignItems: 'center' },
});
