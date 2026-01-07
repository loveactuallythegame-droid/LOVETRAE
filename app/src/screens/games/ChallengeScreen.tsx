import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, AppState } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiBurst from '../../components/effects/ConfettiBurst';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../state/store';

export default function ChallengeScreen({ route, navigation }: any) {
  const { title = 'Truth or Trust', duration = 600 } = route.params || {};
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const [answer, setAnswer] = useState('');
  const [focused, setFocused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [commentary, setCommentary] = useState<string>('');
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { sarcasmLevel, setTrust, setVulnerability, addPoints } = useAppStore((s) => ({
    sarcasmLevel: s.sarcasmLevel,
    setTrust: s.setTrust,
    setVulnerability: s.setVulnerability,
    addPoints: s.addPoints,
  }));

  const questions = useMemo(() => [
    { title: 'Question 1 of 3', text: 'Describe a moment you chose honesty over comfort.', desc: 'Be specific and include feelings.' },
    { title: 'Question 2 of 3', text: 'What truth do you avoid and why?', desc: 'Use emotional vocabulary.' },
    { title: 'Question 3 of 3', text: 'How will you repair trust this week?', desc: 'Include concrete actions.' },
  ], []);

  useEffect(() => {
    startTimer();
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') pauseTimer(); else resumeTimer();
    });
    useAppStore.getState().setGameInProgress(true);
    return () => { clearTimer(); sub.remove(); clearInactivity(); };
  }, []);

  function clearTimer() { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } }
  function startTimer() {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining((r: number) => {
        const next = Math.max(0, r - 1);
        if (next === 0) { clearTimer(); doSubmit(true); }
        return next;
      });
    }, 1000);
  }
  function pauseTimer() { setPaused(true); clearTimer(); }
  function resumeTimer() { if (paused) { setPaused(false); startTimer(); } }

  function onAnswerChange(t: string) {
    setAnswer(t.slice(0, 500));
    resetInactivity();
    if (t.length >= 50) setScore(calcHonestyScore(t));
  }

  function resetInactivity() {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      const c = genCommentary(answer, remaining, sarcasmLevel);
      setCommentary(c);
    }, 15000);
  }
  function clearInactivity() { if (inactivityRef.current) { clearTimeout(inactivityRef.current); inactivityRef.current = null; } }

  function calcHonestyScore(text: string): number {
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const emotional = ['sad', 'angry', 'afraid', 'anxious', 'hurt', 'ashamed', 'guilty', 'jealous', 'lonely', 'resentful', 'regret', 'love', 'trust', 'vulnerable'];
    const emoHits = words.filter((w) => emotional.includes(w.toLowerCase())).length;
    const depthSignals = (text.match(/[.,;:!?]/g) || []).length + (text.match(/\b(because|therefore|however|honestly|truthfully)\b/gi) || []).length;
    let raw = 0;
    raw += Math.min(50, wordCount); // up to 50 points for word count
    raw += emoHits * 5; // emotional vocabulary
    raw += Math.min(20, depthSignals * 4); // depth
    return Math.min(100, Math.round(raw));
  }

  function genCommentary(text: string, time: number, sarcasm: number): string {
    const len = text.length;
    if (time < 120) return sarcasm > 1 ? "Tick-tock honesty o'clock. Use words, not dramatic sighs." : "Two minutes left — be clear and kind.";
    if (len < 50) return sarcasm > 1 ? "Vibes aren't details. Try sentences." : "Add a bit more detail for clarity.";
    const s = calcHonestyScore(text);
    if (s > 75) return sarcasm > 1 ? "That’s almost mature. Keep going." : "Solid depth and honesty — nice work.";
    if (s > 50) return sarcasm > 1 ? "We’re approaching real growth. Shocking." : "Good direction — add specifics.";
    return sarcasm > 1 ? "Honesty-lite: great taste, less substance." : "Try naming feelings and actions.";
  }

  function nextQuestion() {
    if (questionIndex < 2) {
      setQuestionIndex(questionIndex + 1);
      setAnswer('');
      setScore(null);
      setCommentary('');
    } else {
      doSubmit(false);
    }
  }

  function doSubmit(auto: boolean) {
    const valid = answer.trim().length >= 50;
    const finalScore = calcHonestyScore(answer);
    if (!valid && !auto) {
      setCommentary("Minimum 50 words required. Try naming feelings and actions.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const trustDelta = Math.min(0.08, finalScore / 800);
    const vulnDelta = Math.min(0.06, finalScore / 900);
    const current = useAppStore.getState();
    setTrust(current.trustLevel + trustDelta);
    setVulnerability(current.vulnerabilityLevel + vulnDelta);
    addPoints(Math.round(finalScore));
    setShowConfetti(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setShowConfetti(false), 1500);
    useAppStore.getState().setGameInProgress(false);
    navigation.replace('Dashboard');
  }

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');
  const warn = remaining <= 120;
  const barProgress = Math.round(((questionIndex + 1) / 3) * 100);
  const focusStyle = focused ? styles.inputFocus : undefined;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <GlassCard>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Back</Text></SquishyButton>
          <Text variant="header">{title}</Text>
          <Text variant="keyword" accessibilityLiveRegion="polite" style={{ color: warn ? '#E11637' : '#33DEA5' }}>{mm}:{ss}</Text>
        </View>
        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: `${barProgress}%` }]} />
          <Text variant="body">Question {questionIndex + 1} of 3</Text>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text variant="header">{questions[questionIndex].title}</Text>
          <Text variant="body">{questions[questionIndex].text}</Text>
          <Text variant="body" style={{ opacity: 0.8 }}>{questions[questionIndex].desc}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <TextInput
            value={answer}
            onChangeText={onAnswerChange}
            placeholder="Type your reflection…"
            multiline
            style={[styles.input, focusStyle]}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Text variant="keyword" style={{ alignSelf: 'flex-end' }}>{answer.length}/500</Text>
        </View>
        {!!score && (
          <View style={{ marginTop: 8 }}>
            <Text variant="header">Honesty Score</Text>
            <Text variant="body" style={{ color: score > 75 ? '#33DEA5' : score > 50 ? '#E4E831' : '#E11637' }}>{score}</Text>
          </View>
        )}
        {!!commentary && (
          <View style={{ marginTop: 8 }}>
            <Text variant="sass">{commentary}</Text>
          </View>
        )}
        <View style={{ marginTop: 12 }}>
          <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
            <SquishyButton onPress={nextQuestion} style={{ backgroundColor: 'transparent' }}>
              <Text variant="header">{questionIndex < 2 ? 'Next' : 'Submit'}</Text>
            </SquishyButton>
          </LinearGradient>
        </View>
      </GlassCard>
      {showConfetti && <ConfettiBurst onEnd={() => setShowConfetti(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
  progress: { height: 16, backgroundColor: '#120016', borderRadius: 8, overflow: 'hidden', marginTop: 8, justifyContent: 'center' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(250,31,99,0.35)' },
  input: { minHeight: 128, backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', textAlignVertical: 'top' },
  inputFocus: { borderColor: '#FA1F63' },
  primaryBtn: { borderRadius: 20, overflow: 'hidden' },
});
