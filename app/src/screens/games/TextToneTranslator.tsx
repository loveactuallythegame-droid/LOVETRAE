import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const RISKY_TEXT = "Fine. Do whatever you want.";

export default function TextToneTranslator({ route, navigation }: any) {
  const { gameId } = route.params;
  const [rewrite, setRewrite] = useState('');

  function check() {
    if (rewrite.toLowerCase().includes('fine')) {
      speakMarcie("You used the word 'fine' again. Are you trying to start a war?");
      HapticFeedbackSystem.error();
    } else {
      speakMarcie("Much better. Less passive, more aggressive... wait, no, just assertive.");
      HapticFeedbackSystem.success();
      Alert.alert("Translated", "Sent to partner for approval.", [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Risk Detected</Text>
        <Text variant="sass" style={styles.risk}>"{RISKY_TEXT}"</Text>
        <Text variant="body">Rewrite this to be safer:</Text>
        <TextInput
          style={styles.input}
          placeholder="I feel frustrated because..."
          placeholderTextColor="#666"
          value={rewrite}
          onChangeText={setRewrite}
          multiline
        />
        <SquishyButton onPress={check} style={styles.btn}>
            <Text variant="header">Translate</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Text Tone Translator',
    description: 'De-escalate digital communication',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => check()} />;
}

const styles = StyleSheet.create({
  risk: { fontSize: 18, color: '#FA1F63', marginVertical: 12, textAlign: 'center', fontStyle: 'italic' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, minHeight: 80 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
