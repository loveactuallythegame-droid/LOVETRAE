import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

type Segment = { text: string; label: 'criticism' | 'contempt' | 'defensiveness' | 'stonewalling' | 'neutral' };

const TRANSCRIPT: Segment[] = [
  { text: 'You always forget to call me back.', label: 'criticism' },
  { text: 'Maybe if you were worth calling.', label: 'contempt' },
  { text: 'I only forgot once.', label: 'defensiveness' },
  { text: '(silence)', label: 'stonewalling' },
  { text: 'Let\'s set a reminder together.', label: 'neutral' },
];

export default function WhosRight({ route, navigation }: any) {
  /* ... */
  const { gameId } = route.params || { gameId: 'whos-right' };
  const [selected, setSelected] = useState<Record<number, Segment['label']>>({});
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        setSessionId(session.id);
      }
    });
  }, [gameId]);

  function toggle(i: number, label: Segment['label']) {
    setSelected((s) => ({ ...s, [i]: s[i] === label ? undefined as any : label }));
  }

  const accuracy = useMemo(() => {
    const totalFlags = TRANSCRIPT.filter((t) => t.label !== 'neutral').length;
    const correct = TRANSCRIPT.reduce((acc, seg, i) => acc + ((selected[i] && seg.label !== 'neutral' && selected[i] === seg.label) ? 1 : 0), 0);
    return totalFlags ? Math.round((correct / totalFlags) * 100) : 0;
  }, [selected]);

  useEffect(() => {
    if (accuracy < 50 && Object.keys(selected).length) speakMarcie("That's not criticism, that's a character assassination. Tone it down.");
  }, [accuracy, selected]);

  const inputArea = (
    <View>
      <GlassCard>
        <Typography variant="instructions" center>Highlight harmful patterns</Typography>
        {TRANSCRIPT.map((seg, i) => (
          <View key={i} style={styles.row}>
            <Typography variant="body">{seg.text}</Typography>
            <View style={{ flexDirection: 'row', gap: SPACING.small }}>
              {(['criticism', 'contempt', 'defensiveness', 'stonewalling'] as Segment['label'][]).map((l) => (
                <Pressable key={l} onPress={() => toggle(i, l)} style={[styles.badge, selected[i] === l ? styles.badgeOn : {}]}>
                  <Typography variant="caption">{l}</Typography>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <SquishyButton style={styles.btn} onPress={() => { HapticFeedbackSystem.selection(); }}>
          <Typography variant="button">Review</Typography>
        </SquishyButton>
        <Typography variant="caption" center>Accuracy {accuracy}%</Typography>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: "Who's Right?",
    description: 'Identify contempt patterns accurately',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 70,
    currentStep: Object.keys(selected).length,
    totalTime: 60,
    playerData: { vulnerabilityScore: 50, honestyScore: 50, completionTime: 0, partnerSync: 0 },
  }), [gameId, selected]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(110, 70 + Math.round(accuracy * 0.4));
    if (sessionId) await updateGameSession(sessionId, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ selected, accuracy, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
  row: { 
    marginTop: SPACING.regular, 
    gap: SPACING.small 
  },
  badge: { 
    paddingHorizontal: SPACING.small, 
    paddingVertical: SPACING.tiny, 
    borderRadius: BORDER_RADIUS.xlarge, 
    backgroundColor: COLORS.backgroundPrimary, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  badgeOn: { 
    backgroundColor: COLORS.healingHospital 
  },
  btn: { 
    alignSelf: 'flex-end', 
    marginTop: SPACING.regular, 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.success, 
    borderRadius: BORDER_RADIUS.button 
  },
});
