import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const CARDS = [
  { text: "I messed up", type: "Guilt" },
  { text: "I'm a failure", type: "Shame" },
  { text: "I hurt you", type: "Guilt" },
  { text: "I am bad", type: "Shame" },
  { text: "I made a mistake", type: "Guilt" },
  { text: "I am unlovable", type: "Shame" },
];

export default function GuiltShameSort({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleSwipe(choice: "Guilt" | "Shame") {
    const current = CARDS[index];
    const correct = current.type === choice;

    if (correct) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong. "${current.text}" is ${current.type}.`);
    }

    if (index < CARDS.length - 1) {
      setTimeout(() => {
        setIndex(index + 1);
        setFeedback("");
      }, 1000);
    } else {
      setFinished(true);
    }
  }

  return (
    <LinearGradient colors={['#4a1c40', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Guilt vs. Shame</Text>
        </View>

        {!finished ? (
          <GlassCard style={styles.card}>
            <Text variant="body" style={{ textAlign: 'center' }}>Sort the thought:</Text>
            <View style={styles.cardContent}>
              <Text variant="header" style={styles.cardText}>{CARDS[index].text}</Text>
            </View>

            {feedback ? <Text variant="header" style={{ color: feedback === "Correct!" ? '#33DEA5' : '#FA1F63', textAlign: 'center' }}>{feedback}</Text> : null}

            <View style={styles.actions}>
              <SquishyButton onPress={() => handleSwipe("Guilt")} style={[styles.btn, styles.guiltBtn]}>
                <Text variant="header">Guilt (Healthy)</Text>
              </SquishyButton>
              <SquishyButton onPress={() => handleSwipe("Shame")} style={[styles.btn, styles.shameBtn]}>
                <Text variant="header">Shame (Toxic)</Text>
              </SquishyButton>
            </View>
          </GlassCard>
        ) : (
          <GlassCard style={styles.card}>
            <Text variant="header" style={{ textAlign: 'center' }}>Sorting Complete</Text>
            <Text variant="header" style={{ textAlign: 'center', fontSize: 40, color: '#33DEA5' }}>{score}/{CARDS.length}</Text>
            <Text variant="body" style={{ textAlign: 'center', marginTop: 10 }}>
              Marcie: "Remember: Guilt says 'I did something bad'. Shame says 'I am bad'. Know the difference."
            </Text>
            <SquishyButton onPress={() => { setIndex(0); setScore(0); setFinished(false); }} style={styles.btn}>
              <Text variant="header">Retry</Text>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20, flexGrow: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  card: { padding: 30, gap: 20, minHeight: 400, justifyContent: 'center' },
  cardContent: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  cardText: { fontSize: 28, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: { flex: 1, padding: 20, borderRadius: 12, alignItems: 'center' },
  guiltBtn: { backgroundColor: '#33DEA5' },
  shameBtn: { backgroundColor: '#FA1F63' }
});
