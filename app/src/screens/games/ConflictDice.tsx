import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

const SCENARIOS = ["Argue about thermostat", "Who does dishes?", "In-laws visiting", "Money stress"];
const CONSTRAINTS = ["No 'You' statements", "Whisper only", "Hold hands", "Rhyme every sentence"];

export default function ConflictDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [scenario, setScenario] = useState<string | null>(null);
  const [constraint, setConstraint] = useState<string | null>(null);
  const [rolled, setRolled] = useState(false);

  function roll() {
    setRolled(true);
    setScenario(SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]);
    setConstraint(CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)]);
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Rolling... Good luck with this combo.");
  }

  function finish() {
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

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  rollBtn: { marginTop: 20, backgroundColor: '#5C1459', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  doneBtn: { marginTop: 20, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
