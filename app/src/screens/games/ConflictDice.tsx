import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { supabase, createGameSession, updateGameSession } from '../../lib/supabase';

const SCENARIOS = ["Argue about thermostat", "Who does dishes?", "In-laws visiting", "Money stress"];
const CONSTRAINTS = ["No 'You' statements", "Whisper only", "Hold hands", "Rhyme every sentence"];

export default function ConflictDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [scenario, setScenario] = useState<string | null>(null);
  const [constraint, setConstraint] = useState<string | null>(null);
  const [rolled, setRolled] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      if (user) {
        const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
        if (couple.data?.couple_code) {
          const session = await createGameSession(gameId, user.id, couple.data.couple_code);
          setSessionId(session.id);
        }
      }
    });
  }, [gameId]);

  async function roll() {
    setRolled(true);
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const c = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setScenario(s);
    setConstraint(c);
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Rolling... Good luck with this combo.");

    if (sessionId) {
      // In a real implementation, we'd sync the random seed or result to the partner
      // via updateGameSession(sessionId, { state: JSON.stringify({ scenario: s, constraint: c }) })
      // For now, at least state update works
    }
  }

  async function finish() {
    if (sessionId) {
      await updateGameSession(sessionId, { finished_at: new Date().toISOString(), score: 100 });
    }
    Alert.alert("Scenario Complete", "Did you survive?", [{ text: "Yes", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {!rolled ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text variant="header" style={{ fontSize: 60 }}>🎲</Text>
            <SquishyButton onPress={roll} style={styles.rollBtn}><Text variant="header">Roll Dice</Text></SquishyButton>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <View>
              <Text variant="body">Scenario:</Text>
              <Text variant="header" style={{ color: '#FA1F63' }}>{scenario}</Text>
            </View>
            <View>
              <Text variant="body">Constraint:</Text>
              <Text variant="header" style={{ color: '#33DEA5' }}>{constraint}</Text>
            </View>
            <SquishyButton onPress={finish} style={styles.doneBtn}><Text variant="header">We Did It</Text></SquishyButton>
          </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Conflict Dice',
    description: 'Randomized conflict practice',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
  rollBtn: { marginTop: 20, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  doneBtn: { marginTop: 20, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
