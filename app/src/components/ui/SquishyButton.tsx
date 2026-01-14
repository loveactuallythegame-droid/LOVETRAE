import { ReactNode, useState, useRef } from 'react';
import { Pressable, ViewStyle, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';

type SquishyButtonProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function SquishyButton({ children, style, onPress, accessibilityLabel, disabled }: SquishyButtonProps & { disabled?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0.2)).current;
  const [isFocused, setIsFocused] = useState(false);

  // Focus styles for accessibility
  const focusStyle = isFocused ? {
    borderWidth: 2,
    borderColor: COLORS.focusOutline,
    borderRadius: 8,
  } : {};

  // Animated styles
  const animatedStyle = {
    transform: [{ scale }],
    shadowOpacity: shadow,
    shadowRadius: 6,
    opacity: disabled ? 0.6 : 1, // Visual indication of disabled state
  };

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shadow, { toValue: 0.35, duration: 120, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shadow, { toValue: 0.2, duration: 120, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  };

  const handleHoverIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, { toValue: 1.05, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shadow, { toValue: 0.4, duration: 150, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  };

  const handleHoverOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shadow, { toValue: 0.2, duration: 150, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessible
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
      accessibilityState={{ disabled }}
      focusable={!disabled}
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress && onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onFocus={() => !disabled && setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[{ minWidth: 44, minHeight: 44 }, Platform.OS === 'web' && isFocused ? { outlineColor: COLORS.focusOutline, outlineWidth: 2, outlineStyle: 'solid' } : {}]}
    >
      <Animated.View style={[animatedStyle, style, focusStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
