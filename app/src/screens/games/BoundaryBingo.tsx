import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const BINGO_ITEMS = [
  "Said no without guilt", "Asked for space", "Respected a 'no'", "Shared a fear",
  "Didn't fix a problem", "Stayed calm", "Used 'I' statement", "Validated feelings",
  "Took a timeout", "Apologized sincerely", "Forgave small error", "Checked in",
  "Expressed need", "Listened actively", "No interrupting", "Showed appreciation"
];

export default function BoundaryBingo({ navigation }: any) {
  const [marked, setMarked] = useState<boolean[]>(new Array(16).fill(false));

  function toggle(index: number) {
    const next = [...marked];
    next[index] = !next[index];
    setMarked(next);
  }

  // Simple check for any line (row/col/diag) would be cool, but just visual for now
  const count = marked.filter(Boolean).length;

  return (
    <LinearGradient colors={['#0f172a', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Boundary Bingo</Text>
        </View>

        <Text variant="body" style={{ textAlign: 'center', color: '#ccc' }}>
          Mark squares when you successfully enact a boundary. Verify with partner.
        </Text>

        <View style={styles.grid}>
          {BINGO_ITEMS.map((item, i) => (
            <Pressable key={i} onPress={() => toggle(i)} style={[styles.cell, marked[i] && styles.markedCell]}>
              {marked[i] && <Text style={styles.check}>✅</Text>}
              <Text style={[styles.cellText, marked[i] && styles.markedText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <GlassCard style={{ padding: 15, alignItems: 'center' }}>
          <Text variant="header">{count} Squares Marked</Text>
          {count >= 4 && <Text variant="body" style={{ color: '#E4E831' }}>Marcie: Keep it up. Boundaries are sexy.</Text>}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '23%', aspectRatio: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  markedCell: { backgroundColor: 'rgba(51, 222, 165, 0.2)', borderColor: '#33DEA5', borderWidth: 1 },
  cellText: { fontSize: 10, color: '#fff', textAlign: 'center' },
  markedText: { color: '#33DEA5', fontWeight: 'bold' },
  check: { position: 'absolute', top: 2, right: 2, fontSize: 10 }
});
