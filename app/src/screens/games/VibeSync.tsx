import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function VibeSync({ navigation }: any) {
  const [myVibe, setMyVibe] = useState(50);
  const [step, setStep] = useState(1); // 1: Set, 2: Guess/Wait (simulated), 3: Reveal
  const [partnerVibe, setPartnerVibe] = useState(0);

  function lockVibe() {
    // Simulate partner value
    const sim = Math.floor(Math.random() * 100);
    setPartnerVibe(sim);
    setStep(3);
  }

  const diff = Math.abs(myVibe - partnerVibe);
  let msg = "";
  if (diff < 5) msg = "Psychic Match! (+25 XP)";
  else if (diff < 15) msg = "In Sync! (+15 XP)";
  else msg = "Vibe Mismatch. Talk it out.";

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.header}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Typography variant="button">Back</Typography>
        </SquishyButton>
        <Typography variant="h1">Vibe Sync</Typography>
      </View>

      <GlassCard style={styles.card}>
        <Typography variant="h2" center>
          {step === 3 ? "Results" : "Set Your Emotional Battery"}
        </Typography>

        <View style={styles.sliderContainer}>
          <Typography variant="h1" style={styles.value}>{myVibe}%</Typography>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={myVibe}
            onValueChange={setMyVibe}
            minimumTrackTintColor={COLORS.emotionalConnection}
            maximumTrackTintColor={COLORS.textPrimary}
            disabled={step === 3}
          />
          <View style={styles.labels}>
            <Typography variant="body">Drained</Typography>
            <Typography variant="body">Charged</Typography>
          </View>
        </View>

        {step === 3 && (
           <View style={{ marginTop: SPACING.xlarge, alignItems: 'center', gap: SPACING.regular }}>
             <Typography variant="body">Partner's Vibe (Simulated)</Typography>
             <Typography variant="h1" style={{ color: COLORS.brightYellow }}>{partnerVibe}%</Typography>
             <Typography variant="h2" center style={{ color: COLORS.success }}>{msg}</Typography>
           </View>
        )}

        {step !== 3 && (
          <SquishyButton onPress={lockVibe} style={styles.btn}>
            <Typography variant="button">Lock In</Typography>
          </SquishyButton>
        )}

        {step === 3 && (
           <SquishyButton onPress={() => setStep(1)} style={[styles.btn, { marginTop: SPACING.xlarge }]}>
             <Typography variant="button">Play Again</Typography>
           </SquishyButton>
        )}

      </GlassCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.button 
  },
  card: { 
    padding: SPACING.xxlarge, 
    gap: SPACING.regular 
  },
  sliderContainer: { 
    alignItems: 'center', 
    gap: SPACING.regular, 
    paddingVertical: SPACING.xlarge 
  },
  value: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 1.5, 
    color: COLORS.emotionalConnection 
  },
  labels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  btn: { 
    backgroundColor: COLORS.emotionalConnection, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  }
});
