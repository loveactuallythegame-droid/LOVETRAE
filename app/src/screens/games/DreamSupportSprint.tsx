import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

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
    <View style={{ gap: SPACING.regular }}>
      <GlassCard>
        <Text variant="h2" center style={styles.gameTitle}>The Love Arcade</Text>
        <Text variant="h3" center style={styles.subtitle}>+100 Games to Deepen Connection</Text>
        
        <Text variant="h3" style={{ marginTop: SPACING.large }}>Dream Support</Text>
        <Text variant="body">Partner's Dream:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. Learn Guitar"
            placeholderTextColor={COLORS.textHint}
            value={dream}
            onChangeText={setDream}
        />
        <Text variant="body" style={{ marginTop: SPACING.regular }}>Your Specific Support:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will take the kids for 1hr on Saturdays"
            placeholderTextColor={COLORS.textHint}
            value={support}
            onChangeText={setSupport}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="button">Commit Support</Text>
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
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    marginBottom: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    marginTop: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: { 
    marginTop: SPACING.large,
  },
});
