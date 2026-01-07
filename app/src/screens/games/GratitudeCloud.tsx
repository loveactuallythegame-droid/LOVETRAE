import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/colors';

type CloudWord = { text: string; weight: number; left: number; top: number; size: number };

export default function GratitudeCloud({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'gratitude-cloud' };
  const [input, setInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [cloud, setCloud] = useState<CloudWord[]>([]);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);
  const [partnerWords, setPartnerWords] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      let couple_id: string | null = null;
      try {
        const base = supabase.from('profiles').select('couple_code,user_id') as any;
        if (typeof base.eq === 'function') {
          const res = await base.eq('user_id', user?.id || '').single();
          couple_id = res?.data?.couple_code ?? null;
        } else {
          const res = await (supabase.from('profiles').select('couple_code,user_id') as any);
          const row = (res?.data || []).find((r: any) => r.user_id === (user?.id || ''));
          couple_id = row?.couple_code ?? null;
        }
      } catch {
        couple_id = null;
      }
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('gratitude_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload: any) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (st.words) setPartnerWords(st.words);
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  function addWord(t: string) {
    const cleaned = t.trim().toLowerCase();
    if (!cleaned) return;
    setWords((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setInput('');
    if (cleaned === 'tolerable') {
      try { const { speakMarcie } = require('../../lib/voice-engine'); speakMarcie("I see you typed 'tolerable' three times. How romantic."); } catch {}
    }
  }

  useEffect(() => {
    const items = words.map((w) => {
      const weight = Math.min(3, Math.max(1, w.length >= 8 ? 3 : w.length >= 5 ? 2 : 1));
      const size = 12 + weight * 6;
      return { text: w, weight, left: Math.random() * 240, top: Math.random() * 160, size };
    });
    setCloud(items);
  }, [words]);

  const pulse = useSharedValue(1);
  useEffect(() => { pulse.value = withRepeat(withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Type positive adjectives about your partner</Text>
        <TextInput placeholder="Loving, brave, hilarious" style={styles.input} value={input} onChangeText={setInput} onSubmitEditing={() => addWord(input)} />
      </GlassCard>
      <Animated.View style={[styles.cloud, cloudStyle]}>
        {cloud.map((c, i) => (
          <Text key={`me_${i}`} style={{ position: 'absolute', left: c.left, top: c.top, fontSize: c.size, color: COLORS.warningYellow }}>{c.text}</Text>
        ))}
        {partnerWords.slice(0, 20).map((w, i) => (
          <Text key={`partner_${i}`} style={{ position: 'absolute', left: Math.random() * 240, top: Math.random() * 160, fontSize: 14, color: COLORS.violet }}>{w}</Text>
        ))}
      </Animated.View>
    </View>
  );

  const uniqueCount = words.length;
  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Gratitude Cloud',
    description: 'Rapid typing of gratitude adjectives',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 30,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: Math.min(100, uniqueCount * 8), honestyScore: Math.min(100, uniqueCount * 6), completionTime: 0, partnerSync: 0 },
  }), [gameId, uniqueCount]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(60, 30 + uniqueCount * 2);
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ words, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: COLORS.darkSurface, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  cloud: { height: 220 },
});
