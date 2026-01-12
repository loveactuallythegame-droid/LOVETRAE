import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const HARSH_STARTUPS = [
    "You never listen to me!",
    "Why is the kitchen always a mess?",
    "You care more about your phone than me.",
    "You're always late.",
    "You never help with the kids."
];

export default function GentleStartUpGauntlet({ route, navigation }: any) {
  const { gameId } = route.params;
  const [input, setInput] = useState('');
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) {
        const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
        if (couple.data?.couple_code) {
          const session = await createGameSession(gameId, user.id, couple.data.couple_code);
          sessionId.current = session.id;
        }
      }
    });
  }, [gameId]);

  function checkRewrite() {
    const lower = input.toLowerCase();
    const hasIFeel = lower.includes('i feel');
    const hasAbout = lower.includes('about') || lower.includes('when');
    const hasINeed = lower.includes('i need') || lower.includes('i want') || lower.includes('would you');

    if (hasIFeel && hasAbout && hasINeed) {
        HapticFeedbackSystem.success();
        speakMarcie("Ooh, smooth. I almost felt that myself.");
        if (index < HARSH_STARTUPS.length - 1) {
            setIndex(i => i + 1);
            setInput('');
        } else {
            finish();
        }
    } else {
        HapticFeedbackSystem.warning();
        if (!hasIFeel) speakMarcie("Start with 'I feel'. Don't make me come over there.");
        else if (!hasAbout) speakMarcie("What is this about? Be specific. 'About...' or 'When...'");
        else if (!hasINeed) speakMarcie("And what do you need? Don't leave them guessing.");
        setAttempts(a => a + 1);
    }
  }

  async function finish() {
    const xp = Math.max(100, 300 - (attempts * 10));
    if (sessionId.current) {
        await updateGameSession(sessionId.current, {
            finished_at: new Date().toISOString(),
            score: 100,
            state: JSON.stringify({ attempts, xp })
        });
    }
    Alert.alert("Gauntlet Survived", `You earned ${xp} XP!`, [
        { text: "Victory", onPress: () => navigation.goBack() }
    ]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Rewrite this Harsh Start-Up</Text>
        <Text variant="sass" style={styles.harsh}>"{HARSH_STARTUPS[index]}"</Text>
        <Text variant="body" style={{marginTop: 8}}>Use: "I feel... about... I need..."</Text>
        <TextInput
            style={styles.input}
            placeholder="I feel..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            multiline
        />
        <SquishyButton onPress={checkRewrite} style={styles.submitBtn}>
            <Text variant="header">Check Tone</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Gentle Start-Up Gauntlet',
    description: 'Rewrite harsh startups into gentle ones',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: index,
    totalTime: 120,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  harsh: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 12,
    color: '#FA1F63'
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#E4E831',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
