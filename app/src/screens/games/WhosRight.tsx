import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Segment = { text: string; label: 'criticism' | 'contempt' | 'defensiveness' | 'stonewalling' | 'neutral' };

const TRANSCRIPT: Segment[] = [
  { text: 'You always forget to call me back.', label: 'criticism' },
  { text: 'Maybe if you were worth calling.', label: 'contempt' },
  { text: 'I only forgot once.', label: 'defensiveness' },
  { text: '(silence)', label: 'stonewalling' },
  { text: 'Let’s set a reminder together.', label: 'neutral' },
];

export default function WhosRight({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'whos-right' };
  const [selected, setSelected] = useState<Record<number, Segment['label']>>({});
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
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
        <Text variant="body">Highlight harmful patterns</Text>
        {TRANSCRIPT.map((seg, i) => (
          <View key={i} style={styles.row}>
            <Text variant="body">{seg.text}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['criticism', 'contempt', 'defensiveness', 'stonewalling'] as Segment['label'][]).map((l) => (
                <Pressable key={l} onPress={() => toggle(i, l)} style={[styles.badge, selected[i] === l && styles.badgeOn]}>
                  <Text variant="keyword">{l}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <SquishyButton style={styles.btn} onPress={() => { HapticFeedbackSystem.selection(); }}><Text variant="header">Review</Text></SquishyButton>
        <Text variant="keyword">Accuracy {accuracy}%</Text>
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
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ selected, accuracy, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  row: { marginTop: 8, gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#120016', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)' },
  badgeOn: { backgroundColor: '#5C1459' },
  btn: { alignSelf: 'flex-end', marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
});

