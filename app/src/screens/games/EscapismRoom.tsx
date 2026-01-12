import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function EscapismRoom({ navigation }: any) {
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active && timeLeft > 0 && !solved) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, timeLeft, solved]);

  function checkAnswer() {
    // Simple check
    if (answer.toLowerCase().includes('phone') || answer.toLowerCase().includes('scroll')) {
      setSolved(true);
      setActive(false);
    } else {
        // wrong
    }
  }

  function start() {
    setAnswer('');
    setSolved(false);
    setTimeLeft(60);
    setActive(true);
  }

  return (
    <LinearGradient colors={['#050510', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Escapism Room</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
             <Text variant="header">Riddle</Text>
             <Text variant="header" style={{color: timeLeft < 10 ? '#FA1F63' : '#33DEA5'}}>{timeLeft}s</Text>
          </View>

          <Text variant="body" style={{ marginTop: 10 }}>
            "I have a black mirror but no reflection. I connect you to the world but disconnect you from the person next to you. What am I?"
          </Text>

          {!active && !solved && (
            <SquishyButton onPress={start} style={[styles.btn, {marginTop: 20}]}>
              <Text variant="header">Start Timer</Text>
            </SquishyButton>
          )}

          {active && (
            <>
                <TextInput
                    style={styles.input}
                    placeholder="Type your answer..."
                    placeholderTextColor="#666"
                    value={answer}
                    onChangeText={setAnswer}
                />
                <SquishyButton onPress={checkAnswer} style={styles.btn}>
                    <Text variant="header">Unlock Door</Text>
                </SquishyButton>
            </>
          )}

          {solved && (
             <View style={{marginTop: 20}}>
                 <Text variant="header" style={{color: '#33DEA5', textAlign: 'center'}}>ESCAPED!</Text>
                 <Text variant="body" style={{textAlign: 'center', fontStyle: 'italic', marginTop: 10}}>
                    Marcie: "Correct. Now put it down."
                 </Text>
             </View>
          )}

          {!solved && !active && timeLeft === 0 && (
             <Text variant="body" style={{color: '#FA1F63', textAlign: 'center', marginTop: 20}}>
                Trapped in the Binge Basement. Try again.
             </Text>
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
  card: { padding: 20, gap: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 15, color: '#fff', fontSize: 16 },
  btn: { backgroundColor: '#33DEA5', padding: 15, borderRadius: 12, alignItems: 'center' }
});
