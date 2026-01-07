import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Text, TrustThermometer } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function PartnerDashboard() {
  const [me, setMe] = useState({ trust: 0.6, vulnerability: 50, games: 0, streak: 0, health: 'Stable' });
  const [partner, setPartner] = useState({ trust: 0.4, vulnerability: 40, games: 0, streak: 0, health: 'Recovering' });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: { data: any }) => {
      const user = data.session?.user?.id || '';
      let prof: any = { data: null };
      try {
        const base = supabase.from('profiles').select('user_id,relationship_score,partner_id') as any;
        if (typeof base.eq === 'function') {
          prof = await base.eq('user_id', user).single();
        } else {
          const res = await (supabase.from('profiles').select('user_id,relationship_score,partner_id') as any);
          const row = (res?.data || []).find((r: any) => r.user_id === user);
          prof = { data: row || null, error: null };
        }
      } catch {
        prof = { data: null, error: null };
      }
      const p2 = prof.data?.partner_id;
      if (p2) {
        let partnerProf: any = { data: null };
        try {
          const base2 = supabase.from('profiles').select('user_id,relationship_score') as any;
          if (typeof base2.eq === 'function') {
            partnerProf = await base2.eq('user_id', p2).single();
          } else {
            const res2 = await (supabase.from('profiles').select('user_id,relationship_score') as any);
            const row2 = (res2?.data || []).find((r: any) => r.user_id === p2);
            partnerProf = { data: row2 || null, error: null };
          }
        } catch {
          partnerProf = { data: null, error: null };
        }
        setMe({ trust: (prof.data?.relationship_score || 60) / 100, vulnerability: 50, games: 0, streak: 0, health: 'Stable' });
        setPartner({ trust: (partnerProf.data?.relationship_score || 40) / 100, vulnerability: 40, games: 0, streak: 0, health: 'Recovering' });
      }
    });
  }, []);

  return (
    <View style={styles.root}>
      <GlassCard>
        <Text variant="header">Trust Comparison</Text>
        <View style={styles.row}>
          <View style={{ alignItems: 'center' }}>
            <TrustThermometer width={48} height={180} level={me.trust} />
            <Text variant="keyword">Me</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TrustThermometer width={48} height={180} level={partner.trust} />
            <Text variant="keyword">Partner</Text>
          </View>
        </View>
      </GlassCard>
      <GlassCard>
        <Text variant="header">Summary</Text>
        <Text variant="body">Vulnerability: {me.vulnerability}% vs {partner.vulnerability}%</Text>
        <Text variant="body">Games Completed: {me.games} vs {partner.games}</Text>
        <Text variant="body">Daily Streak: {me.streak} vs {partner.streak}</Text>
        <Text variant="keyword">Relationship Health: {me.health}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }
});
