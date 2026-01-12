import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function DreamSupportSprint({ route, navigation }: any) {
  const { gameId } = route.params;
  const [dream, setDream] = useState('');
  const [support, setSupport] = useState('');

  function submit() {
    if (!dream || !support) {
      speakMarcie("Fill out both fields. Dreams need scaffolding.");
      return;
    }
    speakMarcie("Solid plan. Now actually do it.");
    HapticFeedbackSystem.success();
    Alert.alert("Support Pledged", "Added to your shared calendar.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Dream Support</Text>
        <Text variant="body">Partner's Dream:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. Learn Guitar"
            placeholderTextColor="#666"
            value={dream}
            onChangeText={setDream}
        />
        <Text variant="body" style={{ marginTop: 12 }}>Your Specific Support:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will take the kids for 1hr on Saturdays"
            placeholderTextColor="#666"
            value={support}
            onChangeText={setSupport}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Commit Support</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Dream Support Sprint',
    description: 'Make dreams feasible together',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, marginTop: 8 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
