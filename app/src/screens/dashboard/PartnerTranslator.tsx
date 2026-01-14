import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { MarcieHost } from '../../components/ai-host';
import { speakMarcie } from '../../lib/voice-engine';
import { analyzeFight, generateQuestions } from '../../lib/ai-engine';
import { getProfile, supabase } from '../../lib/supabase';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { setJSON, getJSON } from '../../lib/cache';
import { LinearGradient } from 'expo-linear-gradient';

export default function PartnerTranslator({ navigation }: any) {
  const [desc, setDesc] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<{ translation: string; plan: string[] } | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const flip = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotateY: `${flip.value * 180}deg` }] }));
  const [showQs, setShowQs] = useState(false);

  useEffect(() => { getJSON('translator_report_done', false).then(setReportDone); }, []);

  async function startInvestigation() {
    if (desc.trim().length < 10) {
      speakMarcie('Give me a bit more context. Describe what happened.');
      return;
    }
    setLoading(true);
    speakMarcie('Investigating... hold tight.');

    // AI Generate Questions
    const generatedQs = await generateQuestions(desc);
    setQs(generatedQs);
    setLoading(false);
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
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const prof = user ? await getProfile(user.id) : null;
    const origin = prof?.data?.origin_story || '';
    const red = prof?.data?.first_red_flag || '';

    // Construct a rich input for the AI
    const qAndA = qs.map((q, i) => `Q: ${q} A: ${list[i] ? 'Yes' : 'No'}`).join('\n');
    const aInput = `Situation: ${desc}\nContext:\n${qAndA}`;

    const verdict = await analyzeFight({
      origin_story: origin,
      first_red_flag: red,
      partner_a_input: aInput,
      partner_b_input: '{}',
      personality: 'balanced',
      sarcasm_level: 2
    });

    const translation = verdict.callout.join(' ');
    const plan = verdict.repairs_a;

    setResult({ translation, plan });
    setLoading(false);
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
        {!result && !showQs && (
          <Text variant="body">Describe the conflict. I'll translate their nonsense into logic.</Text>
        )}

        {!showQs && !result && (
          <TextInput
            placeholder="My partner said they're 'fine' but slammed the door..."
            style={[styles.input, focused ? styles.inputFocus : undefined]}
            value={desc}
            onChangeText={(t) => setDesc(t.slice(0, 500))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel="Describe behavior"
            multiline
          />
        )}

        {!showQs && !result && (
          <View style={styles.counterRow}>
            <SquishyButton onPress={() => setDesc('')} style={styles.clear}><Text variant="header">Clear</Text></SquishyButton>
            <Text variant="keyword">{desc.length}/500</Text>
          </View>
        )}

        {loading && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FA1F63" />
            <Text variant="body" style={{ marginTop: 10 }}>Analyzing conversational ballistics...</Text>
          </View>
        )}

        {!result && !showQs && !loading && (
          <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
            <SquishyButton onPress={startInvestigation} style={{ backgroundColor: 'transparent' }}><Text variant="header">Start Investigation</Text></SquishyButton>
          </LinearGradient>
        )}

        {!result && showQs && !loading && qs.length > 0 && (
          <View style={styles.cardsRow}>
            <Text variant="body" style={{ marginBottom: 12, textAlign: 'center' }}>CLARIFYING QUESTION {qIndex + 1}/{qs.length}</Text>
            <View style={styles.card}>
              <Text variant="body" style={{ fontSize: 18, textAlign: 'center' }}>{qs[qIndex]}</Text>
              <View style={styles.actions}>
                <SquishyButton onPress={() => next(true)} style={styles.btn}><Text variant="header">YES</Text></SquishyButton>
                <SquishyButton onPress={() => next(false)} style={[styles.btn, { backgroundColor: '#E11637' }]}><Text variant="header">NO</Text></SquishyButton>
              </View>
            </View>
          </View>
        )}

        {result && (
          <Animated.View style={[styles.translation, style]}>
            <LinearGradient colors={['rgba(51, 222, 165, 0.18)', 'rgba(190, 24, 128, 0.18)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.translationGrad}>
              <Text variant="header" style={{ marginBottom: 8, color: '#33DEA5' }}>OFFICIAL TRANSLATION</Text>
              <Text variant="sass" style={{ textAlign: 'center', fontSize: 20, lineHeight: 28 }}>"{result.translation}"</Text>

              <Text variant="header" style={{ marginTop: 20, marginBottom: 8 }}>RECOMMENDED ACTION PLAN</Text>
              {result.plan.map((p, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text variant="keyword" style={{ marginRight: 8 }}>{i + 1}.</Text>
                  <Text variant="body" style={{ flex: 1 }}>{p}</Text>
                </View>
              ))}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, justifyContent: 'center' }}>
                <SquishyButton onPress={markReported} style={[styles.btn, { opacity: reportDone ? 0.5 : 1 }]} disabled={reportDone}>
                  <Text variant="header">{reportDone ? 'Reported' : 'Report Success'}</Text>
                </SquishyButton>
                <SquishyButton onPress={() => { setShowQs(false); setResult(null); setDesc(''); }} style={[styles.btn, { backgroundColor: '#5C1459' }]}>
                  <Text variant="header">New Case</Text>
                </SquishyButton>
              </View>
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
