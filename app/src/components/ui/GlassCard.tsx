import { ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated';

type GlassCardProps = {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function GlassCard({ children, width, height, radius = 16, style }: GlassCardProps) {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withRepeat(withTiming(1, { duration: 5000 }), -1, true);
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: anim.value * 100,
  }));

  return (
    <View style={[styles.container, { width, height, borderRadius: radius }, style]}> 
      <BlurView intensity={40} tint="dark" style={[styles.blur, { borderRadius: radius }]} />
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="borderGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="rgba(250, 31, 99, 0.1)" />
            <Stop offset="1" stopColor="rgba(92, 20, 89, 0.2)" />
          </LinearGradient>
        </Defs>
        <AnimatedRect
          x={1}
          y={1}
          rx={radius}
          ry={radius}
          width="99%"
          height="99%"
          fill="transparent"
          stroke="url(#borderGradient)"
          strokeWidth={1}
          strokeDasharray="8 12"
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={[styles.content, { borderRadius: radius }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 10, 31, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.2)',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});
