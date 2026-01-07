import { ReactNode, useState } from 'react';
import { Pressable, ViewStyle, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';

type SquishyButtonProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function SquishyButton({ children, style, onPress, accessibilityLabel }: SquishyButtonProps) {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0.2);
  const [isFocused, setIsFocused] = useState(false);
  const animated = useAnimatedStyle(() => ({ 
    transform: [{ scale: scale.value }], 
    shadowOpacity: shadow.value, 
    shadowRadius: 6 
  }));

  const focusStyle = isFocused ? {
    borderWidth: 2,
    borderColor: COLORS.focusOutline,
    borderRadius: 8, // Ensure outline is visible and follows shape roughly
  } : {};

  return (
    <Pressable
      accessibilityRole="button"
      accessible
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
      focusable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress && onPress(); }}
      onPressIn={() => { scale.value = withSpring(0.95); shadow.value = withTiming(0.35, { duration: 120 }); }}
      onPressOut={() => { scale.value = withSpring(1); shadow.value = withTiming(0.2, { duration: 120 }); }}
      onHoverIn={() => { scale.value = withTiming(1.05, { duration: 150 }); shadow.value = withTiming(0.4, { duration: 150 }); }}
      onHoverOut={() => { scale.value = withTiming(1, { duration: 150 }); shadow.value = withTiming(0.2, { duration: 150 }); }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[{ minWidth: 44, minHeight: 44 }, Platform.OS === 'web' && isFocused ? { outlineColor: COLORS.focusOutline, outlineWidth: 2, outlineStyle: 'solid' } : {}]}
    >
      <Animated.View style={[animated, style, focusStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
