import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ConsequenceState = {
  lastActive: number;
  romanceLockedUntil?: number;
};

export async function markActivity() {
  const state: ConsequenceState = { lastActive: Date.now() };
  await AsyncStorage.setItem('consequence_state', JSON.stringify(state));
}

export async function checkInactivityAndTrigger() {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return;
  const raw = await AsyncStorage.getItem('consequence_state');
  const now = Date.now();
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: now };
  if (now - st.lastActive > 24 * 3600 * 1000) {
    await Notifications.requestPermissionsAsync();
    for (let i = 0; i < 5; i++) {
      await Notifications.scheduleNotificationAsync({ content: { title: 'Dr. Marcie', body: 'We need to talk.' }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * (i + 1) } as any });
    }
    const until = now + 4 * 3600 * 1000;
    await AsyncStorage.setItem('consequence_state', JSON.stringify({ lastActive: st.lastActive, romanceLockedUntil: until }));
  }
}

export async function isRomanceLocked() {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return false;
  const raw = await AsyncStorage.getItem('consequence_state');
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: Date.now() };
  return !!st.romanceLockedUntil && Date.now() < st.romanceLockedUntil;
}

export async function enforceSkipPenalty(hours = 1) {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return;
  const raw = await AsyncStorage.getItem('consequence_state');
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: Date.now() };
  const until = Date.now() + hours * 3600 * 1000;
  await AsyncStorage.setItem('consequence_state', JSON.stringify({ ...st, romanceLockedUntil: until }));
  await Notifications.requestPermissionsAsync();
  await Notifications.scheduleNotificationAsync({ content: { title: 'Dr. Marcie', body: 'Skipping sets a short cooldown.' }, trigger: { seconds: 5 } as any });
}
