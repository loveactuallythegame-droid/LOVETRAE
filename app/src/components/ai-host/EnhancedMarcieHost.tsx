import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Platform, Easing } from 'react-native';
import { Video } from 'expo-av';
import { useAppStore } from '../../state/store';
import { MarcieAnimation } from '../../lib/game-types';

interface EnhancedMarcieHostProps {
  animation?: MarcieAnimation | null;
  position?: { x: number; y: number };
  size?: number;
  float?: boolean;
  zIndex?: number;
  cosmicGlow?: boolean;
  neonRing?: boolean;
  onAnimationComplete?: () => void;
}

// Map game states to specific animation files
const ANIMATION_FILES = {
  idle: require('../../../assets/animations/marcie-idle.webm'),
  impatient: require('../../../assets/animations/marcie-impatient.webm'),
  correct: require('../../../assets/animations/marcie-correct.webm'),
  listening: require('../../../assets/animations/marcie-listening.webm'),
  wrong: require('../../../assets/animations/marcie-wrong.webm'),
  shocked: require('../../../assets/animations/marcie-shocked.webm'),
  thinking: require('../../../assets/animations/marcie-thinking.webm'),
  warning: require('../../../assets/animations/marcie-warning.webm'),
  waiting: require('../../../assets/animations/marcie-waiting.webm'),
  shrug: require('../../../assets/animations/marcie-shrug.webm'),
  jeopardy: require('../../../assets/animations/marcie-jeopardy.webm'),
};

const EnhancedMarcieHost: React.FC<EnhancedMarcieHostProps> = ({
  animation,
  position,
  size = 220,
  float = true,
  zIndex = 9999,
  cosmicGlow = true,
  neonRing = true,
  onAnimationComplete,
}) => {
  const { width, height } = useWindowDimensions();
  const defaultPos = { x: Math.max(0, width - size - 20), y: Math.max(0, height - size - 80) };

  const tx = useRef(new Animated.Value((position || defaultPos).x)).current;
  const ty = useRef(new Animated.Value((position || defaultPos).y)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.6)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [currentAnimation, setCurrentAnimation] = useState<keyof typeof ANIMATION_FILES>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const videoRef = useRef<Video>(null);

  // Handle animation changes based on game state
  useEffect(() => {
    if (animation) {
      const newAnimation = animation.type in ANIMATION_FILES ? animation.type : 'idle';
      
      if (newAnimation !== currentAnimation) {
        setCurrentAnimation(newAnimation as keyof typeof ANIMATION_FILES);
        setIsAnimating(true);
        
        // Scale animation for emphasis
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]).start();

        // Enhanced glow for special animations
        if (['correct', 'wrong', 'shocked', 'warning'].includes(newAnimation)) {
          Animated.sequence([
            Animated.timing(glow, {
              toValue: 1,
              duration: 300,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(glow, {
              toValue: 0.6,
              duration: 300,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]).start();
        }

        // Auto-return to idle after specific animations
        if (animation.duration) {
          setTimeout(() => {
            setCurrentAnimation('idle');
            setIsAnimating(false);
            if (onAnimationComplete) onAnimationComplete();
          }, animation.duration);
        } else {
          // Default duration based on animation type
          const defaultDurations = {
            correct: 3000,
            wrong: 2500,
            shocked: 2000,
            thinking: 4000,
            listening: 3500,
            impatient: 3000,
            warning: 3000,
            shrug: 2500,
            jeopardy: 4000,
          };
          
          const duration = defaultDurations[currentAnimation as keyof typeof defaultDurations] || 2000;
          
          setTimeout(() => {
            if (currentAnimation !== 'idle') {
              setCurrentAnimation('idle');
              setIsAnimating(false);
              if (onAnimationComplete) onAnimationComplete();
            }
          }, duration);
        }
      }
    }
  }, [animation, currentAnimation, onAnimationComplete]);

  // Enhanced floating animation
  useEffect(() => {
    if (float && !reducedMotion) {
      // Main floating animation
      const floatAnimation = Animated.loop(
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
      );
      
      floatAnimation.start();
      
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

      return () => {
        floatAnimation.stop();
      };
    } else {
      bob.setValue(0);
      glow.setValue(0.6);
    }
  }, [float, reducedMotion, cosmicGlow]);

  // Position animation
  useEffect(() => {
    let targetX = (position || defaultPos).x;
    let targetY = (position || defaultPos).y;

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
  }, [position, defaultPos, tx, ty]);

  // Handle video playback completion
  const handleVideoPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish && currentAnimation !== 'idle') {
      // Return to idle animation
      setCurrentAnimation('idle');
      setIsAnimating(false);
      if (onAnimationComplete) onAnimationComplete();
    }
  };

  const animatedStyle = {
    transform: [
      { translateX: tx },
      { translateY: Animated.add(ty, bob.interpolate({ 
        inputRange: [0, 1], 
        outputRange: [-8, 8]
      })) },
      { scale },
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
      
      {/* Main video container */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={ANIMATION_FILES[currentAnimation]}
          style={{ width: size, height: size }}
          resizeMode="contain"
          shouldPlay={true}
          isLooping={currentAnimation === 'idle'}
          onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
        />
      </View>
      
      {/* Inner glow effect */}
      {cosmicGlow && (
        <Animated.View style={[styles.innerGlow, glowStyle]}>
          <View style={[styles.innerGlowRing, { width: size * 0.8, height: size * 0.8 }]} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    // @ts-ignore - Web optimization
    willChange: 'transform',
  },
  
  videoContainer: {
    position: 'relative',
    zIndex: 2,
    borderRadius: 1000,
    overflow: 'hidden',
  },
  
  cosmicGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -75,
    marginLeft: -75,
    zIndex: 1,
  },
  
  neonRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -60,
    marginLeft: -60,
    zIndex: 1,
  },
  
  innerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 3,
  },
  
  glowRing: {
    borderRadius: 1000,
    backgroundColor: 'rgba(239, 27, 110, 0.3)',
    shadowColor: '#ef1b6e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  
  ring: {
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: 'rgba(144, 86, 239, 0.6)',
    shadowColor: '#9056ef',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  
  innerGlowRing: {
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
});

export default EnhancedMarcieHost;