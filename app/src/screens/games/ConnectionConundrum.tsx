import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConnectionConundrum({ route, navigation }: any) {
  const { gameId } = route.params;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  function next() {
    if (round < 10) {
        setRound(r => r + 1);
        setScore(s => s + 50);
        speakMarcie("Correct. Faster.");
        HapticFeedbackSystem.selection();
    } else {
        finish();
    }
  }

  function finish() {
    speakMarcie("You survived. Barely. Here's your custom date night plan.");
    Alert.alert("Grand Finale Won", `Score: ${score + 50}. Custom Ritual Unlocked.`, [{ text: "Claim Prize", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Solve the connection conundrum! Test your relationship knowledge in rapid-fire challenges.</Text>
          </View>
        </View>

        <Text variant="header">Round {round}/10</Text>
        <Text variant="body" style={{ textAlign: 'center', marginVertical: 20 }}>
            [Rapid Fire Challenge Placeholder]
        </Text>
        <SquishyButton onPress={next} style={styles.btn}>
            <LinearGradient
              colors={['#db147c', '#f05d68']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
                <Text variant="header" style={{ color: '#ffffff' }}>Solve & Next</Text>
            </LinearGradient>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Connection Conundrum',
    description: 'The Grand Finale Gauntlet',
    category: 'creative' as const,
    difficulty: 'hard' as const,
    xpReward: 500,
    currentStep: round,
    totalTime: 120,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, round]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  btn: { 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 20,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  }
});
