import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const ORIGINAL = ["You", "make", "me", "feel", "ignored"];
const GOAL = ["I", "feel", "ignored", "when", "you"]; // Simplified check

export default function BlameFlip({ navigation }: any) {
  const [words, setWords] = useState(["You", "make", "me", "feel", "ignored"]);
  const [success, setSuccess] = useState(false);

  // Simplified "drag and drop" by just swapping specific words for this demo
  // A real implementation would use a drag-and-drop library

  function swapToI() {
     setWords(["I", "feel", "ignored", "when..."]);
     setSuccess(true);
  }

  return (
    <LinearGradient colors={['#201010', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">The Blame Flip</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="header">Fix the Sentence</Text>
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 20 }}>
            Change "You make me feel..." to an "I" statement.
          </Text>

          <View style={styles.wordRow}>
            {words.map((w, i) => (
              <View key={i} style={styles.wordBox}>
                <Text style={styles.wordText}>{w}</Text>
              </View>
            ))}
          </View>

          {!success ? (
            <SquishyButton onPress={swapToI} style={styles.btn}>
              <Text variant="header">Flip It</Text>
            </SquishyButton>
          ) : (
             <View style={{ marginTop: 20 }}>
               <Text variant="header" style={{ color: '#33DEA5', textAlign: 'center' }}>Nice Flip! (+10 XP)</Text>
               <Text variant="body" style={{ textAlign: 'center', marginTop: 10 }}>
                 Marcie: "‘You never listen’ → ‘I feel unheard when…’—YES. Now say it without an eye roll."
               </Text>
             </View>
          )}
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
  card: { padding: 20, gap: 20, alignItems: 'center' },
  wordRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  wordBox: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  wordText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  btn: { backgroundColor: '#FA1F63', padding: 15, borderRadius: 12, alignItems: 'center', width: 200 }
});
