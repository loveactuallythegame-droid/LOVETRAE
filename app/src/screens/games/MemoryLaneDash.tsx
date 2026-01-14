import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function MemoryLaneDash({ route, navigation }: any) {
  const { gameId } = route.params;
  const [memory, setMemory] = useState('');

  function submit() {
    if (!memory) {
      speakMarcie("Blanking on your own history? Ouch.");
      return;
    }
    speakMarcie("I'll verify that with the archives. Assuming you have any.");
    HapticFeedbackSystem.success();
    Alert.alert("Memory Logged", "Points for nostalgia.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Recall Challenge</Text>
        <Text variant="body">Where did you have your first proper date?</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. That Italian place..."
            placeholderTextColor="#666"
            value={memory}
            onChangeText={setMemory}
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Lock In Answer</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Memory Lane Dash',
    description: 'Race to recall details',
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
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, marginTop: 12 },
  btn: { marginTop: 16, backgroundColor: '#BE1980', padding: 16, borderRadius: 12, alignItems: 'center' },
});
