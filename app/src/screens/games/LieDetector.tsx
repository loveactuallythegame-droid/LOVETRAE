import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { speakMarcie } from '../../lib/voice-engine';
import { useAppStore } from '../../state/store';

export default function LieDetector({ route, navigation }: any) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    speakMarcie("Partner, record your answer. I'm listening for fluency, steadiness, and filler words. Don't lie to me.");
  }, []);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    analyzeRecording(uri);
  }

  function analyzeRecording(uri: string | null) {
    setAnalyzing(true);
    // Mock analysis since we don't have a real backend ML service connected for this demo
    setTimeout(() => {
      const fluency = Math.floor(Math.random() * 10) + 1; // 1-10
      const steadiness = Math.floor(Math.random() * 10) + 1;
      const fillerWords = Math.floor(Math.random() * 5); // 0-5

      const score = (fluency * 2) + (steadiness * 2) - (fillerWords * 2);
      const total = Math.max(0, Math.min(25, 15 + Math.floor(Math.random() * 10))); // Mock total score / 25

      setResult({
        fluency,
        steadiness,
        fillerWords,
        score: total,
        passed: total > 18
      });
      setAnalyzing(false);

      if (total > 20) {
        speakMarcie("Ooh—24/25. Only slipped on ‘uh’ once. I’ll allow it… this time.");
      } else {
        speakMarcie("Hmm. Too many pauses. Are you hiding something, or just thinking?");
      }
    }, 2000);
  }

  return (
    <LinearGradient colors={['#2A0040', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header" style={styles.title}>Lie Detector: Lite™</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="body" style={styles.prompt}>
            Partner A asks: "What’s one thing you almost didn’t tell me this week?"
          </Text>
          <Text variant="body" style={styles.subPrompt}>
            Partner B: Hold the button and answer honestly. ≤10 seconds.
          </Text>
        </GlassCard>

        <View style={styles.recordContainer}>
          <SquishyButton
            onPress={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
            style={[styles.recordBtn, recording ? styles.recording : {}]}
          >
            <Text variant="header">{recording ? 'Tap to Stop' : 'Tap to Record'}</Text>
          </SquishyButton>
        </View>

        {analyzing && (
          <GlassCard style={styles.resultCard}>
            <Text variant="header">Analyzing Prosody...</Text>
            <Text variant="body">Checking pitch variance...</Text>
            <Text variant="body">Detecting hesitation...</Text>
          </GlassCard>
        )}

        {result && !analyzing && (
          <GlassCard style={styles.resultCard}>
            <Text variant="header" style={{ color: result.passed ? '#33DEA5' : '#FA1F63' }}>
              Score: {result.score}/25
            </Text>
            <View style={styles.statRow}>
              <Text variant="body">Fluency:</Text>
              <Text variant="keyword">{result.fluency}/10</Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="body">Steadiness:</Text>
              <Text variant="keyword">{result.steadiness}/10</Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="body">Filler Words:</Text>
              <Text variant="keyword">{result.fillerWords}</Text>
            </View>
            <Text variant="body" style={{ marginTop: 10, fontStyle: 'italic' }}>
              {result.passed ? "Marcie: I'll allow it." : "Marcie: Try again. Less thinking, more truth."}
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  title: { fontSize: 24, color: '#fff' },
  card: { padding: 20, gap: 10 },
  prompt: { fontSize: 18, textAlign: 'center', color: '#fff' },
  subPrompt: { fontSize: 14, textAlign: 'center', color: '#ccc' },
  recordContainer: { alignItems: 'center', justifyContent: 'center', height: 200 },
  recordBtn: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#FA1F63', alignItems: 'center', justifyContent: 'center' },
  recording: { backgroundColor: '#ff0000', transform: [{ scale: 1.1 }] },
  resultCard: { padding: 20, gap: 10, alignItems: 'center' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
});
