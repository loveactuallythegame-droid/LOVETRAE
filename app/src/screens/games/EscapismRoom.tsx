import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Text, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

export default function EscapismRoom({ navigation }: any) {
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active && timeLeft > 0 && !solved) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), ANIMATIONS.duration.slow);
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
    }
  }

  function start() {
    setAnswer('');
    setSolved(false);
    setTimeLeft(60);
    setActive(true);
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text variant="h1" center>The Love Arcade</Text>
            <Text variant="h2" center>+100 Games to Deepen Connection</Text>
          </View>

          <GlassCard style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text variant="h3">Riddle</Text>
              <Text variant="h3" style={{color: timeLeft < 10 ? COLORS.error : COLORS.success}}>{timeLeft}s</Text>
            </View>

            <Text variant="body" style={{ marginTop: SPACING.regular }}>
              "I have a black mirror but no reflection. I connect you to the world but disconnect you from the person next to you. What am I?"
            </Text>

            {!active && !solved && (
              <SquishyButton onPress={start} style={{marginTop: SPACING.large}}>
                <Text variant="button">Start Timer</Text>
              </SquishyButton>
            )}

            {active && (
              <>
                  <TextInput
                      style={styles.input}
                      placeholder="Type your answer..."
                      placeholderTextColor={COLORS.textHint}
                      value={answer}
                      onChangeText={setAnswer}
                  />
                  <SquishyButton onPress={checkAnswer}>
                      <Text variant="button">Unlock Door</Text>
                  </SquishyButton>
              </>
            )}

            {solved && (
              <View style={{marginTop: SPACING.large}}>
                  <Text variant="h2" center style={{color: COLORS.success}}>ESCAPED!</Text>
                  <Text variant="body" center style={{ fontStyle: 'italic', marginTop: SPACING.regular }}>
                      Marcie: "Correct. Now put it down."
                  </Text>
              </View>
            )}

            {!solved && !active && timeLeft === 0 && (
              <Text variant="body" center style={{color: COLORS.error, marginTop: SPACING.large}}>
                  Trapped in the Binge Basement. Try again.
              </Text>
            )}
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: {
    flex: 1,
  },
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.large 
  },
  header: { 
    marginBottom: SPACING.regular 
  },
  card: { 
    padding: SPACING.large, 
    gap: SPACING.regular 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginVertical: SPACING.regular,
  },
});
