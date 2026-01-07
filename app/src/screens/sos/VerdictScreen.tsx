import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, updateFight } from '../../lib/supabase';
import { analyzeFight } from '../../lib/ai-engine';
import { speakMarcie } from '../../lib/voice-engine';

type VerdictScreenProps = {
  route: any;
  navigation: any;
};

export default function VerdictScreen({ route, navigation }: VerdictScreenProps) {
  const { fightId, timeout } = route.params || {};
  const [verdict, setVerdict] = useState<{ right: string[]; callout: string[]; repairs_a: string[]; repairs_b: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('fights').select('*').eq('id', fightId).single().then(async ({ data }) => {
      const couple_id = data.couple_id;
      const profiles = await supabase.from('profiles').select('*').eq('couple_code', couple_id);
      const a = data.partner_a_input || '{}';
      const b = data.partner_b_input || '{}';
      const aParsed = JSON.parse(a);
      const bParsed = JSON.parse(b);
      const origin_story = profiles.data?.[0]?.origin_story || '';
      const first_red_flag = profiles.data?.[0]?.first_red_flag || '';
      const personality = 'balanced';
      const sarcasm_level = 1;
      const analysis = await analyzeFight({ origin_story, first_red_flag, partner_a_input: a, partner_b_input: b, personality, sarcasm_level });
      setVerdict(analysis);
      await updateFight(fightId, { ai_analysis: JSON.stringify(analysis), completion_status: timeout ? 'timeout' : 'completed' });
      setLoading(false);
      await speakMarcie(analysis.callout.join(' '));
    });
  }, [fightId, timeout]);

  if (loading || !verdict) return <View style={styles.root}><Text variant="header">Analyzing...</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <GlassCard>
        <Text variant="header" style={{ color: '#33DEA5' }}>✅ What You Did Right</Text>
        {verdict.right.map((r, i) => (<Text key={i} variant="body" style={{ color: '#33DEA5' }}>{r}</Text>))}
      </GlassCard>
      <GlassCard>
        <Text variant="header" style={{ color: '#E11637' }}>❌ The Call-Out</Text>
        {verdict.callout.map((r, i) => (<Text key={i} variant="sass" style={{ color: '#E11637' }}>{r}</Text>))}
      </GlassCard>
      <GlassCard>
        <Text variant="header">Repair Attempts (You)</Text>
        {verdict.repairs_a.map((r, i) => (<Text key={i} variant="body">{r}</Text>))}
      </GlassCard>
      <GlassCard>
        <Text variant="header">Repair Attempts (Partner)</Text>
        {verdict.repairs_b.map((r, i) => (<Text key={i} variant="body">{r}</Text>))}
      </GlassCard>
      <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.btnGrad}>
        <SquishyButton style={{ backgroundColor: 'transparent' }} onPress={() => navigation.popToTop()}><Text variant="header">Accept</Text></SquishyButton>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnGrad: { alignSelf: 'flex-end', paddingHorizontal: 0, paddingVertical: 0, borderRadius: 12, overflow: 'hidden' },
});
