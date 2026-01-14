import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Behavior = { text: string; category: 'window' | 'wall' };

const BEHAVIORS: Behavior[] = [
  { text: 'Sharing phone passcode', category: 'window' },
  { text: 'Closing door for therapy', category: 'wall' },
  { text: 'Hiding purchase history', category: 'wall' },
  { text: 'Sharing location during work trips', category: 'window' },
  { text: 'Deleted messages', category: 'wall' },
  { text: 'Open calendar access', category: 'window' },
];

export default function WindowsAndWalls({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'windows-walls' };
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ choice: 'window' | 'wall'; correct: boolean }[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const coupleId = useRef<string | null>(null);
  const partnerDecisions = useRef<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        setSessionId(session.id);
        supabase
          .channel('windows_walls_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== session.id) {
              try { const st = JSON.parse(row.state || '{}'); if (st.decisions) partnerDecisions.current = st.decisions; } catch { }
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
        const choice = g.dx > 60 ? 'wall' : g.dx < -60 ? 'window' : null;
        if (choice) {
          const item = BEHAVIORS[index];
          // For this game, "correct" is subjective but we can check if it matches the general "healthy" categorization
          // Or we can say "correct" if it matches partner? Let's use the predefined category for "healthy boundary" vs "unhealthy secrecy" logic
          // Actually, "Window" (Transparency) vs "Wall" (Privacy).
          // Let's assume the user is sorting them.
          const correct = (choice === item.category);

          setDecisions((d) => [...d, { choice, correct }]);
          HapticFeedbackSystem.selection();

          if (item.text.includes('phone') && choice === 'window') {
            // Marcie's specific line for phone/transparency
            speakMarcie("You think checking your partner's phone is a 'window'? Honey, that's a wrecking ball.");
          }

          x.value = withTiming(0); rotate.value = withTiming(0);
          const next = Math.min(BEHAVIORS.length - 1, index + 1);
          setIndex(next);
          if (sessionId) updateGameSession(sessionId, { state: JSON.stringify({ decisions: [...decisions, { choice, correct }] }) });
        } else {
          x.value = withTiming(0); rotate.value = withTiming(0);
        }
      },
    }).panHandlers;
  }, [index, decisions]);

  const alignment = Math.min(100, Math.round((decisions.length && partnerDecisions.current.length) ? (decisions.filter((d, i) => partnerDecisions.current[i]?.choice === d.choice).length / Math.min(decisions.length, partnerDecisions.current.length)) * 100 : 0));

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Windows & Walls',
    description: 'Sort behaviors into Transparency (Window) or Privacy (Wall)',
    category: 'healing' as const,
    difficulty: 'medium' as const,
    xpReward: 70,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 60, honestyScore: 60, completionTime: index * 5, partnerSync: alignment },
  }), [gameId, index, alignment]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const boundaryBonus = Math.min(30, decisions.filter(d => d.correct).length * 5);
    const xp = Math.min(100, 70 + boundaryBonus);
    if (sessionId) updateGameSession(sessionId, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ decisions, alignment, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Swipe LEFT for Window (Transparency), RIGHT for Wall (Privacy)</Text>
        <Animated.View style={[styles.card, style]} {...pan}>
          <Text variant="header">{BEHAVIORS[index]?.text}</Text>
        </Animated.View>
        <View style={styles.legend}>
          <Text variant="keyword" style={{ color: '#33DEA5' }}>← Window</Text>
          <Text variant="keyword" style={{ color: '#E11637' }}>Wall →</Text>
        </View>
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["slider"]} inputArea={inputArea} onComplete={onComplete} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 24, borderRadius: 12, backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', alignItems: 'center', minHeight: 150, justifyContent: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }
});
