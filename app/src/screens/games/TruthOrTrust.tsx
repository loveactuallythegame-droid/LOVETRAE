import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text, SquishyButton, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function TruthOrTrust({ route, navigation }: any) {
  const { gameId } = route.params;
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [levels, setLevels] = useState<number[]>([]);
  const [transcript, setTranscript] = useState('');
  const sessionId = useRef<string | null>(null);
  const wave = useSharedValue(1);
  const [prompt, setPrompt] = useState('Breathe. Speak with intention.');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        const profile = await supabase.from('profiles').select('origin_story').eq('user_id', user.id).single();
        const origin = (profile.data?.origin_story || '').toString().slice(0, 60);
        const q = origin ? `Thinking of when it began: ${origin}. What truth do you keep avoiding?` : 'What truth do you keep avoiding?';
        setPrompt(q);
        speakMarcie(q);
      }
    });
  }, [gameId]);

  async function startRec() {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) { speakMarcie('Microphone permission denied.'); return; }
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
    await rec.startAsync();
    setRecording(rec);
  }

  async function stopRec() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const status = await recording.getStatusAsync();
    const analysis = await analyzeAudio(recording);
    const score = honestyScore(analysis, transcript);
    const result = { score, xpEarned: Math.min(100, 50 + Math.round((analysis as any).vulnerability * 0.5)) };
    if (score < 40) speakMarcie('Authenticity check: flunking. Try again without the performance.');
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: result.score, state: JSON.stringify({ analysis, transcript }) });
    navigation.goBack();
  }

  const micStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: withTiming(1 + Math.random() * 0.6, { duration: 240 }) }] }));
  const inputArea = (
    <View>
      <Text variant="body">Record your truth</Text>
      <Animated.View style={[styles.mic, micStyle]} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <SquishyButton onPress={startRec}><Text variant="header">Record</Text></SquishyButton>
        <SquishyButton onPress={stopRec}><Text variant="header">Stop</Text></SquishyButton>
      </View>
      <GlassCard>
        <Text variant="sass">{prompt}</Text>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Truth or Trust',
    description: 'Voice reflection with honesty scoring',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 50,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <GameContainer state={baseState} inputs={["voice"]} inputArea={inputArea} onComplete={() => {}} />
  );
}

async function analyzeAudio(rec: Audio.Recording) {
  const status = await rec.getStatusAsync();
  const d = (status.durationMillis || 0) / 1000;
  const pauses = Math.max(0, Math.floor(d / 6));
  const vocab = 0;
  return { duration: d, avgLevel: vocab, pauses, vulnerability: Math.min(100, Math.round(d + vocab)) } as any;
}

function honestyScore(a: { duration: number; avgLevel: number; pauses: number }, t: string) {
  const vocab = (t.match(/sorry|feel|afraid|trust|love|thank|appreciate|vulnerable|honest|truth/gi) || []).length;
  const oneWord = t.trim().split(/\s+/).length <= 3 ? -10 : 0;
  const honesty = Math.min(100, Math.round(a.duration * 1.5 - a.pauses * 3 + vocab * 8 + oneWord));
  const completion = Math.max(0, 100 - Math.abs(a.duration - 60));
  const vulnerability = Math.min(100, vocab * 10);
  return Math.round(0.5 * honesty + 0.25 * completion + 0.25 * vulnerability);
}

const styles = StyleSheet.create({
  mic: { height: 120, backgroundColor: '#1a0a1f', borderRadius: 12 },
});
