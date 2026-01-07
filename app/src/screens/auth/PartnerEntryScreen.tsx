import { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { supabase, getProfile, linkPartnersTransactional, subscribeCouple } from '../../lib/supabase';

type PartnerEntryScreenProps = {
  onLinked: (code: string) => void;
};

export default function PartnerEntryScreen({ onLinked }: PartnerEntryScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('Waiting for partner...');

  useEffect(() => {
    let sub: any;
    if (code.startsWith('LA-') && code.endsWith('-LOVE')) {
      subscribeCouple(code, async () => {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) return;
        const me = await getProfile(user.id);
        const partnerId = me.data?.partner_id;
        if (partnerId) {
          setComment('Syncing stories...');
          setTimeout(() => onLinked(code), 800);
        }
      }).then((c) => (sub = c));
    }
    return () => { if (sub) supabase.removeChannel(sub); };
  }, [code]);

  async function validate() {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) { setLoading(false); return; }
    const partner = await supabase.from('profiles').select('*').eq('couple_code', code).not('user_id', 'eq', user.id).limit(1);
    const partnerId = partner.data?.[0]?.user_id;
    if (partnerId) {
      try {
        await linkPartnersTransactional(user.id, partnerId, code);
      } catch (e) {
        setComment('Linking failed. Try again or refresh.');
        setLoading(false);
        return;
      }
      setComment('Linked! Dr. Marcie approves... for now.');
      setTimeout(() => onLinked(code), 800);
    } else {
      setComment('Code not found. Did you share the right tea?');
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Marcie overlay hidden during input fields; rendered globally at root elsewhere */}
      <View style={{ padding: 16, gap: 12 }}>
        <GlassCard>
          <Text variant="header">Enter Partner Code</Text>
          <TextInput value={code} onChangeText={setCode} placeholder="LA-XXXX-LOVE" style={styles.input} />
          <Text variant="sass">{comment}</Text>
        </GlassCard>
        <SquishyButton onPress={validate} style={styles.btn}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text variant="header">Validate</Text>}
        </SquishyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff' },
  btn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
});
