import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const SURVEY_QUESTIONS = [
  {
    id: '1',
    question: "What's your partner's biggest complaint about your relationship?",
    answers: [
      { text: "Not enough quality time", value: 42, rank: 1 },
      { text: "Poor communication", value: 28, rank: 2 },
      { text: "Lack of physical affection", value: 15, rank: 3 },
      { text: "Trust issues", value: 10, rank: 4 },
      { text: "Different life goals", value: 5, rank: 5 }
    ]
  },
  {
    id: '2',
    question: "What's the most important thing for a strong relationship?",
    answers: [
      { text: "Good communication", value: 35, rank: 1 },
      { text: "Physical intimacy", value: 25, rank: 2 },
      { text: "Shared values", value: 20, rank: 3 },
      { text: "Trust", value: 15, rank: 4 },
      { text: "Quality time", value: 5, rank: 5 }
    ]
  },
  {
    id: '3',
    question: "What's your partner's favorite way to show love?",
    answers: [
      { text: "Words of affirmation", value: 30, rank: 1 },
      { text: "Acts of service", value: 25, rank: 2 },
      { text: "Gifts", value: 20, rank: 3 },
      { text: "Quality time", value: 15, rank: 4 },
      { text: "Physical touch", value: 10, rank: 5 }
    ]
  }
];

export default function IntimacyFeud({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'intimacy-feud' };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const coupleId = useRef<string | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<any>(null);

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
            state: { currentQuestionIndex, responses, selectedAnswers, guesses, completed: false },
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
                  const currentQId = SURVEY_QUESTIONS[currentQuestionIndex]?.id;
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

  const selectAnswer = (answer: string) => {
    if (selectedAnswers.length < 3 && !selectedAnswers.includes(answer)) {
      setSelectedAnswers(prev => [...prev, answer]);
    }
  };

  const removeAnswer = (answer: string) => {
    setSelectedAnswers(prev => prev.filter(a => a !== answer));
  };

  const submitGuesses = () => {
    const currentQ = SURVEY_QUESTIONS[currentQuestionIndex];
    const correctAnswers = currentQ.answers.slice(0, 3).map(a => a.text);
    const matchedAnswers = selectedAnswers.filter(sa => correctAnswers.includes(sa));
    
    // Calculate score based on matches
    let score = 0;
    matchedAnswers.forEach(match => {
      const answerObj = currentQ.answers.find(a => a.text === match);
      if (answerObj) {
        score += answerObj.value * answerObj.rank; // Higher rank = more points
      }
    });
    
    const newGuesses = [...guesses, ...matchedAnswers];
    setGuesses(newGuesses);
    
    const newResponses = { 
      ...responses, 
      [currentQ.id]: { 
        selected: selectedAnswers, 
        correct: correctAnswers,
        score: score,
        matched: matchedAnswers
      } 
    };
    setResponses(newResponses);
    
    // Update in Firebase
    if (sessionId) {
      const sessionRef = doc(db, 'game_sessions', sessionId);
      updateDoc(sessionRef, {
        state: { 
          currentQuestionIndex, 
          responses: newResponses,
          selectedAnswers: [],
          guesses: newGuesses,
          completed: currentQuestionIndex === SURVEY_QUESTIONS.length - 1
        }
      });
    }
    
    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setPartnerResponse(null);
    } else {
      setGameCompleted(true);
    }
  };

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];

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
              <Text variant="header" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
                The Intimacy Feud
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
                {currentQuestionIndex + 1}/{SURVEY_QUESTIONS.length}
              </Text>
            </View>
            
            <Text variant="title" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.lg, textAlign: 'center' }}>
              Survey Says...
            </Text>
            
            <Text variant="body" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.lg, textAlign: 'center' }}>
              {currentQuestion.question}
            </Text>
            
            <View style={styles.answersContainer}>
              {currentQuestion.answers.map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answerOption,
                    selectedAnswers.includes(answer.text) && styles.selectedAnswer
                  ]}
                  onPress={() => {
                    if (selectedAnswers.includes(answer.text)) {
                      removeAnswer(answer.text);
                    } else if (selectedAnswers.length < 3) {
                      selectAnswer(answer.text);
                    }
                  }}
                >
                  <LinearGradient
                    colors={
                      selectedAnswers.includes(answer.text)
                        ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.answerGradient}
                  >
                    <Text
                      variant="body"
                      style={{
                        color:
                          selectedAnswers.includes(answer.text)
                            ? theme.COLORS.background
                            : theme.COLORS.textPrimary
                      }}
                    >
                      {answer.text} - {answer.value}% ({answer.rank})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.selectedContainer}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                Your Top 3 Guesses:
              </Text>
              <View style={styles.selectedList}>
                {selectedAnswers.map((answer, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.selectedTag} 
                    onPress={() => removeAnswer(answer)}
                  >
                    <Text 
                      variant="small" 
                      style={{ 
                        color: theme.COLORS.background,
                        fontSize: theme.TYPOGRAPHY.small.fontSize
                      }}
                    >
                      {answer} ×
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={submitGuesses}
              disabled={selectedAnswers.length !== 3}
            >
              <LinearGradient
                colors={[
                  selectedAnswers.length === 3 ? theme.COLORS.primaryGradientStart : '#666',
                  selectedAnswers.length === 3 ? theme.COLORS.primaryGradientEnd : '#666'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: selectedAnswers.length === 3 ? theme.COLORS.background : theme.COLORS.textHint,
                    textAlign: 'center'
                  }}
                >
                  {currentQuestionIndex === SURVEY_QUESTIONS.length - 1 ? 'Finish Game' : 'Lock In Answers'}
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
              You matched on {guesses.length} out of {SURVEY_QUESTIONS.length * 3} possible answers
            </Text>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => {
                if (sessionId) {
                  const sessionRef = doc(db, 'game_sessions', sessionId);
                  updateDoc(sessionRef, {
                    finished_at: new Date().toISOString(),
                    score: guesses.length * 20,
                    state: JSON.stringify({ completed: true, responses, totalMatches: guesses.length })
                  });
                }
                navigation.goBack();
              }}
            >
              <LinearGradient
                colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
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
          <Text variant="sass" style={{ color: theme.COLORS.accentTeal, marginBottom: theme.SPACING.sm }}>
            Partner's Guesses:
          </Text>
          <View style={styles.partnerAnswers}>
            {partnerResponse.selected.map((answer: string, index: number) => (
              <View key={index} style={styles.partnerAnswerItem}>
                <Text variant="body" style={{ color: theme.COLORS.textSecondary }}>
                  {answer}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>
      )}
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'The Intimacy Feud',
    description: 'Survey says... be boring. Be authentic. Be real.',
    category: 'game-show' as const,
    difficulty: 'medium' as const,
    xpReward: 75,
    currentStep: currentQuestionIndex,
    totalTime: 600,
    playerData: { 
      vulnerabilityScore: guesses.length > 5 ? 90 : guesses.length > 2 ? 70 : 50, 
      honestyScore: guesses.length > 5 ? 85 : guesses.length > 2 ? 65 : 45, 
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
            score: guesses.length * 20,
            state: JSON.stringify({ completed: true, responses, totalMatches: guesses.length })
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
  answersContainer: {
    gap: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
  },
  answerOption: {
    borderRadius: theme.SIZES.borderRadius,
    overflow: 'hidden',
  },
  selectedAnswer: {
    borderWidth: 2,
    borderColor: theme.COLORS.success,
  },
  answerGradient: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  selectedContainer: {
    marginBottom: theme.SPACING.lg,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.SPACING.sm,
  },
  selectedTag: {
    backgroundColor: theme.COLORS.primaryGradientStart,
    borderRadius: 20,
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
  },
  submitButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  partnerCard: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.md,
  },
  partnerAnswers: {
    gap: theme.SPACING.sm,
  },
  partnerAnswerItem: {
    padding: theme.SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.SIZES.borderRadius,
  },
});