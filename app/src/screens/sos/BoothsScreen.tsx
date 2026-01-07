import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';
import { Text, SquishyButton, GlassCard } from '../../components/ui';
import { createFight, updateFight, subscribeFight, supabase } from '../../lib/supabase';
import * as Network from 'expo-network';
import { LinearGradient } from 'expo-linear-gradient';
import { encryptSensitive } from '../../lib/encryption';
import { setJSON, getJSON } from '../../lib/cache';

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

  useEffect(() => {
    Network.getNetworkStateAsync().then((s) => setOffline(!(s.isConnected && s.isInternetReachable)));
  }, []);

  useEffect(() => {
    const total = action.length + story.length + need.length;
    const iWords = (action + ' ' + story + ' ' + need).toLowerCase().split(' ').filter((w) => w === 'i' || w === 'we').length;
    const blameWords = ['always', 'never', 'you'];
    const blame = blameWords.reduce((acc, w) => acc + ((action + story).toLowerCase().includes(w) ? 1 : 0), 0);
    const score = Math.max(0, Math.min(100, Math.round((total / 300) * 60 + iWords * 10 - blame * 10)));
    setHonesty(score);
  }, [action, story, need]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (couple_id) {
        const fight = await createFight(couple_id);
        setFightId(fight.id);
        const sub = await subscribeFight(fight.id, (payload) => {
          const after = payload.new;
          if (after?.partner_b_input) setPartnerJoined(true);
        });
      }
    });
  }, []);

  async function submit() {
    if (!fightId) return;
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
    if (offline) {
      await setJSON(`sos_payload_${fightId}`, payload);
    } else {
      await updateFight(fightId, { partner_a_input: payload });
      const cached = await getJSON(`sos_payload_${fightId}`, null as any);
      if (cached) await setJSON(`sos_payload_${fightId}`, null);
    }
    navigation.replace('SOSCoolDown', { fightId });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, padding: 12 }}>
          <GlassCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text variant="header" style={{ color: '#E11637' }}>⚠️ Emergency</Text>
              <Text variant="body" id="instructions">Provide your side clearly</Text>
            </View>
            <Text variant="header">Your Side of the Story</Text>
            <Picker selectedValue={feeling} onValueChange={(v) => setFeeling(v)} accessibilityLabel="How are you feeling?">
              {['hurt','angry','frustrated','disappointed','confused','betrayed','ignored','stressed'].map((f) => (
                <Picker.Item key={f} label={f} value={f} />
              ))}
            </Picker>
            <TextInput 
              placeholder="When my partner..." 
              style={styles.input} 
              value={action} 
              onChangeText={setAction} 
              accessibilityLabel="Action description"
              accessibilityHint="Describe what happened"
              aria-describedby="instructions"
            />
            <TextInput 
              placeholder="Because I tell myself the story that..." 
              style={styles.input} 
              value={story} 
              onChangeText={setStory}
              accessibilityLabel="Your story"
              accessibilityHint="Explain your interpretation"
              aria-describedby="instructions"
            />
            <TextInput 
              placeholder="What I actually need is..." 
              style={styles.input} 
              value={need} 
              onChangeText={setNeed}
              accessibilityLabel="Your need"
              accessibilityHint="State what you need"
              aria-describedby="instructions"
            />
            <Text variant="keyword">Honesty Score: {honesty}</Text>
            {offline && <Text variant="sass">Offline detected. Saving locally until reconnected.</Text>}
            <LinearGradient colors={['#E11637', '#FA1F63']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.submitGrad}>
              <SquishyButton style={{ backgroundColor: 'transparent' }} onPress={submit}><Text variant="header">Submit</Text></SquishyButton>
            </LinearGradient>
          </GlassCard>
        </View>
        <View style={{ width: 2 }}>
          <BlurView intensity={60} tint="dark" style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1, padding: 12 }}>
          <GlassCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text variant="header">Waiting for Your Partner</Text>
              <Text variant="body">🕒</Text>
            </View>
            <Text variant="sass">{partnerJoined ? 'Partner joined. Awaiting input...' : 'Cool-down mini-meditation: breathe in... out...'}</Text>
          </GlassCard>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  submit: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  submitGrad: { alignSelf: 'flex-end', borderRadius: 12, marginTop: 10, overflow: 'hidden' },
});
