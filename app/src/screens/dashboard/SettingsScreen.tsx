import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from '../../components/ui'; // Assuming a custom Text component
import { LinearGradient } from 'expo-linear-gradient';

// Assuming a simplified theme structure for this example
const theme = {
  COLORS: {
    background: '#2A002A',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1C4E9',
    primaryGradientStart: '#FF4081',
    primaryGradientEnd: '#E040FB',
    // ... other colors
  },
  SPACING: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  // ... other theme properties
};

export default function SettingsScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [themeSetting, setThemeSetting] = useState('dark');

  const handleLogout = () => {
    navigation.navigate('LoginAndSignUp');
  };

  return (
    <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SETTINGS</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.pickerContainer}>
              {['Dark', 'Light', 'Noir'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.pickerOption,
                    themeSetting === option.toLowerCase() && styles.selectedPickerOption,
                  ]}
                  onPress={() => setThemeSetting(option.toLowerCase())}
                >
                  <Text style={styles.pickerText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>High Contrast</Text>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#767577', true: '#FF4081' }}
              thumbColor={highContrast ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Reduce Motion</Text>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: '#767577', true: '#FF4081' }}
              thumbColor={reducedMotion ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>DR. MARCIE SETTINGS</Text>
          {/* Add Dr. Marcie settings here */}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <LinearGradient
              colors={['#FF4081', '#E040FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>LOG OUT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.textPrimary,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.5)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.md,
    textTransform: 'uppercase',
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
    fontSize: 16,
    color: theme.COLORS.textPrimary,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: theme.SPACING.sm,
  },
  pickerOption: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedPickerOption: {
    backgroundColor: '#FF4081',
  },
  pickerText: {
    color: theme.COLORS.textPrimary,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: theme.SPACING.md,
  },
  buttonGradient: {
    padding: theme.SPACING.md,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});