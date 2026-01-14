import { useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Platform, Easing } from 'react-native';
import { useAppStore } from '../../state/store';
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

  const tx = useRef(new Animated.Value((position || defaultPos).x)).current;
  const ty = useRef(new Animated.Value((position || defaultPos).y)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const reducedMotion = useAppStore((s) => s.reducedMotion);

  useEffect(() => {
    if (float && !reducedMotion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(bob, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' })
        ])
      ).start();
    } else {
      bob.setValue(0);
    }
  }, [float, reducedMotion]);

  useEffect(() => {
    let targetX = (position || defaultPos).x;
    let targetY = (position || defaultPos).y;

    if (mode === 'point' && ctaTarget) {
      targetX = ctaTarget.x - size * 0.3;
      targetY = ctaTarget.y - size * 0.6;
    } else if (mode === 'lean' && inputTarget) {
      targetX = inputTarget.x - size * 0.2;
      targetY = inputTarget.y - size * 0.5;
    }

    Animated.parallel([
      Animated.timing(tx, { toValue: targetX, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(ty, { toValue: targetY, duration: 600, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  }, [mode, ctaTarget, inputTarget, position, size, width, height]);

  const animatedStyle = {
    transform: [
      { translateX: tx },
      { translateY: Animated.add(ty, bob.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] })) }, // Bob range -5 to 5
    ],
    zIndex,
  };

  return (
    <Animated.View pointerEvents="none" style={[styles.root, animatedStyle, { width: size, height: size }]}>
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
