import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { encryptSensitive } from '../../lib/encryption';
import { speakMarcie } from '../../lib/voice-engine';

function isToxic(s: string) {
  const lower = s.toLowerCase();
  return /(you always|you never|you make me|you should|why can't you)/.test(lower);
}

function suggestRewrite(s: string) {
  const lower = s.toLowerCase();
  return lower.replace(/you always|you never|you make me|you should|why can't you/gi, 'I feel').replace(/you /gi, 'I ').replace(/always|never/gi, '').trim();
}

export default function DefensivenessDetox({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'defensiveness-detox' };
  const [text, setText] = useState('');
  const [rewrite, setRewrite] = useState('');
  const [passes, setPasses] = useState(false);
  const [attempts, setAttempts] = useState(0);
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

  useEffect(() => {
    const toxic = isToxic(text);
    setRewrite(toxic ? suggestRewrite(text) : text);
    setPasses(!toxic && !!text.trim());
  }, [text]);

  function submit() {
    setAttempts((a) => a + 1);
    if (!passes) {
      HapticFeedbackSystem.warning();
      speakMarcie("Let me guess - you were about to say 'You always ignore me' again.");
    } else {
      HapticFeedbackSystem.success();
      speakMarcie('That reads accountable. Keep going.');
    }
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Rewrite defensive statements into 'I feel' language</Text>
        <TextInput placeholder="Type here" style={styles.input} value={text} onChangeText={setText} />
        <Text variant="keyword">Rewrite</Text>
        <TextInput placeholder="Rewrite" style={styles.input} value={rewrite} onChangeText={setRewrite} />
        <SquishyButton style={styles.btn} onPress={submit}><Text variant="header">Check</Text></SquishyButton>
        {!passes && <Text variant="sass">Rewrite until it passes Marcie's filter</Text>}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Defensiveness Detox',
    description: 'Block toxic phrasing and rewrite to ownership',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 90,
    currentStep: attempts,
    totalTime: 60,
    playerData: { vulnerabilityScore: passes ? 80 : 40, honestyScore: passes ? 80 : 40, completionTime: attempts * 5, partnerSync: 0 },
  }), [gameId, passes, attempts]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const efficiencyBonus = Math.min(60, Math.max(0, 60 - attempts * 10));
    const xp = Math.min(150, 90 + efficiencyBonus);
    const payload = JSON.stringify({ text, rewrite, xp, attempts });
    const enc = encryptSensitive(payload, (await supabase.auth.getSession()).data.session?.user?.id || '');
    if (sessionId.current) await updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: enc });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  btn: { alignSelf: 'flex-end', marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
});
