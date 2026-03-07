import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function FlashbackFrenzy({ navigation }: any) {
  const [emotion, setEmotion] = useState('');
  const [guess, setGuess] = useState('');
  const [step, setStep] = useState(1);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">Flashback Frenzy</Typography>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Typography variant="h1" style={styles.emojiText}>🌧️ 🪟</Typography>
            <Typography variant="body">Image: Rainy Window</Typography>
          </View>
        </GlassCard>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner A: The Feeling</Typography>
            <Typography variant="body">What emotion does this trigger?</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., Abandonment, Fear..."
              placeholderTextColor={COLORS.textHint}
              value={emotion}
              onChangeText={setEmotion}
            />
            <SquishyButton onPress={() => setStep(2)} style={styles.btn}>
              <Typography variant="body">Submit</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner B: The Guess</Typography>
            <Typography variant="body">Why does A feel that way? Guess the memory.</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., That night I didn't come home..."
              placeholderTextColor={COLORS.textHint}
              value={guess}
              onChangeText={setGuess}
            />
            <SquishyButton onPress={() => setStep(3)} style={styles.btn}>
              <Typography variant="body">Check Match</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2" color={COLORS.success} center>Match Analysis</Typography>
            <Typography variant="body">Emotion: <Typography variant="keyword">{emotion}</Typography></Typography>
            <Typography variant="body">Guess: <Typography variant="keyword">{guess}</Typography></Typography>
            <Typography variant="body" style={styles.marcieQuote}>
              Marcie: "Spot on. Listening level: 100. (+15 XP)"
            </Typography>
            <SquishyButton onPress={() => { setStep(1); setEmotion(''); setGuess(''); }} style={styles.btn}>
              <Typography variant="body">Next Image</Typography>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.screenPadding, gap: SPACING.regular },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.small },
  backBtn: { paddingHorizontal: SPACING.regular, paddingVertical: SPACING.small },
  card: { padding: SPACING.cardPadding, gap: SPACING.regular },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.bodyLarge 
  },
  btn: { marginTop: SPACING.regular },
  imagePlaceholder: { 
    height: 200, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emojiText: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
  },
  marcieQuote: { 
    marginTop: SPACING.regular, 
    fontStyle: 'italic', 
    color: COLORS.romanceHub 
  },
});
