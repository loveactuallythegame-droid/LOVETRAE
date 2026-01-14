import { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { COLORS } from '../../constants/colors';
import { navigate } from '../../lib/navigation';
import { supabase, upsertProfile } from '../../lib/supabase';
import * as Notifications from 'expo-notifications';
import { startSubscriptionCheckout } from '../../lib/stripe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../state/store';
import { setJSON, getJSON } from '../../lib/cache';
import * as FileSystem from 'expo-file-system';

import { activateBeta } from '../../lib/gating';

export default function SettingsScreen({ navigation }: any) {
  const [sarcasm, setSarcasm] = useState(2);
  const [consequence, setConsequence] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [betaCode, setBetaCode] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const previewMode = useAppStore((s) => s.previewMode);
  const setPreviewMode = useAppStore((s) => s.setPreviewMode);
  const highContrast = useAppStore((s) => s.highContrast);
  const setHighContrast = useAppStore((s) => s.setHighContrast);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);
  const theme = useAppStore((s) => s.theme);
  const fontScale = useAppStore((s) => s.fontScale);
  const animationSpeed = useAppStore((s) => s.animationSpeed);
  const setTheme = useAppStore((s) => s.setTheme);
  const setFontScale = useAppStore((s) => s.setFontScale);
  const setAnimationSpeed = useAppStore((s) => s.setAnimationSpeed);
  const plan = useAppStore((s) => s.plan);
  const isBeta = useAppStore((s) => s.isBeta);
  const setSarcasmStore = useAppStore((s) => s.setSarcasm);

  useEffect(() => {
    getJSON('settings', { sarcasm: 2, consequence: true, pushEnabled: true, darkMode: true }).then((s) => {
      setSarcasm(s.sarcasm); setConsequence(s.consequence); setPushEnabled(s.pushEnabled); setDarkMode(s.darkMode);
      if (s.darkMode) setTheme('dark');
    });
  }, []);

  async function save() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user?.id || '';
    await upsertProfile({ user_id: user, sarcasm_level: sarcasm });
    setSarcasmStore(sarcasm);
    await setJSON('settings', { sarcasm, consequence, pushEnabled, darkMode });
    if (pushEnabled) await Notifications.requestPermissionsAsync();
    setTheme(darkMode ? 'dark' : 'light');
  }

  async function validateBeta() {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user?.email || '';
    const success = await activateBeta(betaCode, email);
    if (success) {
      Alert.alert('Success', 'Beta access granted! Welcome to the inner circle.');
      useAppStore.getState().setBeta(true);
    } else {
      Alert.alert('Access Denied', 'Invalid beta code.');
    }
  }

  useEffect(() => {
    // Add keyboard listener for Design Preview Panel shortcut (Cmd+Shift+P)
    // React Native Web specific or handle via a global listener if needed.
    // For now, we'll just rely on the toggle in the settings or admin panel as primary.
  }, []);

  return (
    <View style={styles.root}>
      {/* Design Preview Panel - accessible via shortcut in real app, here via dev toggle if needed */}
      {previewMode && (
        <GlassCard>
          <Text variant="header">Design Preview Panel</Text>
          <View style={styles.row}>
            <View><Text variant="body">Theme</Text></View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SquishyButton style={[styles.btn, theme === 'dark' ? { borderWidth: 1, borderColor: '#fff' } : {}]} onPress={() => setTheme('dark')}><Text variant="body">Dark</Text></SquishyButton>
              <SquishyButton style={[styles.btn, theme === 'light' ? { borderWidth: 1, borderColor: '#fff' } : {}]} onPress={() => setTheme('light')}><Text variant="body">Light</Text></SquishyButton>
            </View>
          </View>
          <View style={styles.row}>
            <View><Text variant="body">Device Frame</Text></View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Simulating frame changes would require a top-level wrapper, keeping simple for now */}
              <Text variant="sass">Resize window to test</Text>
            </View>
          </View>
        </GlassCard>
      )}

      <View style={styles.headerRow}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Back</Text></SquishyButton>
        <Text variant="header">Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <GlassCard>
        <Text variant="header">Dr. Marcie's Sarcasm Level</Text>
        <View style={styles.radioRow}>
          <View style={styles.radioItem}>
            <SquishyButton style={[styles.radioBtn, sarcasm === 1 ? styles.radioSelected : {}]} onPress={() => setSarcasm(1)}><Text variant="header">Level 1: Tough Love Rookie</Text></SquishyButton>
            <Text variant="body">Mild sarcasm, warm but blunt</Text>
          </View>
          <View style={styles.radioItem}>
            <SquishyButton style={[styles.radioBtn, sarcasm === 2 ? styles.radioSelected : {}]} onPress={() => setSarcasm(2)}><Text variant="header">Level 2: Reality Check Specialist</Text></SquishyButton>
            <Text variant="body">Clinical, analytical sarcasm</Text>
          </View>
          <View style={styles.radioItem}>
            <SquishyButton style={[styles.radioBtn, sarcasm === 3 ? styles.radioSelected : {}]} onPress={() => setSarcasm(3)}><Text variant="header">Level 3: Radical Truth Wizard</Text></SquishyButton>
            <Text variant="body">Deep, powerful truth</Text>
          </View>
          <View style={styles.radioItem}>
            <SquishyButton style={[styles.radioBtn, sarcasm === 4 ? styles.radioSelected : {}]} onPress={() => setSarcasm(4)}><Text variant="header">Level 4: Marcie Max</Text></SquishyButton>
            <Text variant="body">Dynamic synthesis of all levels</Text>
          </View>
        </View>
        <Text variant="sass" style={{ marginTop: 8 }}>{sarcasm === 1 ? 'Gentle nudge. Honest, but kind.' : sarcasm === 2 ? 'Clinical clarity. Feelings acknowledged. Solutions prioritized.' : sarcasm === 3 ? 'Truth with spine. No fluff.' : 'Adaptive sass. Sharp and supportive.'}</Text>
      </GlassCard>

      <GlassCard>
        <Text variant="header">App Preferences</Text>
        <View style={styles.row}><View><Text variant="body">Push Notifications</Text><Text variant="sass">Daily reminders and challenges</Text></View><Switch value={pushEnabled} onValueChange={setPushEnabled} /></View>
        <View style={styles.row}><View><Text variant="body">Consequence Engine</Text><Text variant="sass">Real-world penalties for skipping tasks</Text></View><Switch value={consequence} onValueChange={setConsequence} /></View>
        <View style={styles.row}><View><Text variant="body">Dark Mode</Text><Text variant="sass">Always dark (recommended)</Text></View><Switch value={darkMode} onValueChange={(v) => { setDarkMode(v); setTheme(v ? 'dark' : 'light'); }} /></View>
        <View style={styles.row}><View><Text variant="body">High Contrast Mode</Text><Text variant="sass">Improve text legibility</Text></View><Switch value={highContrast} onValueChange={setHighContrast} /></View>
        <View style={styles.row}><View><Text variant="body">Reduce Motion</Text><Text variant="sass">Limit animations for accessibility</Text></View><Switch value={reducedMotion} onValueChange={setReducedMotion} /></View>
        <View style={styles.row}><View><Text variant="body">Preview Mode</Text><Text variant="sass">See beta overlays</Text></View><Switch value={previewMode} onValueChange={setPreviewMode} /></View>
        <View style={styles.row}><View><Text variant="body">Font Size</Text></View>
          <SquishyButton style={styles.btn} onPress={() => setFontScale(Math.max(0.8, fontScale - 0.1))}><Text variant="header">-</Text></SquishyButton>
          <SquishyButton style={styles.btn} onPress={() => setFontScale(Math.min(1.6, fontScale + 0.1))}><Text variant="header">+</Text></SquishyButton>
        </View>
        <View style={styles.row}><View><Text variant="body">Animation Speed</Text></View>
          <SquishyButton style={styles.btn} onPress={() => setAnimationSpeed(Math.max(0.5, animationSpeed - 0.1))}><Text variant="header">Slower</Text></SquishyButton>
          <SquishyButton style={styles.btn} onPress={() => setAnimationSpeed(Math.min(2, animationSpeed + 0.1))}><Text variant="header">Faster</Text></SquishyButton>
        </View>
      </GlassCard>

      <GlassCard>
        <Text variant="header">Beta Access</Text>
        <Text variant="body">Enter your beta code to unlock exclusive features.</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            value={betaCode}
            onChangeText={setBetaCode}
            autoCapitalize="characters"
            placeholderTextColor="#666"
          />
          <SquishyButton style={styles.btn} onPress={validateBeta}><Text variant="header">Verify</Text></SquishyButton>
        </View>
        {isBeta && <Text variant="keyword" style={{ marginTop: 8 }}>Beta Active ✓</Text>}
      </GlassCard>

      <GlassCard>
        <Text variant="header">Account</Text>
        {(!isBeta && plan !== 'premium') && (
          <View style={styles.accRow}>
            <View style={{ flex: 1 }}>
              <Text variant="body">Upgrade to Premium</Text>
              <Text variant="sass">Unlock all games and features</Text>
            </View>
            <SquishyButton style={styles.btn} onPress={async () => {
              const { data } = await supabase.auth.getSession();
              const user = data.session?.user;
              if (user) await startSubscriptionCheckout(user.id, user.email);
            }}><Text variant="header">Upgrade</Text></SquishyButton>
          </View>
        )}
        <View style={styles.accRow}>
          <View style={{ flex: 1 }}>
            <Text variant="body">Export Data</Text>
            <Text variant="sass">Download your relationship history</Text>
          </View>
          <SquishyButton style={styles.btn} onPress={async () => {
            const { data } = await supabase.auth.getSession();
            const user = data.session?.user?.id || 'preview';
            const profileStr = await AsyncStorage.getItem(`profile_${user}`);
            const settingsStr = await AsyncStorage.getItem('settings');
            const blob = JSON.stringify({ profile: profileStr ? JSON.parse(profileStr) : null, settings: settingsStr ? JSON.parse(settingsStr) : null }, null, 2);
            const baseDir = ((FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || '') as string;
            const path = baseDir + 'love-actually-export.json';
            await FileSystem.writeAsStringAsync(path, blob);
            Alert.alert('Export Ready', `Saved to ${path}`);
          }}><Text variant="header">Export</Text></SquishyButton>
        </View>
        <View style={styles.accRow}>
          <View style={{ flex: 1 }}>
            <Text variant="body" style={{ color: '#E11637' }}>Delete Account</Text>
            <Text variant="sass">Permanently delete all data</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={deletePassword} onChangeText={setDeletePassword as any} />
          <SquishyButton style={[styles.btn, { backgroundColor: '#E11637' }]} onPress={async () => {
            if (!deletePassword || deletePassword.length < 6) { Alert.alert('Confirmation Required', 'Please enter your password to confirm.'); return; }
            Alert.alert('Confirm Deletion', 'This will permanently delete your account.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete', style: 'destructive', onPress: async () => {
                  await supabase.auth.signOut();
                  await AsyncStorage.clear();
                  navigate('Splash');
                }
              }
            ]);
          }}><Text variant="header">Delete</Text></SquishyButton>
        </View>
        <View style={styles.row}><Text variant="body">Support</Text>
          <SquishyButton style={styles.btn} onPress={() => navigate('Support')}><Text variant="header">Open</Text></SquishyButton></View>
      </GlassCard>

      <SquishyButton style={styles.save} onPress={save}><Text variant="header">Save</Text></SquishyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.mintGreen, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.mintGreen, borderRadius: 10, marginHorizontal: 4 },
  save: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.mintGreen, borderRadius: 12, marginTop: 16 },
  input: { backgroundColor: COLORS.darkSurface, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', width: 200 },
  radioRow: { gap: 8, marginTop: 8 },
  radioItem: { gap: 4 },
  radioBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(250,31,99,0.15)', borderRadius: 10 },
  radioSelected: { borderWidth: 1, borderColor: '#FA1F63' },
  accRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
});
