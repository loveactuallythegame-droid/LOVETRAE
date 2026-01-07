import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Modal, Platform, ActivityIndicator, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { RadialGradientBackground, Text, SquishyButton } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { LOGO_IMAGES, INTRO_VIDEO } from '../../constants/assetManifest';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
            el.play().catch(() => {});
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

  return (
    <View style={{ flex: 1, backgroundColor: '#120016' }}>
      <RadialGradientBackground />
      {stage === 'video' && (Platform.OS !== 'web' ? (
        <View style={StyleSheet.absoluteFill}>
          <Video
            source={INTRO_VIDEO[0]}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            shouldPlay
            isMuted={true}
            onLoadStart={() => setVideoLoading(true)}
            onLoad={() => setVideoLoading(false)}
            onError={() => {
              setVideoLoading(false);
              setStageSafe('logo');
            }}
            onPlaybackStatusUpdate={async (s: any) => {
              if (s?.didJustFinish) {
                await AsyncStorage.setItem('introSeen', 'true');
                setStageSafe('logo');
              }
            }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Skip intro" onPress={async () => {
            await AsyncStorage.setItem('introSeen', 'true');
            setStageSafe('logo');
          }} style={[styles.skipBtn, { zIndex: 1000 }]}>
            <Text variant="header">Skip</Text>
          </Pressable>
          {videoLoading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#FA1F63" />
            </View>
          )}
        </View>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <video
            id="intro-video"
            src={videoUri}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
            autoPlay
            playsInline
            loop={false}
            onError={() => {
              setStageSafe('logo');
              setNeedsSoundUnlock(false);
              setVideoLoading(false);
            }}
            onEnded={async () => {
              await AsyncStorage.setItem('introSeen', 'true');
              setStageSafe('logo');
            }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Skip intro" onPress={async () => {
            await AsyncStorage.setItem('introSeen', 'true');
            setStageSafe('logo');
          }} style={[styles.skipBtn, { zIndex: 1000 }]}>
            <Text variant="header">Skip</Text>
          </Pressable>
          {videoLoading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#FA1F63" />
            </View>
          )}
          {needsSoundUnlock && (
            <View style={styles.soundUnlock} pointerEvents="auto">
              <SquishyButton onPress={() => {
                const el = document.getElementById('intro-video') as HTMLVideoElement | null;
                if (el) { el.muted = false; el.play().catch(() => {}); }
                setNeedsSoundUnlock(false);
              }} style={styles.modalButton}>
                <Text variant="header">Enable Sound</Text>
              </SquishyButton>
            </View>
          )}
        </View>
      ))}
      {stage !== 'video' && (
        <View style={styles.overlay}>
          <MarcieHost mode={'tap-watch'} size={160} float position={{ x: 24, y: 24 }} />
          <Animated.View style={logoFloatStyle}>
            <Image source={LOGO_IMAGES[0]} style={styles.logo} resizeMode="contain" accessibilityLabel="App Logo" alt="App Logo" />
          </Animated.View>
          <GradientHeading title1="Love, Actually... The Game" title2="How About We Don't Break Up?" />
          <View style={styles.authButtons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start Your Relationship Rehab"
              onPress={() => {
                Haptics.selectionAsync();
                onStart();
              }}
            >
              <LinearGradient colors={["#FA1F63", "#BE1980"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
                <Text variant="header">Start Your Relationship Rehab</Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="I Already Have an Account"
              onPress={() => {
                Haptics.selectionAsync();
                if (onLogin) onLogin(); else onStart();
              }}
              style={styles.secondaryBtn}
            >
              <Text variant="header">I Already Have an Account</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function GradientHeading({ title1, title2 }: { title1: string; title2: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Svg width={320} height={40}>
        <Defs>
          <SvgLinearGradient id="g" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FA1F63" />
            <Stop offset="1" stopColor="#5C1459" />
          </SvgLinearGradient>
        </Defs>
        <SvgText x={160} y={28} fontSize={22} fontFamily="BarbieDream-Regular" fill="url(#g)" textAnchor="middle">
          {title1}
        </SvgText>
      </Svg>
      <Svg width={360} height={40}>
        <Defs>
          <SvgLinearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FA1F63" />
            <Stop offset="1" stopColor="#5C1459" />
          </SvgLinearGradient>
        </Defs>
        <SvgText x={180} y={28} fontSize={20} fontFamily="Cheese-Regular" fill="url(#g2)" textAnchor="middle">
          {title2}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: { width: 300, height: 300 },
  skipBtn: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(26,10,31,0.8)', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 12 },
  loadingWrap: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },
  soundUnlock: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' },
  gradientText: {},
  authButtons: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', gap: 12 },
  primaryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(250, 31, 99, 0.2)', backgroundColor: 'transparent' },
  secondaryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, backgroundColor: 'rgba(26,10,31,0.8)', borderWidth: 1, borderColor: 'rgba(250, 31, 99, 0.2)' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '85%', backgroundColor: '#1a0a1f', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)' },
  modalButton: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
});
