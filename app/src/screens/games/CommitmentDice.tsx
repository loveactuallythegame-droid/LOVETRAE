import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const PROMPTS = ["Text one reason you chose them today", "Send a photo of your favorite memory", "Commit to one chore this week"];

export default function CommitmentDice({ route, navigation }: any) {
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
      speakMarcie("You can't commit to nothing. Type something.");
      return;
    }
    speakMarcie("Commitment logged. I'll be watching.");
    HapticFeedbackSystem.success();
    Alert.alert("Commitment Sent", "Your partner has been notified.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {!rolled ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
                <Text variant="header" style={{ fontSize: 60 }}>🎲</Text>
                <SquishyButton onPress={roll} style={styles.rollBtn}><Text variant="header">Roll for Commitment</Text></SquishyButton>
            </View>
        ) : (
            <View style={{ gap: 12 }}>
                <Text variant="body">Prompt:</Text>
                <Text variant="header" style={{ color: '#FA1F63', textAlign: 'center' }}>{prompt}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your commitment..."
                    placeholderTextColor="#666"
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}><Text variant="header">Commit</Text></SquishyButton>
            </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Commitment Dice',
    description: 'Random acts of commitment',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
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
