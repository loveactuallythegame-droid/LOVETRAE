import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import { speakMarcie } from '../../lib/voice-engine';
import { analyzeFight } from '../../lib/ai-engine';
import { getProfile, supabase } from '../../lib/supabase';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { setJSON, getJSON } from '../../lib/cache';
import { LinearGradient } from 'expo-linear-gradient';

export default function PartnerTranslator({ navigation }: any) {
  const [desc, setDesc] = useState('');
  const [focused, setFocused] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<{ translation: string; plan: string[] } | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const flip = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotateY: `${flip.value * 180}deg` }] }));
  const [showQs, setShowQs] = useState(false);
  const qs = useMemo(() => {
    const base = [
      'Is this a recurring behavior?',
      'Did they acknowledge your feeling?',
      'Did you state a clear need?'
    ];
    const t = desc.toLowerCase();
    const extra: string[] = [];
    if (t.includes('clean') || t.includes('chores')) extra.push('Was there a clear expectation set beforehand?');
    if (t.includes('text') || t.includes('message')) extra.push('Did you communicate timing expectations explicitly?');
    if (t.includes('money') || t.includes('spent')) extra.push('Did you agree on boundaries for this?');
    return [...base.slice(0, 3 - Math.min(2, extra.length)), ...extra.slice(0, 2)];
  }, [desc]);

  useEffect(() => { getJSON('translator_report_done', false).then(setReportDone); }, []);

  function startInvestigation() {
    if (desc.trim().length < 20) {
      speakMarcie('Give me something to work with. At least a sentence or two.');
      return;
    }
    speakMarcie('Time to decode some relationship hieroglyphics, I see.');
    setShowQs(true);
    setQIndex(0);
    setAnswers([]);
  }

  async function next(val: boolean) {
    const list = [...answers, val];
    setAnswers(list);
    if (qIndex < qs.length - 1) setQIndex(qIndex + 1);
    else await translate(list);
  }

  async function translate(list: boolean[]) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const prof = user ? await getProfile(user.id) : null;
    const origin = prof?.data?.origin_story || '';
    const red = prof?.data?.first_red_flag || '';
    const a = JSON.stringify({ behavior: desc, q: list });
    const verdict = await analyzeFight({ origin_story: origin, first_red_flag: red, partner_a_input: a, partner_b_input: '{}', personality: 'balanced', sarcasm_level: 2 });
    const translation = verdict.callout.join(' ');
    const plan = verdict.repairs_a;
    setResult({ translation, plan });
    speakMarcie(translation);
    await setJSON('translator_last_input', { desc, questions: qs, answers: list });
    await setJSON('translator_last_result', { translation, plan });
    flip.value = withTiming(1, { duration: 600 });
  }

  async function markReported() {
    setReportDone(true);
    await setJSON('translator_report_done', true);
  }

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Back</Text></SquishyButton>
        <Text variant="header">Partner Translator</Text>
        <Text variant="keyword">🌐</Text>
      </View>
      <GlassCard>
        <Text variant="body">Time to decode some relationship hieroglyphics, I see.</Text>
        <TextInput
          placeholder="My girlfriend is mad because she was cleaning and I didn't lift my feet..."
          style={[styles.input, focused ? styles.inputFocus : undefined]}
          value={desc}
          onChangeText={(t) => setDesc(t.slice(0, 500))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel="Describe behavior"
          multiline
        />
        <View style={styles.counterRow}>
          <SquishyButton onPress={() => setDesc('')} style={styles.clear}><Text variant="header">Clear</Text></SquishyButton>
          <Text variant="keyword">{desc.length}/500</Text>
        </View>
        {!result && !showQs && (
          <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
            <SquishyButton onPress={startInvestigation} style={{ backgroundColor: 'transparent' }}><Text variant="header">Start Investigation</Text></SquishyButton>
          </LinearGradient>
        )}
        {!result && showQs && (
          <View style={styles.cardsRow}>
            <Pressable style={[styles.card, answers[qIndex] !== undefined ? styles.answered : undefined]}>
              <Text variant="body">{qs[qIndex]}</Text>
              <View style={styles.actions}>
                <SquishyButton onPress={() => next(true)} style={styles.btn}><Text variant="header">Yes</Text></SquishyButton>
                <SquishyButton onPress={() => next(false)} style={[styles.btn, { backgroundColor: '#E11637' }]}><Text variant="header">No</Text></SquishyButton>
              </View>
            </Pressable>
          </View>
        )}
        {result && (
          <Animated.View style={[styles.translation, style]}>
            <LinearGradient colors={['rgba(51, 222, 165, 0.18)', 'rgba(190, 24, 128, 0.18)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.translationGrad}>
              <Text variant="header">Translation</Text>
              <Text variant="sass" style={{ textAlign: 'center' }}>{result.translation}</Text>
              <Text variant="header" style={{ marginTop: 12 }}>Action Plan</Text>
              {result.plan.map((p, i) => (<Text key={i} variant="body">• {p}</Text>))}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <SquishyButton onPress={markReported} style={styles.btn}><Text variant="header">Report back</Text></SquishyButton>
                <SquishyButton onPress={() => navigation.goBack()} style={styles.btn}><Text variant="header">Done</Text></SquishyButton>
              </View>
              <Text variant="keyword" style={{ marginTop: 8 }}>{reportDone ? 'Reported' : 'Not reported'}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8, minHeight: 128, textAlignVertical: 'top' },
  inputFocus: { borderColor: '#FA1F63' },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  clear: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
  cardsRow: { marginTop: 12 },
  card: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)' },
  answered: { borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'center' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
  translation: { marginTop: 12 },
  translationGrad: { padding: 12, borderRadius: 12 },
  primaryBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 8 },
});
