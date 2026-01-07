import Svg, { Defs, ClipPath, Path, Rect, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withRepeat } from 'react-native-reanimated';

type TrustThermometerProps = {
  width?: number;
  height?: number;
  level?: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function TrustThermometer({ width = 40, height = 180, level = 0.5 }: TrustThermometerProps) {
  const fill = useSharedValue(level);
  fill.value = withRepeat(withTiming(level, { duration: 1200 }), 1, false);

  const waveProps = useAnimatedProps(() => ({
    d: `M 0 ${height * (1 - fill.value)} C ${width / 4} ${height * (1 - fill.value) - 6}, ${
      (width * 3) / 4
    } ${height * (1 - fill.value) + 6}, ${width} ${height * (1 - fill.value)} L ${width} ${height} L 0 ${height} Z`,
  }));

  return (
    <Svg width={width} height={height}>
      <Defs>
        <ClipPath id="thermoClip">
          <Path d={`M ${width / 2} ${height} A ${width / 2} ${width / 2} 0 1 1 ${width / 2} ${height - width} L ${
            width / 2
          } ${width / 2} A ${width / 2} ${width / 2} 0 1 1 ${width / 2} ${width} L ${width / 2} ${height - width} Z`} />
        </ClipPath>
        <LinearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FA1F63" />
          <Stop offset="1" stopColor="#5C1459" />
        </LinearGradient>
      </Defs>
      <Rect width={width} height={height} rx={width / 2} ry={width / 2} fill="#1a0a1f" />
      <AnimatedPath clipPath="url(#thermoClip)" animatedProps={waveProps} fill="url(#liquid)" />
    </Svg>
  );
}
