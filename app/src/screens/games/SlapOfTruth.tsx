import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

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
    supabase.auth.getSession().then(async ({ data }: any) => {
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
  const style = useAnimatedStyle(() => ({ 
    transform: [{ translateX: x.value }, { rotate: `${rotate.value}deg` }] 
  }));
  
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
          if (choice === 'green' && correct) HapticFeedbackSystem.success(); 
          else if (choice === 'red' && correct) HapticFeedbackSystem.success(); 
          else HapticFeedbackSystem.warning();
          if (!correct) speakMarcie('You swiped green on emotional unavailability? Let\'s unpack that.');
          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal }); 
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          const next = Math.min(SCENARIOS.length - 1, index + 1);
          setIndex(next);
          if (sessionId.current) updateGameSession(sessionId.current, { state: JSON.stringify({ decisions: [...decisions, { choice, correct }] }) });
        } else {
          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal }); 
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
        }
      },
    }).panHandlers;
  }, [index, decisions]);

  const alignment = Math.min(100, Math.round((decisions.length && partnerDecisions.current.length) ? (decisions.filter((d, i) => partnerDecisions.current[i]?.choice === d.choice).length / Math.min(decisions.length, partnerDecisions.current.length)) * 100 : 0));

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(40, Math.round(alignment * 0.4));
    const xp = Math.min(120, 80 + bonus);
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ decisions, alignment, xp }) });
    navigation.goBack();
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={{ gap: SPACING.regular }}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          <Typography variant="body">Swipe right for Green flag, left for Red flag</Typography>
          <Animated.View style={[styles.card, style]} {...pan}>
            <Typography variant="h2" center>{SCENARIOS[index]?.text}</Typography>
          </Animated.View>
        </GlassCard>

        <View style={styles.buttonContainer}>
          <SquishyButton 
            onPress={() => onComplete({ score: decisions.filter(d => d.correct).length * 10, xpEarned: 80 })} 
            variant="primary"
          >
            <Typography variant="h2">Complete</Typography>
          </SquishyButton>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { 
    marginTop: SPACING.regular, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    backgroundColor: COLORS.backgroundSecondary, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle,
    minHeight: 120,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: SPACING.large,
  },
});
