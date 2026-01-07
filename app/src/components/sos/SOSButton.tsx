import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type SOSButtonProps = {
  onPress: () => void;
  style?: any;
};

export default function SOSButton({ onPress, style }: SOSButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.2, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.6,
  }));

  return (
    <Pressable onPress={onPress} style={[{ position: 'absolute', right: 20, bottom: 20, zIndex: 1001, width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View style={[{ position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#FA1F63' }, pulseStyle]} />
      <Svg width={84} height={84} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E11637" />
            <Stop offset="1" stopColor="#FA1F63" />
          </LinearGradient>
        </Defs>
        <Circle cx={42} cy={42} r={30} fill="url(#rg)" />
        <SvgText x={42} y={48} fontSize={22} textAnchor="middle" fill="white">❤️∞</SvgText>
      </Svg>
    </Pressable>
  );
}
