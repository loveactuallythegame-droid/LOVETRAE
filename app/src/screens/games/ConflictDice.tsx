import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { supabase, createGameSession, updateGameSession } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

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
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Practice conflict resolution with random scenarios! Constraints make communication more creative.</Text>
          </View>
        </View>

        {!rolled ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text variant="header" style={{ fontSize: 60 }}>🎲</Text>
            <SquishyButton onPress={roll} style={styles.rollBtn}>
              <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text variant="header" style={{ color: '#ffffff' }}>Roll Dice</Text>
              </LinearGradient>
            </SquishyButton>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <View>
              <Text variant="body">Scenario:</Text>
              <Text variant="header" style={{ color: '#db147c' }}>{scenario}</Text>
            </View>
            <View>
              <Text variant="body">Constraint:</Text>
              <Text variant="header" style={{ color: '#37cf97' }}>{constraint}</Text>
            </View>
            <SquishyButton onPress={finish} style={styles.doneBtn}>
              <LinearGradient
                colors={['#37cf97', '#b37dec']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text variant="header" style={{ color: '#ffffff' }}>We Did It</Text>
              </LinearGradient>
            </SquishyButton>
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
  rollBtn: { 
    marginTop: 20, 
    padding: 16, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  doneBtn: { 
    marginTop: 20, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  }
});
