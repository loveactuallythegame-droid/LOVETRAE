import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function RoleSwapRoast({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'role-swap-roast' };
  const [helium, setHelium] = useState(false);
  const [arOn, setArOn] = useState(false);
  const [laughs, setLaughs] = useState(0);
  const [partnerVotes, setPartnerVotes] = useState(0);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('role_swap_roast_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (st.vote_for && st.vote_for === sessionId.current) setPartnerVotes((v) => Math.min(5, v + 1));
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  function toggleHelium() {
    setHelium((h) => !h);
  }

  function toggleAr() {
    setArOn((a) => !a);
  }

  function addLaugh() {
    setLaughs((l) => Math.min(10, l + 1));
  }

  async function castVote() {
    if (!sessionId.current) return;
    try {
      await updateGameSession(sessionId.current, { state: JSON.stringify({ vote_for: sessionId.current }) });
    } catch {}
  }

  const accuracy = Math.min(100, Math.round(laughs * 10 + (helium ? 10 : 0) + (arOn ? 5 : 0)));
  const sync = Math.min(100, partnerVotes * 20);

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Role-Swap Roast',
    description: 'Impersonate your partner with filters and flair',
    category: 'creative' as const,
    difficulty: 'medium' as const,
    xpReward: 65,
    currentStep: 0,
    totalTime: 75,
    playerData: { vulnerabilityScore: Math.min(100, 60 + (helium ? 10 : 0)), honestyScore: accuracy, completionTime: 0, partnerSync: sync },
  }), [gameId, helium, accuracy, sync]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(35, partnerVotes * 7);
    const xp = Math.min(100, 65 + bonus);
    speakMarcie("Congratulations, you've successfully mocked your partner's trauma. How growth-oriented.");
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ helium, arOn, laughs, partnerVotes, accuracy, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Use camera, toggle filters, and deliver your impression</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <SquishyButton onPress={toggleHelium} style={styles.btn}><Text variant="header">Helium {helium ? 'On' : 'Off'}</Text></SquishyButton>
          <SquishyButton onPress={toggleAr} style={styles.btn}><Text variant="header">AR {arOn ? 'On' : 'Off'}</Text></SquishyButton>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <SquishyButton onPress={addLaugh} style={styles.btn}><Text variant="header">Laugh +1</Text></SquishyButton>
          <SquishyButton onPress={castVote} style={styles.btn}><Text variant="header">Cast Partner Vote</Text></SquishyButton>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text variant="keyword">Accuracy {accuracy}%</Text>
          <Text variant="keyword">Partner Votes {partnerVotes}</Text>
        </View>
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["camera"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 10 },
});

