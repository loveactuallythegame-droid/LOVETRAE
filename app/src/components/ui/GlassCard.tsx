import { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import theme from '../../theme';

type GlassCardProps = {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
  onPress?: () => void;
};

export default function GlassCard({ children, width, height, radius = theme.SIZES.borderRadius, style, onPress }: GlassCardProps) {
  const Container = onPress ? Pressable : View;
  
  // Define gradient colors based on theme
  const gradientColors = [
    { offset: "0%", color: theme.COLORS.profileRingStart, opacity: 0.1 },
    { offset: "50%", color: theme.COLORS.profileRingMid, opacity: 0.1 },
    { offset: "100%", color: theme.COLORS.profileRingEnd, opacity: 0.2 }
  ];

  return (
    // @ts-ignore
    <Container 
      onPress={onPress} 
      style={[
        styles.container, 
        { 
          width, 
          height, 
          borderRadius: radius,
          backgroundColor: theme.COLORS.card
        }, 
        style
      ]}
    >
      <BlurView 
        intensity={40} 
        tint="dark" 
        style={[styles.blur, { borderRadius: radius }]} 
      />
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientColors.map((stop, index) => (
              <Stop 
                key={index} 
                offset={stop.offset} 
                stopColor={stop.color} 
                stopOpacity={Platform.OS === 'android' ? 0.3 : 0.1} // Higher opacity on Android due to different rendering
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect
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
        />
      </Svg>
      <View style={[styles.content, { borderRadius: radius }]}>{children}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.2)',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: theme.SPACING.md,
  },
});