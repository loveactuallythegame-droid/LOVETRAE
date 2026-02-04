import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { useAppStore } from '../../state/store';

export default function SettingsScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useAppStore((state) => [state.highContrast, state.setHighContrast]);
  const [reducedMotion, setReducedMotion] = useAppStore((state) => [state.reducedMotion, state.setReducedMotion]);
  const [themeSetting, setThemeSetting] = useAppStore((state) => [state.theme, state.setTheme]);
  const [animationSpeed, setAnimationSpeed] = useAppStore((state) => [state.animationSpeed, state.setAnimationSpeed]);
  const [fontScale, setFontScale] = useAppStore((state) => [state.fontScale, state.setFontScale]);
  const [sarcasmLevel, setSarcasmLevel] = useAppStore((state) => [state.sarcasmLevel, state.setSarcasm]);
  const [previewRole, setPreviewRole] = useAppStore((state) => [state.previewRole, state.setPreviewRole]);

  const themeOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'noir', label: 'Noir' },
  ];

  const sarcasmLevels = [
    { value: 1, label: 'Tough Love Rookie' },
    { value: 2, label: 'Reality Check Specialist' },
    { value: 3, label: 'Radical Truth Wizard' },
    { value: 4, label: 'The Glamour Oracle' },
  ];

  const handleLogout = () => {
    // Handle logout logic
    navigation.navigate('LoginAndSignUp');
  };

  return (
    <LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="header" style={styles.title}>Settings</Text>
          <Text variant="body" style={styles.subtitle}>Customize your experience</Text>
        </View>

        <GlassCard style={styles.settingsCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="title" style={styles.sectionTitle}>Appearance</Text>
            
            <View style={styles.settingItem}>
              <Text variant="body" style={styles.settingLabel}>Theme</Text>
              <View style={styles.pickerContainer}>
                {themeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.pickerOption,
                      themeSetting === option.value && styles.selectedPickerOption
                    ]}
                    onPress={() => setThemeSetting(option.value as any)}
                  >
                    <LinearGradient
                      colors={
                        themeSetting === option.value
                          ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                          : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.pickerGradient}
                    >
                      <Text
                        variant="small"
                        style={{
                          color:
                            themeSetting === option.value
                              ? theme.COLORS.background
                              : theme.COLORS.textSecondary
                        }}
                      >
                        {option.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text variant="body" style={styles.settingLabel}>High Contrast</Text>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: theme.COLORS.textHint, true: theme.COLORS.success }}
                thumbColor={highContrast ? theme.COLORS.background : theme.COLORS.textSecondary}
              />
            </View>

            <View style={styles.settingItem}>
              <Text variant="body" style={styles.settingLabel}>Reduce Motion</Text>
              <Switch
                value={reducedMotion}
                onValueChange={setReducedMotion}
                trackColor={{ false: theme.COLORS.textHint, true: theme.COLORS.accentTeal }}
                thumbColor={reducedMotion ? theme.COLORS.background : theme.COLORS.textSecondary}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text variant="body" style={styles.settingLabel}>Animation Speed</Text>
              <View style={styles.sliderRow}>
                <Text variant="small" style={styles.sliderValue}>Slow</Text>
                <View style={styles.slider}>
                  <TouchableOpacity
                    style={[
                      styles.sliderThumb,
                      { left: `${(animationSpeed - 0.5) * 100}%` }
                    ]}
                    onPress={() => setAnimationSpeed(animationSpeed === 2 ? 0.5 : animationSpeed + 0.5)}
                  />
                  <View style={styles.sliderTrack} />
                </View>
                <Text variant="small" style={styles.sliderValue}>Fast</Text>
              </View>
            </View>

            <View style={styles.sliderContainer}>
              <Text variant="body" style={styles.settingLabel}>Font Size</Text>
              <View style={styles.sliderRow}>
                <Text variant="small" style={styles.sliderValue}>Small</Text>
                <View style={styles.slider}>
                  <TouchableOpacity
                    style={[
                      styles.sliderThumb,
                      { left: `${(fontScale - 0.8) * 100}%` }
                    ]}
                    onPress={() => setFontScale(fontScale === 1.3 ? 0.8 : fontScale + 0.1)}
                  />
                  <View style={styles.sliderTrack} />
                </View>
                <Text variant="small" style={styles.sliderValue}>Large</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        <GlassCard style={styles.settingsCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="title" style={styles.sectionTitle}>Dr. Marcie Settings</Text>
            
            <View style={styles.settingItem}>
              <Text variant="body" style={styles.settingLabel}>Sarcasm Level</Text>
              <View style={styles.pickerContainer}>
                {sarcasmLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.pickerOption,
                      sarcasmLevel === level.value && styles.selectedPickerOption
                    ]}
                    onPress={() => setSarcasmLevel(level.value)}
                  >
                    <LinearGradient
                      colors={
                        sarcasmLevel === level.value
                          ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                          : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.pickerGradient}
                    >
                      <Text
                        variant="small"
                        style={{
                          color:
                            sarcasmLevel === level.value
                              ? theme.COLORS.background
                              : theme.COLORS.textSecondary
                        }}
                      >
                        {level.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        <GlassCard style={styles.settingsCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="title" style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <LinearGradient
                colors={[theme.COLORS.warning, theme.COLORS.error]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text variant="header" style={styles.buttonText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.SPACING.lg,
    paddingBottom: theme.SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  title: {
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.sm,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    color: theme.COLORS.textSecondary,
  },
  settingsCard: {
    marginBottom: theme.SPACING.lg,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  sectionTitle: {
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    color: theme.COLORS.textPrimary,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: theme.SPACING.sm,
  },
  pickerOption: {
    borderRadius: theme.SIZES.borderRadius,
    overflow: 'hidden',
  },
  selectedPickerOption: {
    borderWidth: 1,
    borderColor: theme.COLORS.success,
  },
  pickerGradient: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    borderRadius: theme.SIZES.borderRadius,
  },
  sliderContainer: {
    paddingVertical: theme.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.SPACING.sm,
  },
  sliderValue: {
    color: theme.COLORS.textSecondary,
    width: 50,
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    position: 'relative',
    marginHorizontal: theme.SPACING.md,
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.COLORS.primaryGradientStart,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.COLORS.primaryGradientEnd,
    top: -8,
    transform: [{ translateX: -10 }],
    zIndex: 1,
  },
  button: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    marginTop: theme.SPACING.md,
  },
  buttonGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  buttonText: {
    color: theme.COLORS.background,
    textAlign: 'center',
  },
});