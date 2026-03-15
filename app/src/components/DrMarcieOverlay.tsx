import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import { COLORS, GRADIENTS, BORDER_RADIUS, SPACING, SHADOWS, ANIMATIONS } from '../theme';
import Typography from './ui/Typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type MarcieAnimation = 
  | 'intro'
  | 'idle'
  | 'point'
  | 'celebrate'
  | 'thinking'
  | 'nod'
  | 'shake'
  | 'waiting'
  | 'correct'
  | 'wrong'
  | 'shocked'
  | 'laugh'
  | 'shrug'
  | 'impatient'
  | 'detective'
  | 'listening'
  | 'warning'
  | 'jeopardy'
  | 'roast'
  | 'healing'
  | 'sos';

export type MarciePosition = 
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'center'
  | 'floating';

interface DrMarcieOverlayProps {
  animation?: MarcieAnimation;
  position?: MarciePosition;
  visible?: boolean;
  quote?: string;
  showBubble?: boolean;
  bubbleDuration?: number;
  onAnimationComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  zIndex?: number;
}

const ANIMATION_FILES: Record<MarcieAnimation, string> = {
  intro: 'marcie-intro.webm',
  idle: 'marcie-idle.webm',
  point: 'marcie-point.webm',
  celebrate: 'marcie-celebrate.webm',
  thinking: 'marcie-thinking.webm',
  nod: 'marcie-nod.webm',
  shake: 'marcie-shake.webm',
  waiting: 'marcie-waiting.webm',
  correct: 'marcie-correct.webm',
  wrong: 'marcie-wrong.webm',
  shocked: 'marcie-shocked.webm',
  laugh: 'marcie-laugh.webm',
  shrug: 'marcie-shrug.webm',
  impatient: 'marcie-impatient.webm',
  detective: 'marcie-detective.webm',
  listening: 'marcie-listening.webm',
  warning: 'marcie-warning.webm',
  jeopardy: 'marcie-jeopardy.webm',
  roast: 'marcie-roast-delivery.webm',
  healing: 'marcie-healing-intro.webm',
  sos: 'marcie-sos-intro.webm',
};

const SIZE_CONFIG = {
  small: { width: 100, height: 100 },
  medium: { width: 150, height: 150 },
  large: { width: 200, height: 200 },
};

/**
 * Get position style with safe area consideration
 * Positions DrMarcie to not overlap with interactive buttons
 */
const getPositionStyle = (position: MarciePosition): ViewStyle => {
  const base: ViewStyle = { position: 'absolute' };
  // Safe margin to avoid overlapping buttons
  const safeBottomMargin = 120; // Increased to avoid button overlap
  const sideMargin = SPACING.screenPadding;
  
  switch (position) {
    case 'bottom-right':
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
    case 'bottom-left':
      return { ...base, left: sideMargin, bottom: safeBottomMargin };
    case 'bottom-center':
      return { ...base, left: SCREEN_WIDTH / 2 - 75, bottom: safeBottomMargin };
    case 'top-right':
      return { ...base, right: sideMargin, top: 100 };
    case 'top-left':
      return { ...base, left: sideMargin, top: 100 };
    case 'center':
      return { ...base, left: SCREEN_WIDTH / 2 - 75, top: SCREEN_HEIGHT / 2 - 100 };
    case 'floating':
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
    default:
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
  }
};

/**
 * DrMarcieOverlay Component
 * 
 * Displays Dr. Marcie character overlay with speech bubble.
 * Positioned to not overlap with interactive buttons.
 * Uses theme tokens for all styling.
 */
export default function DrMarcieOverlay({
  animation = 'idle',
  position = 'bottom-right',
  visible = true,
  quote,
  showBubble = true,
  bubbleDuration = 5000,
  onAnimationComplete,
  size = 'medium',
  style,
  zIndex = 9999,
}: DrMarcieOverlayProps) {
  const [bubbleVisible, setBubbleVisible] = useState(showBubble && !!quote);
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const floatAnim = useRef(new RNAnimated.Value(0)).current;

  const animationFile = ANIMATION_FILES[currentAnimation];
  const sizeConfig = SIZE_CONFIG[size];

  useEffect(() => {
    if (visible) {
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.duration.normal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATIONS.duration.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (quote && showBubble) {
      setBubbleVisible(true);
      const timer = setTimeout(() => {
        setBubbleVisible(false);
      }, bubbleDuration);
      return () => clearTimeout(timer);
    }
  }, [quote, showBubble, bubbleDuration]);

  useEffect(() => {
    if (position === 'floating') {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(floatAnim, {
            toValue: -10,
            duration: ANIMATIONS.duration.slower,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          RNAnimated.timing(floatAnim, {
            toValue: 0,
            duration: ANIMATIONS.duration.slower,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [position]);

  useEffect(() => {
    setCurrentAnimation(animation);
  }, [animation]);

  if (!visible) return null;

  const positionStyle = getPositionStyle(position);

  return (
    <RNAnimated.View
      style={[
        styles.container,
        positionStyle,
        { zIndex },
        position === 'floating' && { transform: [{ translateY: floatAnim }] },
        { opacity: fadeAnim },
        style,
      ]}
      pointerEvents="none"
    >
      {bubbleVisible && quote && (
        <View style={styles.bubbleContainer}>
          <View style={styles.speechBubble}>
            <Typography variant="marcieDialogue" color={COLORS.textPrimary} center>
              {quote}
            </Typography>
          </View>
          <View style={styles.bubbleTriangle} />
        </View>
      )}

      <View style={[styles.characterContainer, { width: sizeConfig.width, height: sizeConfig.height }]}>
        <View style={[styles.glowEffect, { width: sizeConfig.width, height: sizeConfig.height }]} />
        
        <View style={[styles.character, { width: sizeConfig.width, height: sizeConfig.height }]}>
          <View style={styles.placeholderCharacter}>
            <View style={styles.hairIndicator} />
          </View>
        </View>

        <View style={styles.crown} />
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 9999,
  },
  bubbleContainer: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: SPACING.regular,
    alignItems: 'center',
    maxWidth: 280,
  },
  speechBubble: {
    backgroundColor: COLORS.backgroundModal,
    borderRadius: BORDER_RADIUS.bubble,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    borderWidth: 1,
    borderColor: COLORS.vibrantPink,
    ...SHADOWS.neonSoft,
  },
  bubbleTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.backgroundModal,
    marginTop: -1,
  },
  characterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    backgroundColor: COLORS.deepCosmic,
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
  },
  placeholderCharacter: {
    flex: 1,
    backgroundColor: COLORS.richPlum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hairIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.crimsonRed,
    opacity: 0.8,
  },
  crown: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brightYellow,
    borderWidth: 2,
    borderColor: COLORS.deepCosmic,
  },
});
