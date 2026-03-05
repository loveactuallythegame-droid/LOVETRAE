import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Text, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

export default function CompromiseJenga({ route, navigation }: any) {
  const { gameId } = route.params;
  const [blocks, setBlocks] = useState<string[]>([]);
  const [offer, setOffer] = useState('');

  function addBlock() {
    if (!offer) return;
    setBlocks(b => [...b, offer]);
    setOffer('');
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Block added. Careful, don't let it wobble.");
  }

  function finish() {
    if (blocks.length < 3) {
      speakMarcie("That's not a tower, that's a pile of rubble. Need more compromises.");
      return;
    }
    Alert.alert("Tower Built", `Height: ${blocks.length} compromises.`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: SPACING.regular }}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text variant="sass">Build a compromise tower! Stack concessions to create a stable solution together.</Text>
          </View>
        </View>

        <Text variant="h2">Compromise Tower</Text>
        <View style={styles.tower}>
            {blocks.map((b, i) => (
                <LinearGradient
                    key={i}
                    colors={i % 2 === 0 ? GRADIENTS.primary.colors : [COLORS.mintGreen, COLORS.softViolet]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.block}
                >
                    <Text variant="body" style={{ color: COLORS.textPrimary, textAlign: 'center' }}>{b}</Text>
                </LinearGradient>
            ))}
            {blocks.length === 0 && <Text variant="body" style={{ textAlign: 'center', opacity: 0.5 }}>No blocks yet</Text>}
        </View>
        <Text variant="body">Add a concession:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will cook on Mon/Wed"
            placeholderTextColor={COLORS.textHint}
            value={offer}
            onChangeText={setOffer}
        />
        <SquishyButton onPress={addBlock} style={styles.btn}>
            <LinearGradient
                colors={[COLORS.brightYellow, COLORS.warmOrange]}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.gradientButton}
            >
                <Text variant="h2" style={{ color: COLORS.deepCosmic }}>Stack Block</Text>
            </LinearGradient>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.done}>
            <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.gradientButton}
            >
                <Text variant="h2" style={{ color: COLORS.textPrimary }}>Finish Tower</Text>
            </LinearGradient>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Compromise Jenga',
    description: 'Build a stable solution together',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  tower: { minHeight: 100, justifyContent: 'flex-end', gap: SPACING.tiny, marginBottom: SPACING.regular },
  block: { 
    padding: SPACING.medium, 
    borderRadius: BORDER_RADIUS.small, 
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.small,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
  },
  btn: { 
    marginTop: SPACING.regular, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  done: { 
    marginTop: SPACING.regular, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: SPACING.regular,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xxlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover',
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
});
