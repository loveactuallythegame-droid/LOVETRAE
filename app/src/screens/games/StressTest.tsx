import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { encryptSensitive } from '../../lib/encryption';
import { speakMarcie } from '../../lib/voice-engine';

const DOMAINS = ['Money', 'Work', 'Family', 'Health'] as const;

export default function StressTest({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'stress-test' };
  const [scores, setScores] = useState<Record<string, number>>({ Money: 50, Work: 50, Family: 50, Health: 50 });
  const sessionId = useRef<string | null>(null);
  const userId = useRef<string | null>(null);
  const [partnerSpill, setPartnerSpill] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      userId.current = user?.id || null;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('stress_test_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (typeof st.spillover === 'number') setPartnerSpill(st.spillover);
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  function set(domain: string, v: number) {
    setScores((s) => ({ ...s, [domain]: Math.max(0, Math.min(100, v)) }));
  }

  const spillover = useMemo(() => Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (DOMAINS.length * 100)) * 100), [scores]);
  useEffect(() => { if (spillover >= 70) speakMarcie('Your work stress is bleeding into your relationship like a bad dye job.'); }, [spillover]);

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Rate external stressors</Text>
        {DOMAINS.map((d) => (
          <View key={d} style={styles.row}>
            <Text variant="body">{d}</Text>
            <View style={styles.barWrap}>
              <Animated.View style={[styles.bar, useAnimatedStyle(() => ({ width: withTiming(`${scores[d]}%`) }))]} />
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <SquishyButton onPress={() => set(d, scores[d] - 10)}><Text variant="header">-</Text></SquishyButton>
              <SquishyButton onPress={() => set(d, scores[d] + 10)}><Text variant="header">+</Text></SquishyButton>
            </View>
          </View>
        ))}
        <Text variant="keyword">Spillover {spillover}%{partnerSpill !== null ? ` vs Partner ${partnerSpill}%` : ''}</Text>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Stress Test',
    description: 'Rate stressors and visualize spillover',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 75,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: spillover, honestyScore: 60, completionTime: 0, partnerSync: 0 },
  }), [gameId, spillover]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const awarenessBonus = Math.min(25, Math.round(spillover * 0.25));
    const xp = Math.min(100, 75 + awarenessBonus);
    const enc = encryptSensitive(JSON.stringify({ scores, spillover }), userId.current || '');
    try { await supabase.from('analytics').insert({ key: 'stress_test', payload: enc }); } catch {}
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ scores, spillover, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["slider"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  row: { marginTop: 8, gap: 6 },
  barWrap: { height: 16, backgroundColor: '#120016', borderRadius: 8, overflow: 'hidden' },
  bar: { height: 16, backgroundColor: '#33DEA5' },
});
