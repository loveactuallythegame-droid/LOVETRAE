import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const CONFLICT = "I feel ignored when you game all night.";

export default function RoleSwap({ route, navigation }: any) {
  const { gameId } = route.params;
  const [reply, setReply] = useState('');

  function submit() {
    speakMarcie("Interesting perspective. You sound just like them. Almost.");
    HapticFeedbackSystem.success();
    Alert.alert("Scene Cut", "Swap complete.", [{ text: "Wrap", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Role Swap</Text>
        <Text variant="body">Partner says:</Text>
        <Text variant="sass" style={styles.line}>"{CONFLICT}"</Text>
        <Text variant="body">Reply AS THEM (defend yourself as they would):</Text>
        <TextInput
            style={styles.input}
            placeholder="Type their usual response..."
            placeholderTextColor="#666"
            value={reply}
            onChangeText={setReply}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Send Line</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Role Swap',
    description: 'Walk a mile in their arguments',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 350,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  line: { fontSize: 18, textAlign: 'center', marginVertical: 16, color: '#FA1F63', fontStyle: 'italic' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 80 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
