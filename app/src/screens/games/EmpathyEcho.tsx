import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const WORRY = "I feel overwhelmed by my job insecurity right now.";

export default function EmpathyEcho({ route, navigation }: any) {
  const { gameId } = route.params;
  const [response, setResponse] = useState('');

  function check() {
    const r = response.toLowerCase();
    if (r.includes('fix') || r.includes('solution') || r.includes('should')) {
      speakMarcie("Stop trying to fix it. Just listen.");
      HapticFeedbackSystem.error();
    } else if (r.length < 10) {
        speakMarcie("Too short. Empathy requires more than a grunt.");
    } else {
      speakMarcie("That sounds like validation. Good.");
      HapticFeedbackSystem.success();
      Alert.alert("Empathy Scored", "You made them feel seen.", [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Partner's Worry</Text>
        <Text variant="sass" style={styles.worry}>"{WORRY}"</Text>
        <Text variant="body">Respond with validation ONLY (no fixing):</Text>
        <TextInput
            style={styles.input}
            placeholder="That sounds really hard..."
            placeholderTextColor="#666"
            value={response}
            onChangeText={setResponse}
            multiline
        />
        <SquishyButton onPress={check} style={styles.btn}>
            <Text variant="header">Send Echo</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Empathy Echo',
    description: 'Validate without fixing',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => check()} />;
}

const styles = StyleSheet.create({
  worry: { fontSize: 18, textAlign: 'center', marginVertical: 16, color: '#fff', fontStyle: 'italic' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 80 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
