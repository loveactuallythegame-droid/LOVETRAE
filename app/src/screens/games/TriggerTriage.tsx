import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import Slider from '@react-native-community/slider';

export default function TriggerTriage({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'trigger-triage' };
  const [painLevel, setPainLevel] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [script, setScript] = useState('');
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
      }
    });
  }, [gameId]);

  useEffect(() => {
    if (painLevel >= 8 && script.length < 10) {
        speakMarcie("Your pain scale is at 8, but your communication is at 2. Let's fix that ratio.");
    }
  }, [painLevel, script]);

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Trigger Triage',
    description: 'Pain scale assessment and de-escalation',
    category: 'healing' as const,
    difficulty: 'hard' as const,
    xpReward: 85,
    currentStep: 0,
    totalTime: 120,
    playerData: { vulnerabilityScore: painLevel * 10, honestyScore: 80, completionTime: 0, partnerSync: 0 },
  }), [gameId, painLevel]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(35, script.length > 50 ? 35 : script.length * 0.5);
    const xp = Math.min(120, 85 + bonus);
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ painLevel, trigger, script, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Rate your current pain/trigger level (1-10)</Text>
        <View style={styles.sliderContainer}>
            <Text variant="header" style={{color: painLevel > 7 ? '#E11637' : '#33DEA5'}}>{painLevel}</Text>
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={painLevel}
                onValueChange={setPainLevel}
                minimumTrackTintColor={painLevel > 7 ? '#E11637' : '#33DEA5'}
                maximumTrackTintColor="#FFFFFF"
            />
        </View>
        <TextInput placeholder="What triggered this?" style={styles.input} value={trigger} onChangeText={setTrigger} />
        <Text variant="body" style={{marginTop: 16}}>De-escalation Script / Coping Strategy:</Text>
        <TextInput 
            placeholder="I feel triggered because... I need..." 
            style={[styles.input, {height: 80}]} 
            multiline 
            value={script} 
            onChangeText={setScript} 
        />
        {painLevel > 6 && (
            <View style={{marginTop: 8}}>
                <Text variant="keyword">Suggested: "I am feeling a level {painLevel} trigger. Can we pause for 20 mins?"</Text>
            </View>
        )}
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["slider", "text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  sliderContainer: { alignItems: 'center', marginVertical: 16 },
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
});
