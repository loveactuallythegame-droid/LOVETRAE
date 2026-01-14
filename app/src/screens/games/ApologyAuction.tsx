import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const SAMPLES = [
  { text: 'Sorry you feel that way.', expected: 10 },
  { text: "I'm sorry I hurt you. I was wrong.", expected: 90 },
  { text: 'Fine, sorry. Happy now?', expected: 5 },
  { text: 'I take responsibility and will repair this.', expected: 85 },
];

export default function ApologyAuction({ route, navigation }: any) {
  const { gameId } = route.params;
  const [value, setValue] = useState(50);
  const [index, setIndex] = useState(0);
  const x = useSharedValue(0);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
      }
    });
  }, [gameId]);

  function onMove(nx: number, width: number) {
    x.value = withTiming(nx);
    setValue(Math.max(0, Math.min(100, Math.round((nx / width) * 100))));
  }

  function next() {
    const sample = SAMPLES[index];
    const diff = Math.abs(value - sample.expected);
    if (sample.text.includes('Sorry you feel that way') && value >= 80) { speakMarcie("You rated 'Sorry you feel that way' as 80/100? No wonder you're here."); HapticFeedbackSystem.warning(); }
    setIndex((i) => Math.min(SAMPLES.length - 1, i + 1));
  }

  async function finish(scoreFromEngine: number, xpFromEngine: number) {
    const sample = SAMPLES[index];
    const accuracyBonus = Math.min(35, Math.max(0, 35 - Math.abs(value - sample.expected) * 0.35));
    const xp = Math.min(100, 65 + Math.round(accuracyBonus));
    const score = Math.round(scoreFromEngine * 0.8 + (100 - Math.abs(value - sample.expected)) * 0.2);
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score, state: JSON.stringify({ ratings: value, sampleIndex: index, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Rate apology sincerity</Text>
        <Text variant="sass">{SAMPLES[index].text}</Text>
        <View style={styles.slider} onLayout={(e) => onMove(x.value, e.nativeEvent.layout.width)}>
          <Animated.View style={[styles.knob, useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }))]} />
        </View>
        <Text variant="keyword">{value}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <SquishyButton onPress={next} style={styles.btn}><Text variant="header">Next</Text></SquishyButton>
          <SquishyButton onPress={() => finish(0, 0)} style={styles.btn}><Text variant="header">Submit</Text></SquishyButton>
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Apology Auction',
    description: 'Rate apology statements against healthy standards',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 65,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 50, honestyScore: 60, completionTime: index * 10, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={["slider"]} inputArea={inputArea} onComplete={({ score, xpEarned }) => finish(score, xpEarned)} />;
}

const styles = StyleSheet.create({
  slider: { height: 24, backgroundColor: '#120016', borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FA1F63' },
  btn: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
});
