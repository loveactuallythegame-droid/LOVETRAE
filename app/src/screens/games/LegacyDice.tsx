import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const PROMPTS = ["One value for our kids?", "What will they say at our funeral?", "Our signature tradition?"];

export default function LegacyDice({ route, navigation }: any) {
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
      speakMarcie("Legacy requires words. Or action. Type.");
      return;
    }
    speakMarcie("Deep. I'm adding that to the archives.");
    HapticFeedbackSystem.success();
    Alert.alert("Legacy Recorded", "Saved for posterity.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {!rolled ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
                <Text variant="header" style={{ fontSize: 60 }}>🎲</Text>
                <SquishyButton onPress={roll} style={styles.rollBtn}><Text variant="header">Roll Legacy Dice</Text></SquishyButton>
            </View>
        ) : (
            <View style={{ gap: 12 }}>
                <Text variant="body">Big Question:</Text>
                <Text variant="header" style={{ color: '#E4E831', textAlign: 'center' }}>{prompt}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your thoughts..."
                    placeholderTextColor="#666"
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}><Text variant="header">Save Legacy</Text></SquishyButton>
            </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Legacy Dice',
    description: 'Discuss big picture values',
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
  rollBtn: { marginTop: 20, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 80, marginTop: 12 },
  doneBtn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
