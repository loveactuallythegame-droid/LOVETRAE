import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function TransparencyToss({ navigation }: any) {
  const [toss, setToss] = useState('');
  const [tossed, setTossed] = useState(false);
  const [verified, setVerified] = useState(false);

  function handleToss() {
    if (!toss.trim()) return;
    setTossed(true);
  }

  function handleVerify() {
    setVerified(true);
  }

  return (
    <LinearGradient colors={['#1a0b2e', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Transparency Toss</Text>
        </View>

        {!tossed ? (
          <GlassCard style={styles.card}>
            <Text variant="header">Your Turn to Toss</Text>
            <Text variant="body">Share a low-stakes truth. Something small you didn't mention.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., I pretended to like your friend's lasagna..."
              placeholderTextColor="#999"
              value={toss}
              onChangeText={setToss}
              multiline
            />
            <SquishyButton onPress={handleToss} style={styles.btn}>
              <Text variant="header">Toss Truth</Text>
            </SquishyButton>
          </GlassCard>
        ) : !verified ? (
          <GlassCard style={styles.card}>
            <Text variant="header">Truth Tossed!</Text>
            <Text variant="body" style={styles.truthText}>"{toss}"</Text>
            <Text variant="body" style={{ marginTop: 20 }}>Partner: Verify this truth.</Text>
            <SquishyButton onPress={handleVerify} style={[styles.btn, { backgroundColor: '#33DEA5' }]}>
              <Text variant="header">✅ Verify (+10 XP)</Text>
            </SquishyButton>
          </GlassCard>
        ) : (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ color: '#33DEA5', textAlign: 'center' }}>Caught & Verified!</Text>
            <Text variant="body" style={{ textAlign: 'center' }}>
              Marcie: "You tossed it, they caught it. Trust +1."
            </Text>
            <SquishyButton onPress={() => { setToss(''); setTossed(false); setVerified(false); }} style={styles.btn}>
              <Text variant="header">Next Toss</Text>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  card: { padding: 20, gap: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 15, color: '#fff', fontSize: 16, minHeight: 100 },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center' },
  truthText: { fontSize: 20, fontStyle: 'italic', color: '#E4E831', textAlign: 'center' }
});
