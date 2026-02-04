import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

const PROMPTS = ["Text one reason you chose them today", "Send a photo of your favorite memory", "Commit to one chore this week"];

export default function CommitmentDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [rolled, setRolled] = useState(false);

  function roll() {
    setRolled(true);
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(p);
    speakMarcie(p);
    HapticFeedbackSystem.heavyImpact();
  }

  function submit() {
    if (!response) {
      speakMarcie("You can't commit to nothing. Type something.");
      return;
    }
    speakMarcie("Commitment logged. I'll be watching.");
    HapticFeedbackSystem.success();
    Alert.alert("Commitment Sent", "Your partner has been notified.", [{ text: "Done", onPress: () => navigation.goBack() }]);
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
            <Text style={styles.quoteText} variant="sass">Roll the dice for random acts of commitment! Small gestures build lasting bonds.</Text>
          </View>
        </View>

        {!rolled ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
                <Text variant="header" style={{ fontSize: 60 }}>🎲</Text>
                <SquishyButton onPress={roll} style={styles.rollBtn}>
                  <LinearGradient
                    colors={['#db147c', '#f05d68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text variant="header" style={{ color: '#ffffff' }}>Roll for Commitment</Text>
                  </LinearGradient>
                </SquishyButton>
            </View>
        ) : (
            <View style={{ gap: 12 }}>
                <Text variant="body">Prompt:</Text>
                <Text variant="header" style={{ color: '#db147c', textAlign: 'center' }}>{prompt}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your commitment..."
                    placeholderTextColor="#666"
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}>
                  <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text variant="header" style={{ color: '#ffffff' }}>Commit</Text>
                  </LinearGradient>
                </SquishyButton>
            </View>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Commitment Dice',
    description: 'Random acts of commitment',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  rollBtn: { 
    marginTop: 20, 
    padding: 16, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    minHeight: 80, 
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  doneBtn: { 
    marginTop: 16, 
    padding: 16, 
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
    paddingVertical: 16,
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
