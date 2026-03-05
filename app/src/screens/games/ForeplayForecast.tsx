import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function ForeplayForecast({ navigation }: any) {
  useEffect(() => {
    speakMarcie("Hit 82 with eye contact + hair tuck? Someone's been studying.");
  }, []);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1" style={styles.title}>Foreplay Forecast</Typography>
        </View>

        <GlassCard style={styles.card}>
          <Typography variant="instructions" style={{ marginBottom: SPACING.small }}>Type: Live mood slider</Typography>
          <Typography variant="body">Mechanics: A sets arousal bar (0–100). B performs non-sexual acts (compliment, neck rub) to raise it.</Typography>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Typography variant="instructions" style={{ marginBottom: SPACING.small }}>Scoring</Typography>
          <Typography variant="body">
            ✅ +20 points in 5 mins = +30{'\n'}
            ✅ A names what helped = +10
          </Typography>
        </GlassCard>

        <View style={styles.actionArea}>
          <SquishyButton onPress={() => alert('Opening Slider...')} style={styles.playBtn}>
            <Typography variant="body">Start Forecast</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.screenPadding, gap: SPACING.regular },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.small, marginTop: SPACING.large },
  backBtn: { paddingHorizontal: SPACING.regular, paddingVertical: SPACING.small },
  title: { fontSize: TYPOGRAPHY.fontSize.headerLarge, color: COLORS.textPrimary, flex: 1 },
  card: { padding: SPACING.cardPadding },
  actionArea: { marginTop: SPACING.xlarge, alignItems: 'center' },
  playBtn: { width: '80%', paddingVertical: SPACING.regular }
});
