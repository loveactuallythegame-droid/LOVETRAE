import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Scenario = { text: string; expected: 'green' | 'red' };

const SCENARIOS: Scenario[] = [
  { text: 'Checking phone during conversation', expected: 'red' },
  { text: 'Setting boundaries respectfully', expected: 'green' },
  { text: 'Ghosting after a fight', expected: 'red' },
];

export default function SlapOfTruth({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'slap-of-truth' };
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ choice: 'green' | 'red'; correct: boolean }[]>([]);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);
  const partnerDecisions = useRef<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('slap_truth_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try { const st = JSON.parse(row.state || '{}'); if (st.decisions) partnerDecisions.current = st.decisions; } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  const x = useSharedValue(0);
  const rotate = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { rotate: `${rotate.value}deg` }] }));
  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => { x.value = g.dx; rotate.value = g.dx * 0.05; },
      onPanResponderRelease: (_, g) => {
        const choice = g.dx > 60 ? 'green' : g.dx < -60 ? 'red' : null;
        if (choice) {
          const scenario = SCENARIOS[index];
          const correct = (choice === scenario.expected);
          setDecisions((d) => [...d, { choice, correct }]);
          if (choice === 'green' && correct) HapticFeedbackSystem.success(); else if (choice === 'red' && correct) HapticFeedbackSystem.success(); else HapticFeedbackSystem.warning();
          if (!correct) speakMarcie('You swiped green on emotional unavailability? Let\'s unpack that.');
          x.value = withTiming(0); rotate.value = withTiming(0);
          const next = Math.min(SCENARIOS.length - 1, index + 1);
          setIndex(next);
          if (sessionId.current) updateGameSession(sessionId.current, { state: JSON.stringify({ decisions: [...decisions, { choice, correct }] }) });
        } else {
          x.value = withTiming(0); rotate.value = withTiming(0);
        }
      },
    }).panHandlers;
  }, [index, decisions]);

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Swipe right for Green flag, left for Red flag</Text>
        <Animated.View style={[styles.card, style]} {...pan}>
          <Text variant="header">{SCENARIOS[index]?.text}</Text>
        </Animated.View>
      </GlassCard>
    </View>
  );

  const alignment = Math.min(100, Math.round((decisions.length && partnerDecisions.current.length) ? (decisions.filter((d, i) => partnerDecisions.current[i]?.choice === d.choice).length / Math.min(decisions.length, partnerDecisions.current.length)) * 100 : 0));
  const baseState = useMemo(() => ({
    id: gameId,
    title: 'The Slap of Truth',
    description: 'Swipe decisions on relationship scenarios',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 80,
    currentStep: index,
    totalTime: 45,
    playerData: { vulnerabilityScore: 50, honestyScore: 50, completionTime: index * 10, partnerSync: alignment },
  }), [gameId, index, alignment]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(40, Math.round(alignment * 0.4));
    const xp = Math.min(120, 80 + bonus);
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ decisions, alignment, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["slider"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)' },
});

