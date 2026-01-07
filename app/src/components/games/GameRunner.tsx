import { ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Text, GlassCard } from '../ui';
import { MarcieHost } from '../ai-host';
import ConfettiBurst from '../effects/ConfettiBurst';
import * as Haptics from 'expo-haptics';

type GameRunnerProps = {
  title: string;
  durationSec?: number;
  onFinish: (result: { score: number; state: any }) => void;
  inputArea: ReactNode;
  commentary?: string;
  victory?: boolean;
};

export default function GameRunner({ title, durationSec = 600, onFinish, inputArea, commentary, victory }: GameRunnerProps) {
  const [remaining, setRemaining] = useState(durationSec);
  const [showConfetti, setShowConfetti] = useState(false);
  const float = useSharedValue(0);
  useEffect(() => { float.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  useEffect(() => { const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000); return () => clearInterval(t); }, [durationSec]);
  useEffect(() => { if (victory) { setShowConfetti(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setTimeout(() => setShowConfetti(false), 1500); } }, [victory]);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: (float.value - 0.5) * 8 }] }));
  return (
    <View style={styles.root}>
      <GlassCard>
        <View style={styles.header}>
          <Text variant="header">{title}</Text>
          <Text variant="keyword">{mm}:{ss}</Text>
        </View>
        <View style={{ minHeight: 200 }}>{inputArea}</View>
      </GlassCard>
      <Animated.View style={[styles.marcieWrap, style]}>
        <MarcieHost mode={'idle'} size={200} float />
        {!!commentary && <Text variant="sass">{commentary}</Text>}
      </Animated.View>
      {showConfetti && <ConfettiBurst onEnd={() => setShowConfetti(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marcieWrap: { alignItems: 'center', gap: 8 },
});
