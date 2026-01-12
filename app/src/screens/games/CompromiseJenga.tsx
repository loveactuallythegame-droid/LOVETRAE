import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function CompromiseJenga({ route, navigation }: any) {
  const { gameId } = route.params;
  const [blocks, setBlocks] = useState<string[]>([]);
  const [offer, setOffer] = useState('');

  function addBlock() {
    if (!offer) return;
    setBlocks(b => [...b, offer]);
    setOffer('');
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Block added. Careful, don't let it wobble.");
  }

  function finish() {
    if (blocks.length < 3) {
      speakMarcie("That's not a tower, that's a pile of rubble. Need more compromises.");
      return;
    }
    Alert.alert("Tower Built", `Height: ${blocks.length} compromises.`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Compromise Tower</Text>
        <View style={styles.tower}>
            {blocks.map((b, i) => (
                <View key={i} style={[styles.block, { backgroundColor: i % 2 === 0 ? '#FA1F63' : '#33DEA5' }]}>
                    <Text variant="body" style={{ color: '#000', textAlign: 'center' }}>{b}</Text>
                </View>
            ))}
            {blocks.length === 0 && <Text variant="body" style={{ textAlign: 'center', opacity: 0.5 }}>No blocks yet</Text>}
        </View>
        <Text variant="body">Add a concession:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will cook on Mon/Wed"
            placeholderTextColor="#666"
            value={offer}
            onChangeText={setOffer}
        />
        <SquishyButton onPress={addBlock} style={styles.btn}>
            <Text variant="header">Stack Block</Text>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.done}>
            <Text variant="header">Finish Tower</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Compromise Jenga',
    description: 'Build a stable solution together',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  tower: { minHeight: 100, justifyContent: 'flex-end', gap: 2, marginBottom: 12 },
  block: { padding: 10, borderRadius: 4, width: '100%' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8 },
  btn: { marginTop: 12, backgroundColor: '#E4E831', padding: 16, borderRadius: 12, alignItems: 'center' },
  done: { marginTop: 12, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, alignItems: 'center' },
});
