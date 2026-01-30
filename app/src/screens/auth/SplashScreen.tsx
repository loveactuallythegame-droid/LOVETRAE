
import { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { GlassCard, Text } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import { LOGO_IMAGES, INTRO_VIDEO } from '../../constants/assetManifest';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type SplashScreenProps = {
  onStart: () => void;
  onLogin?: () => void;
};

export default function SplashScreen({ onStart, onLogin }: SplashScreenProps) {
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef<Video>(null);
  const marcieVideoAsset = Asset.fromModule(require('../../../public/animations/marcie-intro.webm'));

  const pulse = useSharedValue(1);
  const float = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    float.value = withRepeat(withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);

    (async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenMarcieIntro');
      if (hasSeenIntro) {
        setVideoFinished(true);
      }
    })();
  }, []);

  const handleVideoEnd = async () => {
    await AsyncStorage.setItem('hasSeenMarcieIntro', 'true');
    setVideoFinished(true);
  };

  const animatedPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const animatedFloatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0a0c', '#230f19', '#392830']}
        style={styles.background}
      />
      
      {!videoFinished ? (
        <Video
          ref={videoRef}
          source={{ uri: marcieVideoAsset.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              handleVideoEnd();
            }
          }}
        />
      ) : (
        <Animated.View style={styles.contentContainer} entering={FadeIn.duration(1000)}>
            <View style={styles.header}>
                <Image source={require('../../../public/logos/logo-light.png')} style={styles.headerLogo} />
            </View>

            <View style={styles.centerContent}>
                <Animated.View style={[styles.logoContainer, animatedFloatStyle]}>
                    <Image source={require('../../../public/logos/logo-symbol-glow.png')} style={styles.logo} resizeMode="contain" />
                </Animated.View>
                <Text style={styles.gameTitle}>LOVE ACTUALLY...</Text>
                <Text style={styles.tagline}>The game for couples who want to fight better.</Text>
            </View>

            <Pressable onPress={() => { Haptics.selectionAsync(); onStart(); }} style={styles.startButton}>
                <Animated.View style={animatedPulseStyle}>
                    <Text style={styles.pressStart}>PRESS TO START</Text>
                </Animated.View>
            </Pressable>

            <MarcieHost mode={'idle'} size={150} float position={{ x: 0, y: 120 }} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>A new way to connect.</Text>
            </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0708',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 50,
      paddingHorizontal: 24,
  },
  header: {
      position: 'absolute',
      top: 60,
      alignItems: 'center',
  },
  headerLogo: {
      width: 150,
      height: 40,
      resizeMode: 'contain',
  },
  centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  logoContainer: {
    shadowColor: '#ee2b8c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
  gameTitle: {
    fontFamily: 'WorkSans-Bold',
    fontSize: 24,
    letterSpacing: 8,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 20,
  },
  tagline: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    textAlign: 'center'
  },
  startButton: {
      position: 'absolute',
      bottom: 120,
  },
  pressStart: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    letterSpacing: 4,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowRadius: 15,
  },
  footer: {
      position: 'absolute',
      bottom: 50,
  },
  footerText: {
      fontFamily: 'SpaceGrotesk-Regular',
      fontSize: 12,
      color: 'rgba(255,255,255,0.4)',
  }
});
