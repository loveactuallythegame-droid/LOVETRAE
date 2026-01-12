import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function RewriteMemory({ navigation }: any) {
  const [memory, setMemory] = useState('');
  const [rewrite, setRewrite] = useState('');
  const [step, setStep] = useState(1);

  return (
    <LinearGradient colors={['#1e1e2e', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Rewrite the Memory</Text>
        </View>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Step 1: The Fragment</Text>
            <Text variant="body">Type a fragment of a painful memory.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., The night I found the texts..."
              placeholderTextColor="#666"
              value={memory}
              onChangeText={setMemory}
              multiline
            />
            <SquishyButton onPress={() => setStep(2)} style={styles.btn}>
              <Text variant="header">Next</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Text variant="header">Step 2: The Edit</Text>
            <Text variant="body">Partner: Rewrite it with hope or absurdity.</Text>
            <Text variant="body" style={styles.memoryText}>"{memory}"</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ...and then a raccoon stole his phone."
              placeholderTextColor="#666"
              value={rewrite}
              onChangeText={setRewrite}
              multiline
            />
            <SquishyButton onPress={() => setStep(3)} style={styles.btn}>
              <Text variant="header">Submit Edit</Text>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ color: '#33DEA5' }}>Analysis: Poetic</Text>
            <Text variant="body">Original: "{memory}"</Text>
            <Text variant="body" style={{ marginTop: 10 }}>Rewrite: "{rewrite}"</Text>
            <Text variant="body" style={{ marginTop: 20, fontStyle: 'italic', color: '#FA1F63' }}>
              Marcie: "28/30. You took the sting out. That's alchemy."
            </Text>
            <SquishyButton onPress={() => { setStep(1); setMemory(''); setRewrite(''); }} style={styles.btn}>
              <Text variant="header">Again</Text>
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
  btn: { backgroundColor: '#BE1980', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  memoryText: { fontStyle: 'italic', color: '#ccc', marginVertical: 10 }
});
