import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const TRUTH_OR_TRUST_QUESTIONS = [
  {
    id: '1',
    question: 'What is the most meaningful compliment your partner has ever given you?',
    category: 'connection',
    type: 'truth',
    difficulty: 'medium'
  },
  {
    id: '2',
    question: 'Share a moment when you felt truly seen by your partner.',
    category: 'connection',
    type: 'truth',
    difficulty: 'medium'
  },
  {
    id: '3',
    challenge: 'Tell your partner one thing you appreciate about them right now.',
    category: 'affection',
    type: 'trust',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'What is something you have been hesitant to share with your partner?',
    category: 'vulnerability',
    type: 'truth',
    difficulty: 'hard'
  },
  {
    id: '5',
    challenge: 'Look into your partner\'s eyes for 30 seconds without speaking.',
    category: 'intimacy',
    type: 'trust',
    difficulty: 'medium'
  }
];

export default function TruthOrTrust({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'truth-or-trust' };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const coupleId = useRef<string | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<string | null>(null);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId.current = user.uid;
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
            state: { currentQuestionIndex, responses, completed: false },
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
                  const currentQId = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex]?.id;
                  if (currentQId && partnerResponses[currentQId]) {
                    setPartnerResponse(partnerResponses[currentQId]);
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
  }, [gameId, currentQuestionIndex]);

  const handleResponseChange = (text: string) => {
    setCurrentResponse(text);
  };

  const submitResponse = () => {
    const currentQ = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
    if (currentQ) {
      const newResponses = { ...responses, [currentQ.id]: currentResponse };
      setResponses(newResponses);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            currentQuestionIndex, 
            responses: newResponses,
            completed: currentQuestionIndex === TRUTH_OR_TRUST_QUESTIONS.length - 1
          }
        });
      }
      
      if (currentQuestionIndex < TRUTH_OR_TRUST_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentResponse('');
        setPartnerResponse(null);
      } else {
        setGameCompleted(true);
      }
    }
  };

  const currentQuestion = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
  const responseType = currentQuestion?.type === 'truth' ? 'Truth Question' : 'Trust Challenge';
  const responseColor = currentQuestion?.type === 'truth' ? theme.COLORS.emotionalConnection : theme.COLORS.romanceHub;

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      {!gameCompleted ? (
        <>
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
                    color: responseColor,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {responseType}
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
                  {currentQuestionIndex + 1}/{TRUTH_OR_TRUST_QUESTIONS.length}
                </Text>
              </View>
              
              <Text 
                variant="body" 
                style={{ 
                  marginBottom: theme.SPACING.lg, 
                  color: theme.COLORS.textPrimary,
                  fontSize: theme.TYPOGRAPHY.title.fontSize
                }}
              >
                {currentQuestion?.question || currentQuestion?.challenge}
              </Text>

              <Text 
                variant="small" 
                style={{ 
                  color: theme.COLORS.textHint, 
                  marginBottom: theme.SPACING.sm 
                }}
              >
                Your response:
              </Text>
              
              <View style={styles.responseContainer}>
                <TouchableOpacity 
                  style={styles.responseBox} 
                  onPress={() => {}} // Placeholder for response input
                >
                  <Text 
                    variant="body" 
                    style={{ 
                      color: currentResponse ? theme.COLORS.textPrimary : theme.COLORS.textHint,
                      fontStyle: currentResponse ? 'normal' : 'italic'
                    }}
                  >
                    {currentResponse || 'Tap to share your response...'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={submitResponse}
                disabled={!currentResponse.trim()}
              >
                <LinearGradient
                  colors={[
                    currentResponse.trim() ? theme.COLORS.primaryGradientStart : '#666',
                    currentResponse.trim() ? theme.COLORS.primaryGradientEnd : '#666'
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text 
                    variant="header" 
                    style={{ 
                      color: currentResponse.trim() ? theme.COLORS.background : theme.COLORS.textHint,
                      textAlign: 'center'
                    }}
                  >
                    {currentQuestionIndex === TRUTH_OR_TRUST_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </GlassCard>
          
          {partnerResponse && (
            <GlassCard style={styles.partnerCard}>
              <Text 
                variant="sass" 
                style={{ 
                  color: theme.COLORS.accentTeal, 
                  marginBottom: theme.SPACING.sm 
                }}
              >
                Partner Responded:
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
        </>
      ) : (
        <GlassCard>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="header" style={{ marginBottom: theme.SPACING.md, color: theme.COLORS.success }}>
              Game Completed!
            </Text>
            <Text variant="body" style={{ marginBottom: theme.SPACING.lg, color: theme.COLORS.textPrimary }}>
              You and your partner have shared {TRUTH_OR_TRUST_QUESTIONS.length} meaningful moments together.
            </Text>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => {
                if (sessionId) {
                  const sessionRef = doc(db, 'game_sessions', sessionId);
                  updateDoc(sessionRef, {
                    finished_at: new Date().toISOString(),
                    score: TRUTH_OR_TRUST_QUESTIONS.length * 20,
                    state: JSON.stringify({ completed: true, responses })
                  });
                }
                navigation.goBack();
              }}
            >
              <LinearGradient
                colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
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
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Truth or Trust',
    description: 'Choose between revealing truths or completing trust challenges',
    category: 'emotional-connection' as const,
    difficulty: 'medium' as const,
    xpReward: 60,
    currentStep: currentQuestionIndex,
    totalTime: 900,
    playerData: { 
      vulnerabilityScore: Object.keys(responses).length > 3 ? 90 : Object.keys(responses).length > 1 ? 70 : 50, 
      honestyScore: Object.keys(responses).length > 3 ? 85 : Object.keys(responses).length > 1 ? 65 : 45, 
      completionTime: 0, 
      partnerSync: partnerResponse ? 80 : 20 
    },
  };

  return (
    <GameContainer 
      state={baseState} 
      inputs={["text"]} 
      inputArea={inputArea} 
      onComplete={() => {
        if (sessionId) {
          const sessionRef = doc(db, 'game_sessions', sessionId);
          updateDoc(sessionRef, {
            finished_at: new Date().toISOString(),
            score: Object.keys(responses).length * 20,
            state: JSON.stringify({ completed: true, responses })
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
  responseContainer: {
    marginBottom: theme.SPACING.lg,
  },
  responseBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    minHeight: 100,
  },
  submitButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  partnerCard: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.md,
  },
});