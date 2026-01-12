import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

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
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Vow Remix</Text>
        <Text variant="body">Complete the sentence:</Text>
        <Text variant="sass" style={styles.prompt}>"I vow to love you even when..."</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. you eat all the chips"
            placeholderTextColor="#666"
            value={vow}
            onChangeText={setVow}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Seal Vow</Text>
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
  prompt: { fontSize: 20, textAlign: 'center', marginVertical: 16, color: '#33DEA5' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 80 },
  btn: { marginTop: 16, backgroundColor: '#FA1F63', padding: 16, borderRadius: 12, alignItems: 'center' },
});
