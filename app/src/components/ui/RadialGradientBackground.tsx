import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type RadialGradientBackgroundProps = {
  noiseDensity?: number;
};

export default function RadialGradientBackground({ noiseDensity = 0.0006 }: RadialGradientBackgroundProps) {
  return (
    <LinearGradient
      colors={["#5C1459", "#FA1F63"]}
      start={{ x: 0.5, y: 0.2 }}
      end={{ x: 0.5, y: 1 }}
      style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0 }}
      pointerEvents="none"
    >
      {Platform.OS !== 'web' && (
        <View style={{ flex: 1 }} pointerEvents="none" />
      )}
    </LinearGradient>
  );
}
