import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Pin = { name: string; lat?: number; lng?: number; details?: string };

export default function MemoryLaneMap({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'memory-lane' };
  const [pin, setPin] = useState<Pin>({ name: '' });
  const [partnerPin, setPartnerPin] = useState<Pin | null>(null);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('memory_lane_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (st.pin) setPartnerPin(st.pin);
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  function update(field: keyof Pin, value: any) {
    setPin((p) => ({ ...p, [field]: value }));
    if (sessionId.current) updateGameSession(sessionId.current, { state: JSON.stringify({ pin: { ...pin, [field]: value } }) });
  }

  function distance(a?: Pin, b?: Pin) {
    if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad((b.lat as number) - (a.lat as number));
    const dLon = toRad((b.lng as number) - (a.lng as number));
    const lat1 = toRad(a.lat as number);
    const lat2 = toRad(b.lat as number);
    const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  }

  const dist = distance(pin, partnerPin || undefined) || 0;
  const acc = Math.max(0, Math.round(100 - Math.min(100, dist)));

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Memory Lane Map',
    description: 'Drop pins for shared memories',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 60,
    currentStep: 0,
    totalTime: 90,
    playerData: { vulnerabilityScore: 50, honestyScore: 50, completionTime: 0, partnerSync: acc },
  }), [gameId, acc]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(90, 60 + Math.round(acc * 0.3));
    if ((pin.name || '').toLowerCase().includes('gas station')) speakMarcie('Your first kiss was at a gas station?');
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ pin, partnerPin, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Where was your first kiss?</Text>
        <TextInput placeholder="Place name" style={styles.input} value={pin.name} onChangeText={(t) => update('name', t)} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput placeholder="lat" keyboardType="numeric" style={[styles.input, styles.inputSmall]} value={String(pin.lat || '')} onChangeText={(t) => update('lat', parseFloat(t))} />
          <TextInput placeholder="lng" keyboardType="numeric" style={[styles.input, styles.inputSmall]} value={String(pin.lng || '')} onChangeText={(t) => update('lng', parseFloat(t))} />
        </View>
        <TextInput placeholder="Memory details" style={styles.input} value={pin.details || ''} onChangeText={(t) => update('details', t)} />
        {!!partnerPin && <Text variant="keyword">Partner chose: {partnerPin.name}</Text>}
        {!!dist && <Text variant="keyword">Distance: {dist.toFixed(2)} km</Text>}
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  inputSmall: { flex: 1 },
});

