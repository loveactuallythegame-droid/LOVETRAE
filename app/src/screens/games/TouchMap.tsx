import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

type Zone = 'Head' | 'Chest' | 'Hands' | 'Legs' | 'Back';
const ZONES: Zone[] = ['Head', 'Chest', 'Hands', 'Legs', 'Back'];

export default function TouchMap({ navigation }: any) {
  const [colors, setColors] = useState<Record<Zone, string>>({
    Head: '#fff', Chest: '#fff', Hands: '#fff', Legs: '#fff', Back: '#fff'
  });

  function cycleColor(z: Zone) {
    const current = colors[z];
    let next = '#fff';
    if (current === '#fff') next = '#33DEA5'; // Green
    else if (current === '#33DEA5') next = '#E4E831'; // Yellow
    else if (current === '#E4E831') next = '#FA1F63'; // Red
    else next = '#fff'; // Reset

    setColors({ ...colors, [z]: next });
  }

  return (
    <LinearGradient colors={['#200020', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">The Touch Map: Lite</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 20 }}>
            Tap zones to set comfort level.
          </Text>
          <View style={styles.legend}>
            <Text style={{ color: '#33DEA5' }}>Green: Yes</Text>
            <Text style={{ color: '#E4E831' }}>Yellow: Ask</Text>
            <Text style={{ color: '#FA1F63' }}>Red: No</Text>
          </View>

          <View style={styles.bodyMap}>
            {ZONES.map((z) => (
              <Pressable key={z} onPress={() => cycleColor(z)} style={[styles.zone, { backgroundColor: colors[z] }]}>
                <Text style={styles.zoneText}>{z}</Text>
              </Pressable>
            ))}
          </View>

          <SquishyButton style={[styles.btn, { marginTop: 20 }]}>
             <Text variant="header">Sync with Partner</Text>
          </SquishyButton>

          <Text variant="body" style={{ marginTop: 20, fontStyle: 'italic', textAlign: 'center' }}>
             Marcie: "They marked 'Chest' yellow... you green. Wanna unpack that?"
          </Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  card: { padding: 20, alignItems: 'center' },
  legend: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  bodyMap: { width: '100%', alignItems: 'center', gap: 15 },
  zone: { width: 100, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', opacity: 0.8 },
  zoneText: { fontWeight: 'bold', color: '#000' },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center', width: '100%' }
});
