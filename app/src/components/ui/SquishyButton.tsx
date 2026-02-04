import { ReactNode, useState, useRef } from 'react';
import { Pressable, ViewStyle, Platform, Animated, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';

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
    borderColor: theme.COLORS.focusOutline,
    borderRadius: theme.SIZES.buttonBorderRadius,
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
      Animated.timing(shadow, { toValue: 0.35, duration: theme.ANIMATIONS.fast, useNativeDriver: Platform.OS !== 'web' })
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shadow, { toValue: 0.2, duration: theme.ANIMATIONS.fast, useNativeDriver: Platform.OS !== 'web' })
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

  // Create gradient button with the required gradient
  const gradientButton = (
    <LinearGradient
      colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: theme.SIZES.buttonBorderRadius,
        overflow: 'hidden',
        shadowColor: theme.COLORS.primaryGradientStart,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Animated.View 
        style={[
          animatedStyle, 
          { 
            backgroundColor: 'transparent',
            borderRadius: theme.SIZES.buttonBorderRadius,
            overflow: 'hidden'
          },
          focusStyle
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessible
          accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
          accessibilityState={{ disabled }}
          focusable={!disabled}
          onPress={() => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress && onPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            { 
              minWidth: theme.SIZES.buttonHeight, 
              minHeight: theme.SIZES.buttonHeight,
              borderRadius: theme.SIZES.buttonBorderRadius,
              paddingVertical: theme.SPACING.md,
              paddingHorizontal: theme.SPACING.lg,
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          {children}
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );

  return gradientButton;
}