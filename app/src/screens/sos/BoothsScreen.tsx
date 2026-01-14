import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';
import { Text, SquishyButton, GlassCard, RadialGradientBackground } from '../../components/ui';
import { createFight, updateFight, subscribeFight, supabase } from '../../lib/supabase';
import * as Network from 'expo-network';
import { LinearGradient } from 'expo-linear-gradient';
import { encryptSensitive } from '../../lib/encryption';
import { setJSON, getJSON } from '../../lib/cache';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarcieHost } from '../../components/ai-host';

type BoothsScreenProps = {
  navigation: any;
};

export default function BoothsScreen({ navigation }: BoothsScreenProps) {
  const [feeling, setFeeling] = useState('hurt');
  const [action, setAction] = useState('');
  const [story, setStory] = useState('');
  const [need, setNeed] = useState('');
  const [honesty, setHonesty] = useState(0);
  const [fightId, setFightId] = useState<string | null>(null);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [offline, setOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Network.getNetworkStateAsync().then((s) => setOffline(!(s.isConnected && s.isInternetReachable)));
  }, []);

  useEffect(() => {
    // Simple honesty heuristic
    const total = action.length + story.length + need.length;
    const iWords = (action + ' ' + story + ' ' + need).toLowerCase().split(' ').filter((w) => w === 'i' || w === 'we').length;
    const blameWords = ['always', 'never', 'you', 'fault'];
    const blame = blameWords.reduce((acc, w) => acc + ((action + story).toLowerCase().includes(w) ? 1 : 0), 0);

    // Score calculation
    let score = Math.min(100, Math.round((total / 150) * 40)); // Length points capped
    score += Math.min(30, iWords * 5); // "I" statements bonus
    score -= Math.min(40, blame * 10); // Blame penalty

    setHonesty(Math.max(0, Math.min(100, score)));
  }, [action, story, need]);

  useEffect(() => {
    // Check if there's an active fight or create one
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();

      if (profile?.couple_code) {
        // In a real app we might check for existing open fights first
        const fight = await createFight(profile.couple_code);
        setFightId(fight.id);

        subscribeFight(fight.id, (payload) => {
          if (payload.new?.partner_b_input) setPartnerJoined(true); // Assuming we are A, simplify for now
        });
      }
    });
  }, []);

  async function submit() {
    if (!fightId) return;
    setSubmitting(true);

    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;

    const enc = user ? {
      feeling,
      action: encryptSensitive(action, user.id),
      story: encryptSensitive(story, user.id),
      need: encryptSensitive(need, user.id),
      honesty,
    } : { feeling, action, story, need, honesty };

    const payload = JSON.stringify(enc);

    try {
      if (offline) {
        await setJSON(`sos_payload_${fightId}`, payload);
      } else {
        await updateFight(fightId, { partner_a_input: payload }); // Again assuming A role for simplicity in this demo
        // Clear local cache if any
        await setJSON(`sos_payload_${fightId}`, null);
      }
      navigation.replace('SOSCoolDown', { fightId });
    } catch (e) {
      console.error(e);
      // Navigate anyway for demo flow
      navigation.replace('SOSCoolDown', { fightId });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll}>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Ionicons name="warning" size={24} color="#E11637" />
              </View>
              <View>
                <Text variant="header" style={styles.headerTitle}>EMERGENCY BOOTH</Text>
                <Text variant="body" style={styles.headerSub}>Zone of Safety & Radical Honesty</Text>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                {partnerJoined && <View style={styles.badge}><Text variant="keyword" style={{ fontSize: 10, color: '#33DEA5' }}>PARTNER HERE</Text></View>}
              </View>
            </View>

            {/* Main Form */}
            <GlassCard style={styles.formCard}>
              <View style={styles.section}>
                <Text variant="keyword" style={styles.label}>I feel...</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={feeling}
                    onValueChange={(v) => setFeeling(v)}
                    style={{ color: 'white' }}
                    dropdownIconColor="white"
                  >
                    {['hurt', 'angry', 'frustrated', 'disappointed', 'confused', 'betrayed', 'ignored', 'stressed', 'sad'].map((f) => (
                      <Picker.Item key={f} label={f.toUpperCase()} value={f} color={Platform.OS === 'ios' ? 'white' : '#000'} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.section}>
                <Text variant="keyword" style={styles.label}>When you...</Text>
                <TextInput
                  placeholder="Describe the specific action (no adjectives)"
                  style={styles.input}
                  value={action}
                  onChangeText={setAction}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                />
              </View>

              <View style={styles.section}>
                <Text variant="keyword" style={styles.label}>The story I tell myself is...</Text>
                <TextInput
                  placeholder="Your interpretation (be vulnerable)"
                  style={styles.input}
                  value={story}
                  onChangeText={setStory}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                />
              </View>

              <View style={styles.section}>
                <Text variant="keyword" style={styles.label}>What I actually need is...</Text>
                <TextInput
                  placeholder="A concrete, positive request"
                  style={styles.input}
                  value={need}
                  onChangeText={setNeed}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                />
              </View>

              {/* Honesty Meter */}
              <View style={styles.meterContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text variant="body" style={{ fontSize: 12 }}>Vulnerability Score</Text>
                  <Text variant="keyword" style={{ color: honesty > 80 ? '#33DEA5' : honesty > 50 ? '#FFC107' : '#E11637' }}>{honesty}/100</Text>
                </View>
                <View style={styles.track}>
                  <LinearGradient
                    colors={honesty > 80 ? ['#33DEA5', '#2A9D8F'] : honesty > 50 ? ['#FFC107', '#FF9800'] : ['#E11637', '#B71C1C']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.bar, { width: `${honesty}%` }]}
                  />
                </View>
                <Text variant="sass" style={{ fontSize: 10, marginTop: 4, textAlign: 'right' }}>
                  {honesty < 50 ? "Are you blaming? Try asking for what you need." : "Good. Keep it about your feelings."}
                </Text>
              </View>

              <SquishyButton onPress={submit} disabled={submitting || honesty < 30} style={[styles.submitBtn, honesty < 30 ? { opacity: 0.5 } : {}]}>
                {submitting ? <ActivityIndicator color="white" /> : <Text variant="header">Enter Cool-Down</Text>}
              </SquishyButton>
            </GlassCard>

            {/* Marcie */}
            <View style={styles.marcieContainer}>
              <MarcieHost mode="idle" size={120} float position={{ x: 0, y: 0 }} />
              <GlassCard style={styles.bubble}>
                <Text variant="body" style={{ fontSize: 12, fontStyle: 'italic' }}>
                  "The goal isn't to win. It's to understand. But winning is nice too. Just kidding. (Mostly)."
                </Text>
              </GlassCard>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {offline && <View style={styles.offlineBanner}><Text variant="body">Offline Mode</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0708' },
  scroll: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(225, 22, 55, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E11637' },
  headerTitle: { color: '#E11637', fontSize: 20, letterSpacing: 1 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(51, 222, 165, 0.2)', borderRadius: 8, borderWidth: 1, borderColor: '#33DEA5' },

  formCard: { padding: 20, gap: 20 },
  section: { gap: 8 },
  label: { fontSize: 12, color: '#40e0d0', letterSpacing: 1 },
  pickerWrapper: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, color: 'white', fontSize: 16, minHeight: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

  meterContainer: { marginTop: 10 },
  track: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  bar: { height: '100%' },

  submitBtn: { marginTop: 10, backgroundColor: '#E11637', height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  marcieContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 20 },
  bubble: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  offlineBanner: { position: 'absolute', top: 0, left: 0, right: 0, height: 20, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center' }
});
