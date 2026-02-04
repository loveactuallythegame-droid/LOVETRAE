import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

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
            where('userId', '!=', user.uid) // Different user
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      {!gameCompleted ? (
        <GlassCard>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.headerContainer}>
              <Text 
                variant="header" 
                style={{ 
                  marginBottom: theme.SPACING.md, 
                  color: theme.COLORS.textPrimary,
                  fontSize: theme.TYPOGRAPHY.title.fontSize
                }}
              >
                Defensiveness Detox
              </Text>
              <Text 
                variant="small" 
                style={{ 
                  position: 'absolute', 
                  right: theme.SPACING.md, 
                  top: theme.SPACING.md,
                  color: theme.COLORS.textHint 
                }}
              >
                {currentScenarioIndex + 1}/{DEFENSIVENESS_SCENARIOS.length}
              </Text>
            </View>
            
            <Text 
              variant="body" 
              style={{ 
                marginBottom: theme.SPACING.lg, 
                color: theme.COLORS.textPrimary,
                fontSize: theme.TYPOGRAPHY.body.fontSize,
                lineHeight: 24
              }}
            >
              {currentScenario.scenario}
            </Text>

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
                        ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.responseGradient}
                  >
                    <Text
                      variant="body"
                      style={{
                        color:
                          selectedResponse === response.id
                            ? theme.COLORS.background
                            : theme.COLORS.textPrimary,
                        lineHeight: 20
                      }}
                    >
                      {response.text}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {feedback && (
              <View style={styles.feedbackContainer}>
                <Text 
                  variant="sass" 
                  style={{
                    color: selectedResponse && 
                           currentScenario.responses.find(r => r.id === selectedResponse)?.defensive 
                           ? theme.COLORS.warning 
                           : theme.COLORS.success
                  }}
                >
                  {feedback}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={nextScenario}
              disabled={selectedResponse === null}
            >
              <LinearGradient
                colors={[
                  selectedResponse ? theme.COLORS.primaryGradientStart : '#666',
                  selectedResponse ? theme.COLORS.primaryGradientEnd : '#666'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: selectedResponse ? theme.COLORS.background : theme.COLORS.textHint,
                    textAlign: 'center'
                  }}
                >
                  {currentScenarioIndex === DEFENSIVENESS_SCENARIOS.length - 1 ? 'Finish Game' : 'Next Scenario'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      ) : (
        <GlassCard>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="header" style={{ textAlign: 'center', marginBottom: theme.SPACING.md, color: theme.COLORS.success }}>
              Game Complete!
            </Text>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: theme.SPACING.lg, color: theme.COLORS.textPrimary }}>
              Your final score: {score}
            </Text>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: theme.SPACING.lg, color: theme.COLORS.textSecondary }}>
              {score > 50 
                ? "Great job recognizing defensive patterns and choosing constructive responses!" 
                : "Remember, recognizing defensiveness is the first step to changing the pattern."}
            </Text>
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
                colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: theme.COLORS.background,
                    textAlign: 'center'
                  }}
                >
                  Return to Menu
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      )}

      {partnerResponse && (
        <GlassCard style={styles.partnerCard}>
          <Text 
            variant="sass" 
            style={{ 
              color: theme.COLORS.accentTeal, 
              marginBottom: theme.SPACING.sm 
            }}
          >
            Partner's Choice:
          </Text>
          <Text 
            variant="body" 
            style={{ 
              color: theme.COLORS.textSecondary 
            }}
          >
            {partnerResponse}
          </Text>
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
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.SPACING.md,
  },
  responsesContainer: {
    gap: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
  },
  responseOption: {
    borderRadius: theme.SIZES.borderRadius,
    overflow: 'hidden',
  },
  selectedResponse: {
    borderWidth: 2,
    borderColor: theme.COLORS.success,
  },
  responseGradient: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  feedbackContainer: {
    padding: theme.SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.SIZES.borderRadius,
    marginBottom: theme.SPACING.lg,
  },
  nextButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  nextGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  finishButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  partnerCard: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.md,
  },
});