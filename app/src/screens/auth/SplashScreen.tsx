import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Modal, Platform, ActivityIndicator, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { RadialGradientBackground, Text, SquishyButton, GlassCard } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { LOGO_IMAGES, INTRO_VIDEO } from '../../constants/assetManifest';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type SplashScreenProps = {
  onStart: () => void;
  onLogin?: () => void;
};

export default function SplashScreen({ onStart, onLogin }: SplashScreenProps) {
  const [stage, setStage] = useState<'video' | 'logo' | 'auth'>('video');
  const [needsSoundUnlock, setNeedsSoundUnlock] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const setStageSafe = (s: 'video' | 'logo' | 'auth') => {
    setStage(prev => prev === s ? prev : s);
  };
  const pulse = useSharedValue(1);
  const float = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.06, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
    float.value = withRepeat(withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const logoFloatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));
  const videoUriRaw = Platform.OS === 'web' ? Asset.fromModule(INTRO_VIDEO[0]).uri : undefined;
  const videoUri = Platform.OS === 'web' && videoUriRaw ? videoUriRaw.replace('/assets/assets/', '/assets/') : undefined;
  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('introSeen');
      if (Platform.OS === 'web') {
        setStageSafe('logo');
        return;
      }
      if (seen === 'true') {
        setStageSafe('logo');
      }
    })();
  }, []);
  useEffect(() => {
    if (Platform.OS === 'web' && stage === 'video') {
      if (!videoUri) {
        setStageSafe('logo');
        return;
      }
      const el = document.getElementById('intro-video') as HTMLVideoElement | null;
      if (el) {
        el.muted = false;
        const p = el.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            setNeedsSoundUnlock(true);
            el.muted = true;
            el.play().catch(() => { });
          });
        }
        el.onerror = () => {
          setStageSafe('logo');
        };
        el.onloadeddata = () => {
          setVideoLoading(false);
        };
        el.onended = async () => {
          await AsyncStorage.setItem('introSeen', 'true');
          setStageSafe('logo');
        };
      } else {
        setStageSafe('logo');
      }
    }
  }, [stage]);

  // Force video finished for debugging if needed, but keeping logic
  const [videoFinished, setVideoFinished] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* EXACT BACKGROUND IMAGE FROM HTML REFERENCE */}
      <Image
        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLeJGWQBvAptpw89cPf9o0BiEUKC79ttx-85GJ0zm4NMekNNnOMpyKPv-sVAThtxJ7U2U9YJlpoxBJ2ITGY44CcnyLghPT6XEbY0du6asTTjYWG9bdx3UXdG86ODjuYjuJEn189tyY-mb7RBGFOfVRQu1FziJE7Vl3HdR5sKXTmDTkupl_eL1acvW9ywJ1HVDks6nErFv-oPAJkAfGYPmYO5Egd8kCE06-XwpqCeTUyuslZa6APrt1V78dG8ROaLXYihN7Zp6_zBrp" }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(45, 10, 49, 0.4)' }]} />

      {/* Video Layer */}
      {!videoFinished && (
        <View style={StyleSheet.absoluteFill}>
          {Platform.OS === 'web' ? (
            <video
              src={videoUri}
              style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 100 }}
              autoPlay
              muted={!needsSoundUnlock}
              playsInline
              onEnded={() => setVideoFinished(true)}
            />
          ) : (
            <Video
              source={INTRO_VIDEO[0]}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={(s: any) => {
                if (s?.didJustFinish) setVideoFinished(true);
              }}
            />
          )}
        </View>
      )}

      {/* Main Overlay Content - Always visible after video or during if transparent? 
          User said "marcie-intro.webm s overlay without being in a loop just once and then they can acces"
          So we probably show the logo layer AFTER video.
      */}
      {/* OVERLAY - ALWAYS RENDERED BUT HIDDEN BEHIND VIDEO IF PLAYING */}
      <View style={[styles.overlay, { opacity: videoFinished ? 1 : 0 }]}>
        {/* Top Icons */}
        <View style={{ position: 'absolute', top: 32, left: 32, flexDirection: 'row', gap: 16 }}>
          <Ionicons name="radio-outline" size={32} color="#40E0D0" />
          <Ionicons name="heart" size={32} color="#ee2b8c" />
        </View>
        <View style={{ position: 'absolute', top: 32, right: 32, flexDirection: 'row', gap: 16 }}>
          <Ionicons name="share-social" size={32} color="#ee2b8c" />
          <Ionicons name="wifi" size={32} color="#40E0D0" />
        </View>

        {/* Center Content */}
        <View style={styles.contentContainer}>
          <Image source={LOGO_IMAGES[0]} style={{ width: 300, height: 300, marginBottom: 20 }} resizeMode="contain" />
          <Text variant="header" style={styles.subTitle}>THE GAME</Text>

          <GlassCard style={styles.glassPanel}>
            <Text variant="header" style={{ fontSize: 20, letterSpacing: 2, textAlign: 'center', color: 'white' }}>
              HOW ABOUT WE DON'T <Text variant="header" style={{ color: '#ee2b8c', fontWeight: '900' }}>BREAK</Text> UP?
            </Text>
          </GlassCard>

          {/* Start Button */}
          <Pressable onPress={() => { Haptics.selectionAsync(); onStart(); }} style={{ marginTop: 60 }}>
            <Text variant="header" style={styles.pressStart}>PRESS TO START</Text>
          </Pressable>
        </View>

        {/* Disclaimer / Authorization */}
        <View style={{ position: 'absolute', bottom: 100, width: '100%', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textAlign: 'center' }}>
            By entering, you authorize audio analysis for relationship diagnostics.
          </Text>
        </View>

        {/* Bottom Status Bar */}
        <View style={{ position: 'absolute', bottom: 32, left: 32, flexDirection: 'row', alignItems: 'center', gap: 16, opacity: 0.6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#40E0D0' }} />
          <Text variant="body" style={{ fontSize: 10, letterSpacing: 3, color: 'white' }}>SYSTEMS_ONLINE // V.2.0.1</Text>
        </View>

        {/* Marcie Host - FORCED VISIBLE */}
        <MarcieHost mode={'idle'} size={180} float position={{ x: 0, y: 150 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,18,0.4)', // Slight dim
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    marginTop: -40,
  },
  subTitle: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 8,
    marginTop: -20, // Pull it up closer to logo since text is gone
    fontWeight: '300'
  },
  glassPanel: {
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 999, // Full pill shape
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(18, 18, 18, 0.6)',
  },
  pressStart: {
    fontSize: 28,
    color: '#FFD700', // Gold
    letterSpacing: 6,
    textShadowColor: '#FF8C00',
    textShadowRadius: 15,
  },
});
