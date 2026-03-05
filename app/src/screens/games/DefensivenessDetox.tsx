import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS, TYPOGRAPHY } from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const DEFENSIVENESS_SCENARIOS = [
  {
    id: '1',
    scenario: "Your partner brings up a concern about your communication habits",
    responses: [
      { id: 'a', text: "That's not fair, you do that too!", defensive: true, points: -10 },
      { id: 'b', text: "I see your point. Can you tell me more?", defensive: false, points: 20 },
      { id: 'c', text: "You're probably right. Let me explain though...", defensive: true, points: 5 },
      { id: 'd', text: "I hear you. How can we work on this together?", defensive: false, points: 25 }
    ]
  },
  {
    id: '2',
    scenario: "Your partner shares that they feel unheard during arguments",
    responses: [
      { id: 'a', text: "That's ridiculous, I always listen to you!", defensive: true, points: -15 },
      { id: 'b', text: "I'm sorry you feel that way. What specifically happened?", defensive: false, points: 20 },
      { id: 'c', text: "Well maybe if you weren't so sensitive...", defensive: true, points: -10 },
      { id: 'd', text: "I want to do better. Can we talk about what I can change?", defensive: false, points: 25 }
    ]
  },
  {
    id: '3',
    scenario: "Your partner points out a pattern of canceling plans",
    responses: [
      { id: 'a', text: "I can't help it when work gets busy!", defensive: true, points: -5 },
      { id: 'b', text: "You're right, I need to do better with commitments", defensive: false, points: 20 },
      { id: 'c', text: "You cancel things too sometimes!", defensive: true, points: -10 },
      { id: 'd', text: "I understand your frustration. How can I rebuild trust?", defensive: false, points: 25 }
    ]
  }
];

export default function DefensivenessDetox({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'defensiveness-detox' };
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const coupleId = useRef<string | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        const couple_code = profileSnap.data()?.couple_code;

        if (couple_code) {
          coupleId.current = couple_code;
          
          const sessionRef = await addDoc(collection(db, 'game_sessions'), {
            gameId,
            userId: user.uid,
            couple_id: couple_code,
            createdAt: new Date(),
            state: { currentScenarioIndex, score, responses, completed: false },
          });
          setSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'game_sessions'),
            where('couple_id', '==', couple_code),
            where('gameId', '==', gameId),
            where('userId', '!=', user.uid)
          );
          
          const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                const data = change.doc.data();
                if (data.state?.responses) {
                  // Get the latest response from partner
                  const partnerResponses = data.state.responses;
                  const currentScenarioId = DEFENSIVENESS_SCENARIOS[currentScenarioIndex]?.id;
                  if (currentScenarioId && partnerResponses[currentScenarioId]) {
                    setPartnerResponse(partnerResponses[currentScenarioId]);
                  }
                }
              }
            });
          });
          
          return () => unsubscribeSnapshot();
        }
      }
    });

    return () => unsubscribeAuth && unsubscribeAuth();
  }, [gameId, currentScenarioIndex]);

  const selectResponse = (responseId: string) => {
    const currentScenario = DEFENSIVENESS_SCENARIOS[currentScenarioIndex];
    const response = currentScenario.responses.find(r => r.id === responseId);
    
    if (response) {
      setSelectedResponse(responseId);
      setScore(prev => prev + response.points);
      
      // Provide feedback based on response
      if (response.defensive) {
        setFeedback("This response is defensive. It deflects responsibility or counters with criticism.");
      } else {
        setFeedback("This response is constructive. It takes ownership and invites further discussion.");
      }
      
      // Record response
      const newResponses = { ...responses, [currentScenario.id]: responseId };
      setResponses(newResponses);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            currentScenarioIndex, 
            score: score + response.points,
            responses: newResponses,
            completed: currentScenarioIndex === DEFENSIVENESS_SCENARIOS.length - 1
          }
        });
      }
    }
  };

  const nextScenario = () => {
    if (currentScenarioIndex < DEFENSIVENESS_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedResponse(null);
      setFeedback(null);
      setPartnerResponse(null);
    } else {
      setGameCompleted(true);
    }
  };

  const currentScenario = DEFENSIVENESS_SCENARIOS[currentScenarioIndex];

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.xlarge }} showsVerticalScrollIndicator={false}>
      {!gameCompleted ? (
        <GlassCard padding="large">
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.headerContainer}>
              <Typography variant="h2" style={styles.title}>
                Defensiveness Detox
              </Typography>
              <Typography variant="caption" style={styles.progress}>
                {currentScenarioIndex + 1}/{DEFENSIVENESS_SCENARIOS.length}
              </Typography>
            </View>
            
            <Typography variant="body" style={styles.scenarioText}>
              {currentScenario.scenario}
            </Typography>

            <View style={styles.responsesContainer}>
              {currentScenario.responses.map((response) => (
                <TouchableOpacity
                  key={response.id}
                  style={[
                    styles.responseOption,
                    selectedResponse === response.id && styles.selectedResponse
                  ]}
                  onPress={() => selectResponse(response.id)}
                  disabled={selectedResponse !== null}
                >
                  <LinearGradient
                    colors={
                      selectedResponse === response.id
                        ? GRADIENTS.primary.colors
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.responseGradient}
                  >
                    <Typography
                      variant="body"
                      style={{
                        color:
                          selectedResponse === response.id
                            ? COLORS.backgroundPrimary
                            : COLORS.textPrimary,
                        lineHeight: 20
                      }}
                    >
                      {response.text}
                    </Typography>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {feedback && (
              <View style={styles.feedbackContainer}>
                <Typography 
                  variant="sass" 
                  style={{
                    color: selectedResponse && 
                           currentScenario.responses.find(r => r.id === selectedResponse)?.defensive 
                           ? COLORS.warning 
                           : COLORS.success
                  }}
                >
                  {feedback}
                </Typography>
              </View>
            )}

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={nextScenario}
              disabled={selectedResponse === null}
            >
              <LinearGradient
                colors={[
                  selectedResponse ? GRADIENTS.primary.colors[0] : '#666',
                  selectedResponse ? GRADIENTS.primary.colors[1] : '#666'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextGradient}
              >
                <Typography 
                  variant="h3" 
                  style={{ 
                    color: selectedResponse ? COLORS.backgroundPrimary : COLORS.textHint,
                    textAlign: 'center'
                  }}
                >
                  {currentScenarioIndex === DEFENSIVENESS_SCENARIOS.length - 1 ? 'Finish Game' : 'Next Scenario'}
                </Typography>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      ) : (
        <GlassCard padding="large">
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Typography variant="h1" center style={{ color: COLORS.success, marginBottom: SPACING.regular }}>
              Game Complete!
            </Typography>
            <Typography variant="body" center style={{ marginBottom: SPACING.xlarge }}>
              Your final score: {score}
            </Typography>
            <Typography variant="body" center style={{ marginBottom: SPACING.xlarge }}>
              {score > 50 
                ? "Great job recognizing defensive patterns and choosing constructive responses!" 
                : "Remember, recognizing defensiveness is the first step to changing the pattern."}
            </Typography>
            <TouchableOpacity 
              style={styles.finishButton} 
              onPress={() => {
                if (sessionId) {
                  const sessionRef = doc(db, 'game_sessions', sessionId);
                  updateDoc(sessionRef, {
                    finished_at: new Date().toISOString(),
                    score: score,
                    state: JSON.stringify({ completed: true, finalScore: score, responses })
                  });
                }
                navigation.goBack();
              }}
            >
              <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.nextGradient}
              >
                <Typography 
                  variant="h3" 
                  center
                  style={{ color: COLORS.backgroundPrimary }}
                >
                  Return to Menu
                </Typography>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      )}

      {partnerResponse && (
        <GlassCard style={styles.partnerCard} padding="medium">
          <Typography 
            variant="sass" 
            style={{ 
              color: COLORS.aquaTeal, 
              marginBottom: SPACING.small 
            }}
          >
            Partner's Choice:
          </Typography>
          <Typography 
            variant="body" 
            style={{ 
              color: COLORS.textSecondary 
            }}
          >
            {partnerResponse}
          </Typography>
        </GlassCard>
      )}
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Defensiveness Detox',
    description: 'Practice recognizing and replacing defensive responses',
    category: 'conflict-resolution' as const,
    difficulty: 'medium' as const,
    xpReward: 65,
    currentStep: currentScenarioIndex,
    totalTime: 600,
    playerData: { 
      vulnerabilityScore: score > 30 ? 80 : score > 10 ? 60 : 40, 
      honestyScore: score > 30 ? 85 : score > 10 ? 65 : 45, 
      completionTime: 0, 
      partnerSync: partnerResponse ? 80 : 20 
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <GameContainer 
        state={baseState} 
        inputs={["custom"]} 
        inputArea={inputArea} 
        onComplete={() => {
          if (sessionId) {
            const sessionRef = doc(db, 'game_sessions', sessionId);
            updateDoc(sessionRef, {
              finished_at: new Date().toISOString(),
              score: score,
              state: JSON.stringify({ completed: true, finalScore: score, responses })
            });
          }
          navigation.goBack();
        }} 
        sessionId={sessionId} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  gradientContainer: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.headerLarge
  },
  progress: {
    color: COLORS.textHint
  },
  scenarioText: {
    marginBottom: SPACING.xlarge,
    color: COLORS.textPrimary,
    lineHeight: 24
  },
  responsesContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  responseOption: {
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
  },
  selectedResponse: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  responseGradient: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  feedbackContainer: {
    padding: SPACING.regular,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.xlarge,
  },
  nextButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
  },
  nextGradient: {
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.button,
  },
  finishButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
  },
  partnerCard: {
    marginTop: SPACING.regular,
  },
});
