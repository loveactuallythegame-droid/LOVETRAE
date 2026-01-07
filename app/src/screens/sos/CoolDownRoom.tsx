import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Text, SquishyButton } from '../../components/ui';
import { subscribeFight, supabase } from '../../lib/supabase';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../../state/store';

type CoolDownRoomProps = {
  route: any;
  navigation: any;
};

export default function CoolDownRoom({ route, navigation }: CoolDownRoomProps) {
  const { fightId } = route.params;
  const breath = useSharedValue(0);
  const [remaining, setRemaining] = useState(7200);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    breath.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    Notifications.requestPermissionsAsync();
    timerRef.current = setInterval(() => setRemaining((r) => r - 1), 1000);
    const sub = subscribeFight(fightId, (payload) => {
      const after = payload.new;
      if (after?.partner_b_input) {
        Notifications.scheduleNotificationAsync({ content: { title: 'Partner joined SOS', body: 'Ready for verdict.' }, trigger: null });
        navigation.replace('SOSVerdict', { fightId });
      }
    });
    useAppStore.getState().setSOSSessionId(fightId);
    return () => { clearInterval(timerRef.current); supabase.removeChannel(sub); };
  }, [fightId]);

  useEffect(() => {
    if (remaining <= 0) navigation.replace('SOSVerdict', { fightId, timeout: true });
  }, [remaining]);

  const circle = useAnimatedStyle(() => ({ width: 140 + breath.value * 40, height: 140 + breath.value * 40, borderRadius: 90, backgroundColor: '#33DEA5' }));

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <View style={styles.root}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text variant="header" style={{ color: '#E11637' }}>🕒 Waiting for Your Partner</Text>
      </View>
      <Animated.View style={[circle]} />
      <Text variant="body">Breathe in... out...</Text>
      <Text variant="keyword">Wait Time {mm}:{ss}</Text>
      <SquishyButton style={styles.btn} onPress={() => navigation.replace('SOSVerdict', { fightId })}><Text variant="header">Skip</Text></SquishyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  btn: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#5C1459', borderRadius: 12 },
});
