import { useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Platform, Easing } from 'react-native';
import { useAppStore } from '../../state/store';
import LottieView from 'lottie-react-native';
import FrameSequence from './FrameSequence';
import { AVATAR_FRAMES } from '../../constants/assetManifest';
import { COLORS, SHADOWS } from '../../theme';

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
  cosmicGlow?: boolean;
  neonRing?: boolean;
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
  zIndex = 9999, // Set to cosmic retro arcade standard
  cosmicGlow = true,
  neonRing = true,
}: MarcieHostProps) {
  const { width, height } = useWindowDimensions();
  const defaultPos = { x: Math.max(0, width - size - 20), y: Math.max(0, height - size - 80) };

  const tx = useRef(new Animated.Value((position || defaultPos).x)).current;
  const ty = useRef(new Animated.Value((position || defaultPos).y)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.6)).current;
  const reducedMotion = useAppStore((s) => s.reducedMotion);

  // Enhanced floating animation with cosmic rhythm
  useEffect(() => {
    if (float && !reducedMotion) {
      // Main floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob, { 
            toValue: 1, 
            duration: 4000, 
            easing: Easing.inOut(Easing.ease), 
            useNativeDriver: Platform.OS !== 'web' 
          }),
          Animated.timing(bob, { 
            toValue: 0, 
            duration: 4000, 
            easing: Easing.inOut(Easing.ease), 
            useNativeDriver: Platform.OS !== 'web' 
          })
        ])
      ).start();
      
      // Cosmic glow pulsing
      if (cosmicGlow) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glow, { 
              toValue: 1, 
              duration: 2000, 
              easing: Easing.inOut(Easing.ease), 
              useNativeDriver: Platform.OS !== 'web' 
            }),
            Animated.timing(glow, { 
              toValue: 0.6, 
              duration: 2000, 
              easing: Easing.inOut(Easing.ease), 
              useNativeDriver: Platform.OS !== 'web' 
            })
          ])
        ).start();
      }
    } else {
      bob.setValue(0);
      glow.setValue(0.6);
    }
  }, [float, reducedMotion, cosmicGlow]);

  // Enhanced movement animation
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
      Animated.spring(tx, { 
        toValue: targetX, 
        useNativeDriver: Platform.OS !== 'web',
        stiffness: 100,
        damping: 15,
      }),
      Animated.spring(ty, { 
        toValue: targetY, 
        useNativeDriver: Platform.OS !== 'web',
        stiffness: 100,
        damping: 15,
      })
    ]).start();
  }, [mode, ctaTarget, inputTarget, position, size, width, height]);

  const animatedStyle = {
    transform: [
      { translateX: tx },
      { translateY: Animated.add(ty, bob.interpolate({ 
        inputRange: [0, 1], 
        outputRange: [-8, 8] // Enhanced floating range
      })) },
    ],
    zIndex,
  };

  const glowStyle = {
    opacity: glow,
  };

  return (
    <Animated.View pointerEvents="none" style={[styles.root, animatedStyle, { width: size, height: size }]}>
      {/* Cosmic glow effect */}
      {cosmicGlow && (
        <Animated.View style={[styles.cosmicGlow, glowStyle]}>
          <View style={[styles.glowRing, { width: size * 1.5, height: size * 1.5 }]} />
        </Animated.View>
      )}
      
      {/* Neon ring effect */}
      {neonRing && (
        <Animated.View style={[styles.neonRing, glowStyle]}>
          <View style={[styles.ring, { width: size * 1.2, height: size * 1.2 }]} />
        </Animated.View>
      )}
      
      {/* Main avatar container */}
      <View style={styles.avatarContainer}>
        {!!idleLottieSource && mode === 'idle' ? (
          <LottieView source={idleLottieSource} autoPlay loop style={{ width: size, height: size }} />
        ) : (
          <FrameSequence frames={idleFrames} style={{ width: size, height: size }} />
        )}
      </View>
      
      {/* Inner glow effect */}
      {cosmicGlow && (
        <Animated.View style={[styles.innerGlow, glowStyle]}>
          <View style={[styles.innerGlowRing, { width: size * 0.8, height: size * 0.8 }]} />
        </Animated.View>
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
  
  avatarContainer: {
    position: 'relative',
    zIndex: 2,
  },
  
  cosmicGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -75, // Half of 1.5x size for 100x100 base
    marginLeft: -75,
    zIndex: 1,
  },
  
  glowRing: {
    borderRadius: 9999,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  
  neonRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -60, // Half of 1.2x size for 100x100 base
    marginLeft: -60,
    zIndex: 1,
  },
  
  ring: {
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(234, 3, 31, 0.6)',
    shadowColor: '#EA031F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 12,
  },
  
  innerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40, // Half of 0.8x size for 100x100 base
    marginLeft: -40,
    zIndex: 3,
  },
  
  innerGlowRing: {
    borderRadius: 9999,
    backgroundColor: 'rgba(219, 20, 124, 0.1)',
    shadowColor: '#DB147C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
});
