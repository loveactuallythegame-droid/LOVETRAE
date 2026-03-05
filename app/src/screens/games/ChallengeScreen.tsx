import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, AppState, Image } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiBurst from '../../components/effects/ConfettiBurst';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../state/store';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

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
    if (s > 75) return sarcasm > 1 ? "That's almost mature. Keep going." : "Solid depth and honesty — nice work.";
    if (s > 50) return sarcasm > 1 ? "We're approaching real growth. Shocking." : "Good direction — add specifics.";
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
    setTimeout(() => setShowConfetti(false), ANIMATIONS.duration.slower);
    useAppStore.getState().setGameInProgress(false);
    navigation.replace('Dashboard');
  }

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');
  const warn = remaining <= 120;
  const barProgress = Math.round(((questionIndex + 1) / 3) * 100);
  const focusStyle = focused ? styles.inputFocus : undefined;

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={{ flex: 1, padding: SPACING.regular, gap: SPACING.small }}>
        <GlassCard>
          {/* Dr. Marcie Section */}
          <View style={styles.drMarcieSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
            </View>
            <View style={styles.quoteBox}>
              <Typography variant="body">Deepen your connection through honest reflection! Share vulnerably and authentically.</Typography>
            </View>
          </View>

          <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
          <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

          <View style={styles.header}>
            <SquishyButton onPress={() => navigation.goBack()} style={styles.back}>
              <Typography variant="body">Back</Typography>
            </SquishyButton>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="caption" accessibilityLiveRegion="polite" style={{ color: warn ? COLORS.error : COLORS.success }}>{mm}:{ss}</Typography>
          </View>
          <View style={styles.progress}>
            <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressFill}>
              <View style={{ width: `${barProgress}%`, height: '100%' }} />
            </LinearGradient>
            <Typography variant="caption">Question {questionIndex + 1} of 3</Typography>
          </View>
          <View style={{ marginTop: SPACING.small }}>
            <Typography variant="h2">{questions[questionIndex].title}</Typography>
            <Typography variant="body">{questions[questionIndex].text}</Typography>
            <Typography variant="body" style={{ opacity: 0.8 }}>{questions[questionIndex].desc}</Typography>
          </View>
          <View style={{ marginTop: SPACING.small }}>
            <TextInput
              value={answer}
              onChangeText={onAnswerChange}
              placeholder="Type your reflection…"
              multiline
              style={[styles.input, focusStyle]}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <Typography variant="caption" style={{ alignSelf: 'flex-end' }}>{answer.length}/500</Typography>
          </View>
          {!!score && (
            <View style={{ marginTop: SPACING.small }}>
              <Typography variant="h2">Honesty Score</Typography>
              <Typography variant="body" style={{ color: score > 75 ? COLORS.mintGreen : score > 50 ? COLORS.brightYellow : COLORS.error }}>{score}</Typography>
            </View>
          )}
          {!!commentary && (
            <View style={{ marginTop: SPACING.small }}>
              <Typography variant="body" style={{ fontStyle: 'italic' }}>{commentary}</Typography>
            </View>
          )}
          <View style={{ marginTop: SPACING.regular }}>
            <SquishyButton onPress={nextQuestion}>
              <Typography variant="button" style={{ color: COLORS.textPrimary }}>{questionIndex < 2 ? 'Next' : 'Submit'}</Typography>
            </SquishyButton>
          </View>
        </GlassCard>
        {showConfetti && <ConfettiBurst onEnd={() => setShowConfetti(false)} />}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  back: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: 'rgba(219, 20, 124, 0.3)', 
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.5)',
  },
  progress: { 
    height: SPACING.regular, 
    backgroundColor: 'rgba(18, 0, 22, 0.5)', 
    borderRadius: BORDER_RADIUS.round, 
    overflow: 'hidden', 
    marginTop: SPACING.small, 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  progressFill: { 
    position: 'absolute', 
    left: 0, 
    top: 0, 
    bottom: 0,
    width: '100%',
  },
  input: { 
    minHeight: 128, 
    backgroundColor: 'rgba(26, 10, 31, 0.5)', 
    borderWidth: 1, 
    borderColor: 'rgba(219, 20, 124, 0.3)', 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.small, 
    color: COLORS.textPrimary, 
    textAlignVertical: 'top',
  },
  inputFocus: { borderColor: COLORS.gradientStart },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular
  },
  avatarContainer: {
    width: SPACING.xxlarge + SPACING.medium,
    height: SPACING.xxlarge + SPACING.medium,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular
  },
  avatar: {
    width: SPACING.xxlarge,
    height: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
});
