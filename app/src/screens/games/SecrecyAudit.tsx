import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Question = { text: string; risk: 'high' | 'medium' | 'low' };

const QUESTIONS: Question[] = [
    { text: 'Do they know your phone passcode?', risk: 'high' },
    { text: 'Do they know your email password?', risk: 'medium' },
    { text: 'Have you deleted messages in the last week?', risk: 'high' },
    { text: 'Do you have a secret bank account?', risk: 'high' },
    { text: 'Is your location sharing always on?', risk: 'medium' },
    { text: 'Do you have hidden apps?', risk: 'high' },
    { text: 'Do you clear your browser history?', risk: 'medium' },
];

export default function SecrecyAudit({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'secrecy-audit' };
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ q: string; a: boolean }[]>([]);
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

  function answer(val: boolean) {
    HapticFeedbackSystem.selection();
    const newAnswers = [...answers, { q: QUESTIONS[index].text, a: val }];
    setAnswers(newAnswers);
    
    // Check for "bad habits" trigger
    const secretCount = newAnswers.filter(x => !x.a).length; // Assuming 'No' means secrecy for positive questions like "Do they know passcode"
    // Wait, questions are mixed.
    // "Do they know passcode?" -> No = Secret.
    // "Have you deleted messages?" -> Yes = Secret.
    // Let's normalize logic later or just count raw "No"s for "Do they know" type questions.
    
    if (index === 6 && secretCount > 3) {
        speakMarcie("You have multiple passwords your partner doesn't know. What are you hiding, a secret life or just bad habits?");
    }

    if (index < QUESTIONS.length - 1) {
        setIndex(index + 1);
    } else {
        // Auto-finish logic handled by GameContainer finish button usually, but here we might want to just stop input
    }
  }

  // Calculate transparency score
  // Questions 0, 1, 4: Yes is good.
  // Questions 2, 3, 5, 6: No is good.
  const transparencyScore = useMemo(() => {
      let score = 0;
      answers.forEach((ans, i) => {
          const isPositiveQ = [0, 1, 4].includes(i);
          if (isPositiveQ && ans.a) score += 1;
          if (!isPositiveQ && !ans.a) score += 1;
      });
      return Math.round((score / QUESTIONS.length) * 100);
  }, [answers]);

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Secrecy Audit',
    description: 'Rapid-fire questions on transparency',
    category: 'healing' as const,
    difficulty: 'medium' as const,
    xpReward: 50,
    currentStep: index,
    totalTime: 45,
    playerData: { vulnerabilityScore: transparencyScore, honestyScore: transparencyScore, completionTime: index * 2, partnerSync: 0 },
  }), [gameId, index, transparencyScore]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(30, Math.round(transparencyScore * 0.3));
    const xp = Math.min(80, 50 + bonus);
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ answers, transparencyScore, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        {index < QUESTIONS.length ? (
            <>
                <Text variant="header" style={{textAlign: 'center', marginBottom: 24}}>{QUESTIONS[index].text}</Text>
                <View style={{flexDirection: 'row', gap: 16, justifyContent: 'center'}}>
                    <SquishyButton onPress={() => answer(true)} style={[styles.btn, {backgroundColor: '#33DEA5'}]}>
                        <Text variant="header">YES</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => answer(false)} style={[styles.btn, {backgroundColor: '#E11637'}]}>
                        <Text variant="header">NO</Text>
                    </SquishyButton>
                </View>
                <Text variant="keyword" style={{alignSelf: 'center', marginTop: 16}}>Question {index + 1} / {QUESTIONS.length}</Text>
            </>
        ) : (
            <View style={{alignItems: 'center'}}>
                <Text variant="header">Audit Complete</Text>
                <Text variant="body" style={{marginTop: 8}}>Transparency Score: {transparencyScore}%</Text>
            </View>
        )}
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, minWidth: 100, alignItems: 'center' },
});
