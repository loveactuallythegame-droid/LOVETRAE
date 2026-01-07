import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import { supabase, upsertProfile } from '../../lib/supabase';
import { encryptSensitive } from '../../lib/encryption';

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
    const s = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
    });
    return () => { s.data.subscription.unsubscribe(); };
  }, []);

  const marcieMode = step === 2 ? 'lean' : step === 4 ? 'point' : 'idle';

  function next() {
    if (step < 4) setStep(step + 1);
    else {
      const session = supabase.auth.getSession();
      session.then(async ({ data }) => {
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

  return (
    <View style={{ flex: 1 }}>
      <MarcieHost mode={marcieMode as any} size={240} float ctaTarget={{ x: 320, y: 620 }} inputTarget={{ x: 80, y: 480 }} />
      <View style={{ padding: 16, gap: 12 }}>
        <GlassCard>
          {step === 0 && <Text variant="sass">Okay, spill. How did this... *gestures at you two*... happen?</Text>}
          {step === 1 && (
            <View>
              <Text variant="body">We met at...</Text>
              <TextInput placeholder="We met at..." style={styles.input} value={story} onChangeText={setStory} />
              <Text variant="keyword">{story.length} chars</Text>
              <Reaction text={story} />
            </View>
          )}
          {step === 2 && <Text variant="sass">When was the first time you thought 'Uh oh'?</Text>}
          {step === 3 && (
            <View>
              <Text variant="body">Tell me about the first red flag</Text>
              <TextInput placeholder="That time when..." style={styles.input} value={flag} onChangeText={setFlag} />
              <Text variant="keyword">{flag.length} chars</Text>
            </View>
          )}
          {step === 4 && (
            <View>
              <Text variant="body">Scale of 'Notebook' to 'Gone Girl'</Text>
              <View style={styles.slider} onLayout={(e) => (sliderWidth.current = e.nativeEvent.layout.width)} {...pan}>
                <Animated.View style={[styles.knob, knob]} />
              </View>
              <Text variant="keyword">{score}</Text>
            </View>
          )}
        </GlassCard>
        <SquishyButton onPress={next} style={styles.nextBtn}>
          <Text variant="header">Next</Text>
        </SquishyButton>
      </View>
    </View>
  );
}

function Reaction({ text }: { text: string }) {
  const t = text.toLowerCase();
  const reaction = t.includes('tinder')
    ? 'Ah, the swipe heard round the world.'
    : t.includes('work')
    ? "Work romance? HR's favorite genre."
    : t.includes('bar')
    ? 'Bar meet-cute with a twist of lime.'
    : '';
  return reaction ? <Text variant="sass">{reaction}</Text> : null;
}

function generateDiagnoses(story: string, flag: string, score: number): Diagnosis[] {
  return [
    { title: 'Tough Love Rookie', description: 'Sarcasm level 1. Mild side-eye recommended.' },
    { title: 'Patterns on Parade', description: 'Noticing recurring themes. Clipboard tapping intensifies.' },
    { title: 'Trust Thermometer Flicker', description: `Score ${score}/10. Needs calibration.` },
  ];
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff' },
  slider: { height: 24, backgroundColor: '#120016', borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FA1F63' },
  nextBtn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#5C1459', borderRadius: 12 },
});
