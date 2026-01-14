import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Text, SquishyButton, RadialGradientBackground, GlassCard } from '../../components/ui';
import { subscribeFight, supabase } from '../../lib/supabase';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../../state/store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarcieHost } from '../../components/ai-host';

type CoolDownRoomProps = {
  route: any;
  navigation: any;
};

export default function CoolDownRoom({ route, navigation }: CoolDownRoomProps) {
  const { fightId } = route.params || {};
  const breath = useSharedValue(0);
  const [remaining, setRemaining] = useState(72); // 7200 originally, shortened for testing/demo
  const timerRef = useRef<any>(null);

  useEffect(() => {
    breath.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    Notifications.requestPermissionsAsync();

    timerRef.current = setInterval(() => setRemaining((r) => r > 0 ? r - 1 : 0), 1000);

    let sub: any;
    if (fightId) {
      subscribeFight(fightId, (payload) => {
        const after = payload.new;
        if (after?.partner_b_input) {
          Notifications.scheduleNotificationAsync({ content: { title: 'Partner joined SOS', body: 'Ready for verdict.' }, trigger: null });
          navigation.replace('SOSVerdict', { fightId });
        }
      }).then((s: any) => sub = s);
      useAppStore.getState().setSOSSessionId(fightId);
    }

    return () => { clearInterval(timerRef.current); if (sub) supabase.removeChannel(sub); };
  }, [fightId]);

  useEffect(() => {
    if (remaining <= 0 && fightId) navigation.replace('SOSVerdict', { fightId, timeout: true });
  }, [remaining]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breath.value * 0.5 }],
    opacity: 0.5 + breath.value * 0.5
  }));

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <View style={styles.content}>
          <Text variant="header" style={styles.title}>Cool Down Room</Text>
          <Text variant="body" style={styles.sub}>Wait for partner & breathe</Text>

          <View style={styles.orbContainer}>
            <Animated.View style={[styles.orb, circleStyle]} />
            <View style={styles.orbCore} />
          </View>

          <Text variant="keyword" style={{ fontSize: 24, marginTop: 20 }}>{mm}:{ss}</Text>

          <GlassCard style={styles.tipCard}>
            <Ionicons name="leaf" size={24} color="#33DEA5" style={{ marginBottom: 8 }} />
            <Text variant="body" style={{ textAlign: 'center' }}>
              {"When heartbeat > 100bpm, you physically can't listen. Breathe until the circle is slow."}
            </Text>
          </GlassCard>

          <SquishyButton style={styles.skipBtn} onPress={() => navigation.replace('SOSVerdict', { fightId })}>
            <Text variant="body" style={{ color: 'rgba(255,255,255,0.6)' }}>Skip (I'm Calm)</Text>
          </SquishyButton>
        </View>

        <MarcieHost mode="idle" size={100} float position={{ x: 0, y: 50 }} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0708' },
  content: { alignItems: 'center', width: '100%', padding: 20 },
  title: { color: '#33DEA5', fontSize: 24, marginBottom: 4 },
  sub: { color: 'rgba(255,255,255,0.5)', marginBottom: 40 },

  orbContainer: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  orb: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#33DEA5', opacity: 0.3 },
  orbCore: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#33DEA5', opacity: 0.8, shadowColor: '#33DEA5', shadowRadius: 20, shadowOpacity: 0.5 },

  tipCard: { marginTop: 40, alignItems: 'center', backgroundColor: 'rgba(51, 222, 165, 0.1)', borderColor: '#33DEA5' },
  skipBtn: { marginTop: 20, backgroundColor: 'transparent' }
});
