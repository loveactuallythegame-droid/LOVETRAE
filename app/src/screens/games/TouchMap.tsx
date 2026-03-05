import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

type Zone = 'Head' | 'Chest' | 'Hands' | 'Legs' | 'Back';
const ZONES: Zone[] = ['Head', 'Chest', 'Hands', 'Legs', 'Back'];

const ZONE_COLORS = {
  white: COLORS.textPrimary,
  green: COLORS.success,
  yellow: COLORS.warning,
  red: COLORS.error,
};

export default function TouchMap({ navigation }: any) {
  const [colors, setColors] = useState<Record<Zone, string>>({
    Head: ZONE_COLORS.white, 
    Chest: ZONE_COLORS.white, 
    Hands: ZONE_COLORS.white, 
    Legs: ZONE_COLORS.white, 
    Back: ZONE_COLORS.white
  });

  function cycleColor(z: Zone) {
    const current = colors[z];
    let next = ZONE_COLORS.white;
    if (current === ZONE_COLORS.white) next = ZONE_COLORS.green;
    else if (current === ZONE_COLORS.green) next = ZONE_COLORS.yellow;
    else if (current === ZONE_COLORS.yellow) next = ZONE_COLORS.red;
    else next = ZONE_COLORS.white;

    setColors({ ...colors, [z]: next });
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
              <Typography variant="body">Back</Typography>
            </SquishyButton>
            <Typography variant="h1">The Touch Map: Lite</Typography>
          </View>

          <GlassCard style={styles.card}>
            <Typography variant="body" center style={{ marginBottom: SPACING.xlarge }}>
              Tap zones to set comfort level.
            </Typography>
            <View style={styles.legend}>
              <Typography variant="caption" color={ZONE_COLORS.green}>Green: Yes</Typography>
              <Typography variant="caption" color={ZONE_COLORS.yellow}>Yellow: Ask</Typography>
              <Typography variant="caption" color={ZONE_COLORS.red}>Red: No</Typography>
            </View>

            <View style={styles.bodyMap}>
              {ZONES.map((z) => (
                <Pressable key={z} onPress={() => cycleColor(z)} style={[styles.zone, { backgroundColor: colors[z] }]}>
                  <Typography variant="button" style={styles.zoneText}>{z}</Typography>
                </Pressable>
              ))}
            </View>

            <SquishyButton style={[styles.btn, { marginTop: SPACING.xxlarge }]}>
               <Typography variant="h2" color={COLORS.textPrimary}>Sync with Partner</Typography>
            </SquishyButton>

            <Typography variant="sass" center style={{ marginTop: SPACING.xxlarge }}>
               "They marked 'Chest' yellow... you green. Wanna unpack that?"
            </Typography>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
  },
  card: { 
    padding: SPACING.cardPadding, 
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  legend: { 
    flexDirection: 'row', 
    gap: SPACING.xlarge, 
    marginBottom: SPACING.xxlarge 
  },
  bodyMap: { 
    width: '100%', 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  zone: { 
    width: 100, 
    height: 60, 
    borderRadius: BORDER_RADIUS.round, 
    justifyContent: 'center', 
    alignItems: 'center', 
    opacity: 0.8 
  },
  zoneText: { 
    color: COLORS.backgroundPrimary,
  },
  btn: { 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center', 
    width: '100%',
  },
});
