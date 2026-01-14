import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, updateFight } from '../../lib/supabase';
import { analyzeFight } from '../../lib/ai-engine';
import { speakMarcie } from '../../lib/voice-engine';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarcieHost } from '../../components/ai-host';
import { Ionicons } from '@expo/vector-icons';

type VerdictScreenProps = {
  route: any;
  navigation: any;
};

export default function VerdictScreen({ route, navigation }: VerdictScreenProps) {
  const { fightId, timeout } = route.params || {};
  const [verdict, setVerdict] = useState<{ right: string[]; callout: string[]; repairs_a: string[]; repairs_b: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fightId) {
      // simulation for testing if no fightId
      setTimeout(() => {
        setVerdict({
          right: ['You expressed feelings using "I" statements.', 'You avoided "Always/Never" absolute language.'],
          callout: ['You accused them of "ruining the night". That is an interpretation, not a fact.', 'Story-telling: "You don\'t care" is a mind-read.'],
          repairs_a: ['"I might be overreacting..."', '"Can we start over?"'],
          repairs_b: ['"I hear you."', '"I am listening."']
        });
        setLoading(false);
      }, 2000);
      return;
    }

    supabase.from('fights').select('*').eq('id', fightId).single().then(async ({ data, error }: any) => {
      if (error || !data) { setLoading(false); return; }

      const couple_id = data.couple_id;
      const profiles = await supabase.from('profiles').select('*').eq('couple_code', couple_id);

      const a = data.partner_a_input || '{}';
      const b = data.partner_b_input || '{}';

      // We would use profile data for better AI context
      const origin_story = profiles.data?.[0]?.origin_story || '';
      const first_red_flag = profiles.data?.[0]?.first_red_flag || '';

      const analysis = await analyzeFight({
        origin_story,
        first_red_flag,
        partner_a_input: a,
        partner_b_input: b,
        personality: 'balanced',
        sarcasm_level: 1
      });

      setVerdict(analysis);
      await updateFight(fightId, { ai_analysis: JSON.stringify(analysis), completion_status: timeout ? 'timeout' : 'completed' });
      setLoading(false);

      if (analysis.callout.length > 0) {
        speakMarcie(analysis.callout[0]);
      }
    });
  }, [fightId, timeout]);

  if (loading) {
    return (
      <View style={styles.root}>
        <RadialGradientBackground />
        <View style={styles.center}>
          <MarcieHost mode="idle" size={150} float />
          <ActivityIndicator size="large" color="#33DEA5" style={{ marginTop: 20 }} />
          <Text variant="header" style={{ marginTop: 20 }}>Analyzing Conflict...</Text>
          <Text variant="body" style={{ opacity: 0.6 }}>Consulting the emotional database.</Text>
        </View>
      </View>
    );
  }

  if (!verdict) return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView>
        <Text variant="header">Error loading verdict.</Text>
        <SquishyButton onPress={() => navigation.goBack()}>Go Back</SquishyButton>
      </SafeAreaView>
    </View>
  );

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          <View style={styles.header}>
            <Text variant="header" style={styles.title}>The Verdict</Text>
            <Text variant="body" style={styles.sub}>Dr. Marcie has thoughts.</Text>
          </View>

          <View style={styles.row}>
            <GlassCard style={[styles.card, { borderColor: '#33DEA5' }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#33DEA5" />
                <Text variant="header" style={{ color: '#33DEA5', fontSize: 18 }}>What You Did Right</Text>
              </View>
              {verdict.right.map((r, i) => (
                <View key={i} style={styles.bullet}>
                  <View style={[styles.dot, { backgroundColor: '#33DEA5' }]} />
                  <Text variant="body" style={{ color: 'rgba(255,255,255,0.8)', flex: 1 }}>{r}</Text>
                </View>
              ))}
            </GlassCard>
          </View>

          <View style={styles.row}>
            <GlassCard style={[styles.card, { borderColor: '#E11637' }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="alert-circle" size={24} color="#E11637" />
                <Text variant="header" style={{ color: '#E11637', fontSize: 18 }}>The Call-Out</Text>
              </View>
              {verdict.callout.map((r, i) => (
                <View key={i} style={styles.bullet}>
                  <View style={[styles.dot, { backgroundColor: '#E11637' }]} />
                  <Text variant="sass" style={{ color: '#ff8a80', flex: 1 }}>{r}</Text>
                </View>
              ))}
            </GlassCard>
          </View>

          <Text variant="keyword" style={{ marginTop: 20, marginBottom: 10, textAlign: 'center' }}>REPAIR ATTEMPTS DETECTED</Text>

          <View style={styles.repairsGrid}>
            <GlassCard style={styles.repairCard}>
              <Text variant="header" style={{ fontSize: 14, marginBottom: 8 }}>You</Text>
              {verdict.repairs_a.length > 0 ? verdict.repairs_a.map((r, i) => (
                <Text key={i} variant="body" style={{ fontSize: 12, marginBottom: 4 }}>• "{r}"</Text>
              )) : <Text variant="body" style={{ fontSize: 12, opacity: 0.5 }}>No repairs detected.</Text>}
            </GlassCard>

            <GlassCard style={styles.repairCard}>
              <Text variant="header" style={{ fontSize: 14, marginBottom: 8 }}>Partner</Text>
              {verdict.repairs_b.length > 0 ? verdict.repairs_b.map((r, i) => (
                <Text key={i} variant="body" style={{ fontSize: 12, marginBottom: 4 }}>• "{r}"</Text>
              )) : <Text variant="body" style={{ fontSize: 12, opacity: 0.5 }}>No repairs detected.</Text>}
            </GlassCard>
          </View>

          <View style={{ height: 20 }} />

          <SquishyButton onPress={() => navigation.popToTop()} style={styles.acceptBtn}>
            <Text variant="header" style={{ color: 'white' }}>Accept & Close</Text>
          </SquishyButton>

          <MarcieHost mode="lean" size={100} float position={{ x: -20, y: 0 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0708' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20 },

  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, marginBottom: 5 },
  sub: { color: 'rgba(255,255,255,0.5)' },

  row: { marginBottom: 16 },
  card: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 8 },

  bullet: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },

  repairsGrid: { flexDirection: 'row', gap: 10 },
  repairCard: { flex: 1, padding: 12 },

  acceptBtn: { backgroundColor: '#5C1459', paddingVertical: 16, alignItems: 'center', borderRadius: 16, marginBottom: 40 }
});
