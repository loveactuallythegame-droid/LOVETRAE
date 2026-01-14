import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, PanResponder, GestureResponderHandlers, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import { supabase, upsertProfile } from '../../lib/supabase';
import { encryptSensitive } from '../../lib/encryption';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type OriginStoryScreenProps = {
  onComplete: (diagnoses: Diagnosis[]) => void;
};

type Diagnosis = { title: string; description: string };

export default function OriginStoryScreen({ onComplete }: OriginStoryScreenProps) {
  const [step, setStep] = useState(0);
  const [story, setStory] = useState('');
  const [flag, setFlag] = useState('');
  const [score, setScore] = useState(5);
  const barX = useSharedValue(0);
  const sliderWidth = useRef(0);

  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.value = withTiming(x, { duration: 0 });
        setScore(Math.max(1, Math.min(10, Math.round((x / sliderWidth.current) * 10))));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.value = withTiming(x, { duration: 0 });
        setScore(Math.max(1, Math.min(10, Math.round((x / sliderWidth.current) * 10))));
      },
    }).panHandlers;
  }, []);

  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: Math.max(0, Math.min(barX.value, sliderWidth.current - 24)) }] }));

  useEffect(() => {
    const s = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) return;
    });
    return () => { s.data.subscription.unsubscribe(); };
  }, []);

  // Marcie states for valid steps: 0=Story, 1=RedFlag, 2=Slider
  const marcieMode = step === 1 ? 'lean' : step === 2 ? 'point' : 'idle';

  function next() {
    Haptics.selectionAsync();
    if (step < 2) {
      setStep(step + 1);
    } else {
      const session = supabase.auth.getSession();
      session.then(async ({ data }: any) => {
        const user = data.session?.user;
        if (user) {
          await upsertProfile({
            user_id: user.id,
            origin_story: encryptSensitive(story, user.id),
            first_red_flag: encryptSensitive(flag, user.id),
            relationship_score: score,
            sarcasm_level: 1,
          });
        }
      });
      onComplete(generateDiagnoses(story, flag, score));
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 0: // Meet Cute
        return {
          stepLabel: '1 of 3',
          progress: '33%',
          title: 'Step 1: Meet Cute',
          subtitle: 'Every great love story has a beginning. How did you two first meet?',
          inputLabel: 'OUR STORY',
          placeholder: 'It was a rainy Tuesday at a coffee shop... or maybe a digital spark?',
          value: story,
          setValue: setStory,
          isSlider: false
        };
      case 1: // Red Flag
        return {
          stepLabel: '2 of 3',
          progress: '66%',
          title: 'Step 2: First Red Flag',
          subtitle: 'When was the first time you thought "Uh oh"?',
          inputLabel: 'THE INCIDENT',
          placeholder: 'That time when...',
          value: flag,
          setValue: setFlag,
          isSlider: false
        };
      case 2: // Vibe Check
        return {
          stepLabel: '3 of 3',
          progress: '100%',
          title: 'Step 3: Current Vibe',
          subtitle: 'Scale of "The Notebook" to "Gone Girl"',
          inputLabel: 'RELATIONSHIP METER',
          placeholder: '',
          value: '',
          setValue: () => { },
          isSlider: true
        };
      default: return {};
    }
  };

  const content = getStepContent();

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      {/* Decorative Floating Icons */}
      <View style={styles.floatingContainer} pointerEvents="none">
        <Ionicons name="heart" size={40} color="rgba(192, 132, 252, 0.4)" style={{ position: 'absolute', top: 100, left: 40 }} />
        <Ionicons name="star" size={50} color="rgba(124, 58, 237, 0.3)" style={{ position: 'absolute', bottom: 200, left: 20, transform: [{ rotate: '12deg' }] }} />
        <Ionicons name="sparkles" size={30} color="rgba(250, 31, 99, 0.3)" style={{ position: 'absolute', top: 150, right: 30, transform: [{ rotate: '-12deg' }] }} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <Ionicons name="infinite" size={24} color="#FA1F63" />
                <Text variant="header" style={styles.logoText}>Love Actually...</Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text variant="keyword" style={styles.progressTitle}>THE JOURNEY BEGINS</Text>
                <Text variant="body" style={styles.progressCount}>{content.stepLabel}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: content.progress as any }]} />
              </View>
            </View>

            {/* Titles */}
            <View style={styles.titleContainer}>
              <Text variant="header" style={styles.title}>{content.title}</Text>
              <Text variant="body" style={styles.subtitle}>{content.subtitle}</Text>
            </View>

            {/* Marcie */}
            <View style={styles.marcieContainer}>
              <MarcieHost mode={marcieMode as any} size={150} float />
            </View>

            {/* Input Card */}
            <GlassCard style={styles.card}>
              {content.isSlider ? (
                <View style={styles.sliderSection}>
                  <Text variant="keyword" style={styles.label}>{content.inputLabel}</Text>
                  <View style={styles.sliderWrapper}>
                    <View style={styles.slider} onLayout={(e) => (sliderWidth.current = e.nativeEvent.layout.width)} {...pan}>
                      <View style={styles.track} />
                      <Animated.View style={[styles.knob, knob]} />
                    </View>
                    <View style={styles.scoreDisplay}>
                      <Text variant="header" style={styles.scoreText}>{score}/10</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.inputSection}>
                  <View style={styles.labelRow}>
                    <Text variant="keyword" style={styles.label}>{content.inputLabel}</Text>
                    <Text variant="body" style={styles.hint}>Take your time...</Text>
                  </View>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder={content.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={content.value}
                    onChangeText={content.setValue}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </GlassCard>

            {/* Footer */}
            <View style={styles.footer}>
              <SquishyButton onPress={next} style={styles.nextBtn}>
                <Text variant="header" style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </SquishyButton>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function generateDiagnoses(story: string, flag: string, score: number): Diagnosis[] {
  return [
    { title: 'Tough Love Rookie', description: 'Sarcasm level 1. Mild side-eye recommended.' },
    { title: 'Patterns on Parade', description: 'Noticing recurring themes. Clipboard tapping intensifies.' },
    { title: 'Trust Thermometer Flicker', description: `Score ${score}/10. Needs calibration.` },
  ];
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120016' },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  floatingContainer: { ...StyleSheet.absoluteFillObject },
  header: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { color: 'white', fontSize: 18 },
  progressContainer: { marginBottom: 30, gap: 10 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 2 },
  progressCount: { color: '#FA1F63', fontSize: 12, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#FA1F63', borderRadius: 3 },
  titleContainer: { alignItems: 'center', marginBottom: 20, gap: 10 },
  title: { fontSize: 32, textAlign: 'center', color: 'white' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#c084fc', lineHeight: 22, opacity: 0.9 },
  marcieContainer: { alignItems: 'center', height: 160, justifyContent: 'center', marginBottom: 10 },
  card: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(34, 16, 25, 0.6)', borderColor: 'rgba(192, 132, 252, 0.2)' },
  inputSection: { gap: 12 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  hint: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  textArea: { backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: 'white', fontSize: 16, minHeight: 150 },
  sliderSection: { gap: 20 },
  sliderWrapper: { alignItems: 'center' },
  slider: { width: '100%', height: 40, justifyContent: 'center' },
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, width: '100%', position: 'absolute' },
  knob: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FA1F63', shadowColor: '#FA1F63', shadowOpacity: 0.8, shadowRadius: 10 },
  scoreDisplay: { marginTop: 20 },
  scoreText: { fontSize: 40, color: 'white' },
  footer: { marginTop: 30, alignItems: 'flex-end' },
  nextBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(250, 31, 99, 0.5)', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 10 },
  nextBtnText: { color: 'white', fontSize: 18 }
});
