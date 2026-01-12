import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const TONES = ["Sarcastic", "Anxious", "Warm", "Playful"];
const SENTENCE = "We need to talk about the budget.";

export default function ToneShiftChallenge({ route, navigation }: any) {
  const { gameId } = route.params;
  const [currentTone, setCurrentTone] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  function toggleRec() {
    setIsRecording(!isRecording);
    if (!isRecording) {
      speakMarcie(`Record: "${SENTENCE}" in a ${TONES[currentTone]} tone.`);
    } else {
      // Simulating analysis
      HapticFeedbackSystem.success();
      speakMarcie("Analysis: 85% match. Moving on.");
      if (currentTone < TONES.length - 1) {
        setCurrentTone(c => c + 1);
      } else {
        finish();
      }
    }
  }

  function finish() {
    Alert.alert("Vocal Range Certified", "You mastered the tones.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Tone: {TONES[currentTone]}</Text>
        <Text variant="body" style={styles.sentence}>{SENTENCE}</Text>
        <View style={styles.mic}>
            <Text style={{ fontSize: 40 }}>🎙️</Text>
            {isRecording && <View style={styles.wave} />}
        </View>
        <SquishyButton onPress={toggleRec} style={[styles.btn, isRecording && styles.stop]}>
          <Text variant="header">{isRecording ? "Stop & Analyze" : "Record"}</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Tone Shift',
    description: 'Master your vocal tone',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 300,
    currentStep: currentTone,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, currentTone]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  sentence: { fontSize: 18, textAlign: 'center', marginVertical: 20, fontStyle: 'italic' },
  mic: { alignItems: 'center', justifyContent: 'center', height: 100 },
  wave: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FA1F63', opacity: 0.5 },
  btn: { backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
  stop: { backgroundColor: '#FA1F63' },
});
