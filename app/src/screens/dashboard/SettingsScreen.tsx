import { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function SettingsScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [themeSetting, setThemeSetting] = useState('dark');

  const handleLogout = () => {
    navigation.navigate('LoginAndSignUp');
  };

  return (
    <ScreenLayout showHeader={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="header" style={styles.title}>SETTINGS</Typography>
          <Typography variant="body" style={styles.subtitle}>Customize your experience</Typography>
        </View>

        <GlassCard>
          <Typography variant="label" style={styles.sectionTitle}>APPEARANCE</Typography>
          <View style={styles.settingItem}>
            <Typography variant="body">Theme</Typography>
            <View style={styles.pickerContainer}>
              {['Dark', 'Light', 'Noir'].map((option) => (
                <SquishyButton
                  key={option}
                  onPress={() => setThemeSetting(option.toLowerCase())}
                  variant={themeSetting === option.toLowerCase() ? 'primary' : 'ghost'}
                  size="small"
                >
                  <Typography variant="caption" style={themeSetting === option.toLowerCase() ? styles.selectedPickerText : {}}>
                    {option}
                  </Typography>
                </SquishyButton>
              ))}
            </View>
          </View>
          <View style={styles.settingItem}>
            <Typography variant="body">High Contrast</Typography>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: COLORS.backgroundInput, true: COLORS.vibrantPink }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
          <View style={styles.settingItem}>
            <Typography variant="body">Reduce Motion</Typography>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: COLORS.backgroundInput, true: COLORS.vibrantPink }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
        </GlassCard>

        <GlassCard>
          <Typography variant="label" style={styles.sectionTitle}>DR. MARCIE SETTINGS</Typography>
          <Typography variant="body" style={{ color: COLORS.textSecondary }}>
            Configure Dr. Marcie's appearance and behavior
          </Typography>
        </GlassCard>

        <GlassCard>
          <Typography variant="label" style={styles.sectionTitle}>ACCOUNT</Typography>
          <SquishyButton onPress={handleLogout}>
            <Typography variant="button">LOG OUT</Typography>
          </SquishyButton>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  title: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    marginBottom: SPACING.regular,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  selectedPickerText: {
    color: COLORS.textPrimary,
  },
});
