import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const GAPS = ["Hobbies: Pottery", "Childhood Friend: ?", "Dream Vacation: ?"];

export default function LoveMapGapQuest({ route, navigation }: any) {
  const { gameId } = route.params;
  const [question, setQuestion] = useState('');

  function submit() {
    if (!question.includes('?')) {
      speakMarcie("That's not a question. Try again.");
      return;
    }
    HapticFeedbackSystem.success();
    speakMarcie("Good question. Go ask them IRL.");
    Alert.alert("Quest Logged", "You identified a gap.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Map Gaps Detected</Text>
        <View style={{ gap: 8, marginVertical: 12 }}>
            {GAPS.map((g, i) => (
                <Text key={i} variant="body" style={{ color: g.includes('?') ? '#FA1F63' : '#fff' }}>• {g}</Text>
            ))}
        </View>
        <Text variant="body">Craft a question to close a gap:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Who was your best friend in 3rd grade?"
          placeholderTextColor="#666"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Log Question</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Love Map Gap Quest',
    description: 'Fill in the blanks of your partner knowledge',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 60, marginTop: 8 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
