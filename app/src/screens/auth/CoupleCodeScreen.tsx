import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Animated as RNAnimated, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { supabase, upsertProfile, linkPartnersTransactional, subscribeCouple, getProfile } from '../../lib/supabase';
import { MarcieHost } from '../../components/ai-host';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

type CoupleCodeScreenProps = {
  onNext: (code: string) => void;
};

export default function CoupleCodeScreen({ onNext }: CoupleCodeScreenProps) {
  const [code, setCode] = useState(generateCoupleCode());
  const [partnerCode, setPartnerCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    let sub: any;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user) {
        await upsertProfile({ user_id: user.id, couple_code: code });

        // Listen for incoming connection
        sub = await subscribeCouple(code, async () => {
          const me = await getProfile(user.id);
          if (me.data?.partner_id) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onNext(code);
          }
        });
      }
    };

    init();

    // Pulse animation
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start();

    return () => { if (sub) supabase.removeChannel(sub); };
  }, [code]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handlePartnerCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      const newCode = [...partnerCode];
      for (let i = 0; i < Math.min(text.length, 6 - index); i++) {
        newCode[index + i] = text[i];
      }
      setPartnerCode(newCode);
      if (index + text.length < 6) {
        inputs.current[index + text.length]?.focus();
      } else {
        inputs.current[index]?.blur();
      }
      return;
    }

    const newCode = [...partnerCode];
    newCode[index] = text;
    setPartnerCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const connectSignal = async () => {
    Haptics.selectionAsync();
    const fullCode = partnerCode.join('');
    if (fullCode.length !== 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'Please enter a full 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) throw new Error('Not authenticated');

      // Check if partner exists with this code
      const { data: partners, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('couple_code', fullCode)
        .neq('user_id', user.id);

      if (error || !partners || partners.length === 0) {
        throw new Error('Partner code not found. Check the code and try again.');
      }

      const partner = partners[0];
      await linkPartnersTransactional(user.id, partner.user_id, fullCode);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onNext(fullCode);

    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Connection Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text variant="keyword" style={styles.headerTitle}>CONNECTION SYNC</Text>
              <Text variant="body" style={styles.phaseText}>PHASE 1 / 5</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient colors={['#40e0d0', '#ffd700', '#ff8c00', '#ff1493', '#8a2be2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '20%', height: '100%' }} />
            </View>
          </View>

          <View style={styles.titleSec}>
            <Text variant="header" style={styles.mainTitle}>Couple Linking</Text>
            <Text variant="body" style={styles.subSubtitle}>Resonate your frequencies to begin.</Text>
          </View>

          <MarcieHost mode="lean" size={140} float position={{ x: 20, y: 0 }} />

          <View style={styles.cardsContainer}>
            {/* Your Frequency */}
            <GlassCard style={styles.card}>
              <Ionicons name="wifi" size={32} color="rgba(64, 224, 208, 0.5)" style={{ alignSelf: 'center' }} />
              <Text variant="keyword" style={styles.cardHeader}>YOUR FREQUENCY</Text>
              <Text variant="header" style={styles.codeDisplay}>{code}</Text>
              <SquishyButton style={styles.copyBtn} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={18} color="white" />
                <Text variant="body" style={{ color: 'white' }}>COPY CODE</Text>
              </SquishyButton>
            </GlassCard>

            {/* Partner Code */}
            <GlassCard style={styles.card}>
              <Ionicons name="link" size={32} color="rgba(255, 20, 147, 0.5)" style={{ alignSelf: 'center' }} />
              <Text variant="keyword" style={styles.cardHeader}>ENTER PARTNER'S CODE</Text>

              <View style={styles.inputRow}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <TextInput
                    key={i}
                    ref={r => { inputs.current[i] = r; }}
                    style={styles.codeDigit}
                    maxLength={1}
                    value={partnerCode[i]}
                    onChangeText={(t) => handlePartnerCodeChange(t, i)}
                    keyboardType="default"
                    autoCapitalize="characters"
                    placeholder="•"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    editable={!loading}
                  />
                ))}
              </View>

              <SquishyButton style={styles.connectBtn} onPress={connectSignal} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : (
                  <>
                    <Text variant="header" style={{ color: 'white', fontSize: 16 }}>CONNECT SIGNAL</Text>
                    <Ionicons name="heart" size={20} color="#ff1493" />
                  </>
                )}
              </SquishyButton>
            </GlassCard>
          </View>

          <View style={styles.waiting}>
            <View style={styles.pulseContainer}>
              <View style={styles.dot} />
              <View style={[styles.dotPing, { position: 'absolute' }]} />
            </View>
            <RNAnimated.Text style={[styles.waitingText, { opacity: pulseAnim }]}>Waiting for Partner...</RNAnimated.Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function generateCoupleCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => new Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return segment();
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0708' },
  scroll: { padding: 20 },
  header: { marginBottom: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  headerTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 2 },
  phaseText: { color: '#40e0d0', fontSize: 12, fontWeight: 'bold' },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  titleSec: { alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 32, color: 'white' },
  subSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
  cardsContainer: { gap: 20 },
  card: { padding: 24, borderRadius: 24, alignItems: 'center', gap: 16 },
  cardHeader: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 2 },
  codeDisplay: { fontSize: 32, color: '#40e0d0', letterSpacing: 4, textShadowColor: '#40e0d0', textShadowRadius: 10 },
  copyBtn: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#8a2be2', borderRadius: 30, alignItems: 'center' },
  inputRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  codeDigit: { width: 40, height: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 24, textAlign: 'center', fontWeight: 'bold' },
  connectBtn: { flexDirection: 'row', width: '100%', justifyContent: 'center', paddingVertical: 16, backgroundColor: 'white/5', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 10, marginTop: 10 },
  waiting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 30, opacity: 0.6 },
  waitingText: { color: 'white', fontSize: 14, letterSpacing: 1 },
  pulseContainer: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff8c00' },
  dotPing: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff8c00', opacity: 0.5, transform: [{ scale: 1.5 }] }
});
