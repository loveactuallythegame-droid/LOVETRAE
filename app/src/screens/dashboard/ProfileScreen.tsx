import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Switch, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { supabase, getProfile, upsertProfile } from '../../lib/supabase';
import { setJSON, getJSON } from '../../lib/cache';
import { useAppStore } from '../../state/store';
import { isBetaActive } from '../../lib/gating';

export default function ProfileScreen() {
  const isBeta = useAppStore((s) => s.isBeta);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPrivate, setAvatarPrivate] = useState(false);
  const [sarcasm, setSarcasm] = useState(1);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>(['Starter', 'First Repair']);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user?.id || '';
      const prof = await getProfile(user);
      setSarcasm(prof.data?.sarcasm_level || 1);
      const t = await getJSON<string[]>('timeline', []);
      setTimeline(t);
    });
  }, []);

  async function save() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user?.id || '';
    await upsertProfile({ user_id: user, sarcasm_level: sarcasm });
    await setJSON('avatar_private', avatarPrivate);
  }

  async function exportData() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user?.id || '';
    const prof = await getProfile(user);
    const payload = { profile: prof.data, timeline, badges };
    await setJSON('export_profile', payload);
  }

  async function requestDelete() {
    await setJSON('delete_requested', true);
  }

  return (
    <ScrollView style={styles.root}>
      <GlassCard>
        <Text variant="header">Profile</Text>
        {isBeta && (
          <View style={styles.betaBadge}>
            <Text variant="keyword">Beta Tester</Text>
          </View>
        )}
        {avatarUrl ? (<Image source={{ uri: avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} accessibilityLabel="User Avatar" alt="User Avatar" />) : null}
        <TextInput placeholder="Avatar URL" style={styles.input} value={avatarUrl} onChangeText={setAvatarUrl} accessibilityLabel="Avatar URL Input" />
        <View style={styles.row}><Text variant="body">Avatar private</Text><Switch value={avatarPrivate} onValueChange={setAvatarPrivate} accessibilityLabel="Toggle Avatar Privacy" /></View>
        <View style={styles.row}><Text variant="body">Sarcasm Level</Text><TextInput style={styles.inputSmall} keyboardType="numeric" value={String(sarcasm)} onChangeText={(v) => setSarcasm(parseInt(v) || 1)} /></View>
        <Text variant="header" style={{ marginTop: 12 }}>Timeline</Text>
        {timeline.map((t, i) => (<Text key={i} variant="body">• {t}</Text>))}
        <Text variant="header" style={{ marginTop: 12 }}>Badges</Text>
        {badges.map((b, i) => (<Text key={i} variant="keyword">{b}</Text>))}
        <View style={styles.row}>
          <SquishyButton style={styles.btn} onPress={save}><Text variant="header">Save</Text></SquishyButton>
          <SquishyButton style={styles.btn} onPress={exportData}><Text variant="header">Export</Text></SquishyButton>
          <SquishyButton style={styles.btn} onPress={requestDelete}><Text variant="header">Delete</Text></SquishyButton>
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  inputSmall: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 8, color: '#fff', width: 60 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12, marginTop: 12 },
  betaBadge: { backgroundColor: 'rgba(255,215,0,0.2)', padding: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 }
});
