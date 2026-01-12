import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function MirrorMode({ route, navigation }: any) {
  const { gameId } = route.params;
  const [keyword, setKeyword] = useState('');
  const [recording, setRecording] = useState(false);

  function toggleRecord() {
    setRecording(!recording);
    if (!recording) {
      speakMarcie("Recording... describe your partner in 3 words.");
    } else {
      speakMarcie("Analysis complete. You smiled twice. Good job.");
    }
  }

  function submit() {
    if (!keyword) {
      speakMarcie("Guess a word first.");
      return;
    }
    HapticFeedbackSystem.success();
    Alert.alert("Match!", "You guessed 'Resilient'. Correct.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Mirror Mode</Text>
        <Text variant="body">Record a 15s video describing your partner.</Text>
        <View style={styles.cam}>
          <Text variant="body" style={{ color: '#888' }}>[Camera Feed Mock]</Text>
          {recording && <View style={styles.recDot} />}
        </View>
        <SquishyButton onPress={toggleRecord} style={[styles.btn, recording && styles.recBtn]}>
          <Text variant="header">{recording ? "Stop" : "Record"}</Text>
        </SquishyButton>

        <Text variant="body" style={{ marginTop: 12 }}>Guess a word they used:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Kind"
          placeholderTextColor="#666"
          value={keyword}
          onChangeText={setKeyword}
        />
        <SquishyButton onPress={submit} style={styles.submit}><Text variant="header">Submit Guess</Text></SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Mirror Mode',
    description: 'Video analysis and keyword matching',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  cam: { height: 150, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', position: 'absolute', top: 10, right: 10 },
  btn: { marginTop: 8, backgroundColor: '#333', padding: 12, borderRadius: 8, alignItems: 'center' },
  recBtn: { backgroundColor: 'red' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, marginTop: 8 },
  submit: { marginTop: 8, backgroundColor: '#33DEA5', padding: 12, borderRadius: 8, alignItems: 'center' },
});
