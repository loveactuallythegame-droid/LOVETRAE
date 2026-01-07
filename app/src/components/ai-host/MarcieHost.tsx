import { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useAppStore } from '../../state/store';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import FrameSequence from './FrameSequence';
import { AVATAR_FRAMES } from '../../constants/assetManifest';

type GestureTarget = {
  x: number;
  y: number;
};

type MarcieMode = 'idle' | 'point' | 'hold-timer' | 'tap-watch' | 'lean';

type MarcieHostProps = {
  mode?: MarcieMode;
  idleLottieSource?: any;
  idleFrames?: number[];
  position?: { x: number; y: number };
  ctaTarget?: GestureTarget;
  inputTarget?: GestureTarget;
  size?: number;
  float?: boolean;
  zIndex?: number;
};

export default function MarcieHost({
  mode = 'idle',
  idleLottieSource,
  idleFrames = AVATAR_FRAMES,
  position,
  ctaTarget,
  inputTarget,
  size = 220,
  float = true,
  zIndex = 1000,
}: MarcieHostProps) {
  const { width, height } = useWindowDimensions();
  const defaultPos = { x: Math.max(0, width - size - 20), y: Math.max(0, height - size - 80) };
  const tx = useSharedValue((position || defaultPos).x);
  const ty = useSharedValue((position || defaultPos).y);
  const bob = useSharedValue(0);
  const reducedMotion = useAppStore((s) => s.reducedMotion);

  useEffect(() => {
    if (float && !reducedMotion) bob.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [float, reducedMotion]);

  const px = position?.x;
  const py = position?.y;
  const cx = ctaTarget?.x;
  const cy = ctaTarget?.y;
  const ix = inputTarget?.x;
  const iy = inputTarget?.y;

  useEffect(() => {
    if (mode === 'point' && ctaTarget) {
      tx.value = withTiming(ctaTarget.x - size * 0.3, { duration: 600 });
      ty.value = withTiming(ctaTarget.y - size * 0.6, { duration: 600 });
    } else if (mode === 'lean' && inputTarget) {
      tx.value = withTiming(inputTarget.x - size * 0.2, { duration: 600 });
      ty.value = withTiming(inputTarget.y - size * 0.5, { duration: 600 });
    } else {
      const p = position || defaultPos;
      tx.value = withTiming(p.x, { duration: 600 });
      ty.value = withTiming(p.y, { duration: 600 });
    }
  }, [mode, cx, cy, ix, iy, px, py, size, width, height]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value + (float ? (bob.value - 0.5) * 10 : 0) },
    ],
    zIndex,
  }));

  // Debounced resize handler could be added here if needed, but Reanimated handles values well.
  
  return (
    <Animated.View pointerEvents="none" style={[styles.root, style, { width: size, height: size }]}> 
      {!!idleLottieSource && mode === 'idle' ? (
        <LottieView source={idleLottieSource} autoPlay loop style={{ width: size, height: size }} />
      ) : (
        <FrameSequence frames={idleFrames} style={{ width: size, height: size }} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    // @ts-ignore - Web optimization
    willChange: 'transform',
  },
});
