import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const JEOPARDY_CATEGORIES = [
  {
    name: "Accountability Plans",
    clues: [
      { value: 100, question: "This involves taking responsibility for your actions", answer: "What is ownership?" },
      { value: 200, question: "This is the first step to repairing trust", answer: "What is acknowledgment?" },
      { value: 300, question: "This describes making amends for harm caused", answer: "What is restitution?" },
      { value: 400, question: "This is about changing harmful patterns", answer: "What is behavioral change?" },
      { value: 500, question: "This requires consistent follow-through over time", answer: "What is reliability?" }
    ]
  },
  {
    name: "Redefinition",
    clues: [
      { value: 100, question: "This is the process of changing how you see your relationship", answer: "What is reframing?" },
      { value: 200, question: "This involves creating new narratives about past events", answer: "What is rewriting history?" },
      { value: 300, question: "This means establishing new expectations", answer: "What is setting boundaries?" },
      { value: 400, question: "This is about building new traditions", answer: "What is creating rituals?" },
      { value: 500, question: "This involves developing a shared vision", answer: "What is co-creating the future?" }
    ]
  },
  {
    name: "Integration",
    clues: [
      { value: 100, question: "This refers to incorporating new behaviors", answer: "What is assimilation?" },
      { value: 200, question: "This involves blending old and new selves", answer: "What is synthesis?" },
      { value: 300, question: "This is about maintaining growth over time", answer: "What is sustainability?" },
      { value: 400, question: "This involves bringing insights into daily life", answer: "What is application?" },
      { value: 500, question: "This is the ultimate goal of relationship growth", answer: "What is transformation?" }
    ]
  }
];

export default function RelationalJeopardy({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'relational-jeopardy' };
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [scores, setScores] = useState({ user: 0, partner: 0 });
  const [selectedClue, setSelectedClue] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[][]>([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ]);
  const coupleId = useRef<string | null>(null);
  const [partnerScore, setPartnerScore] = useState(0);
  const [dailyDouble, setDailyDouble] = useState<{category: number, clue: number} | null>(null);

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
            state: { scores, revealedAnswers, selectedClue, gameCompleted },
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
                if (data.state) {
                  if (data.state.scores) {
                    setPartnerScore(data.state.scores.partner || 0);
                  }
                  if (data.state.revealedAnswers) {
                    setRevealedAnswers(data.state.revealedAnswers);
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
  }, [gameId]);

  const handleCluePress = (categoryIndex: number, clueIndex: number) => {
    if (revealedAnswers[categoryIndex][clueIndex]) return;
    
    const clue = JEOPARDY_CATEGORIES[categoryIndex].clues[clueIndex];
    setSelectedClue({ categoryIndex, clueIndex, ...clue });
  };

  const handleAnswerSubmit = () => {
    if (!selectedClue || !answer) return;
    
    // Check if answer is correct (simplified for demo)
    const isCorrect = answer.toLowerCase().includes(selectedClue.answer.split(' ')[2].toLowerCase());
    
    let newScore = scores.user;
    if (isCorrect) {
      newScore += selectedClue.value;
    } else {
      newScore -= selectedClue.value;
    }
    
    const newScores = { ...scores, user: Math.max(0, newScore) };
    setScores(newScores);
    
    // Mark clue as revealed
    const newRevealed = [...revealedAnswers];
    newRevealed[selectedClue.categoryIndex][selectedClue.clueIndex] = true;
    setRevealedAnswers(newRevealed);
    
    // Update in Firebase
    if (sessionId) {
      const sessionRef = doc(db, 'game_sessions', sessionId);
      updateDoc(sessionRef, {
        state: { 
          scores: newScores, 
          revealedAnswers: newRevealed,
          selectedClue: null,
          gameCompleted: newRevealed.every(cat => cat.every(clue => clue))
        }
      });
    }
    
    setAnswer('');
    setSelectedClue(null);
  };

  const handleDailyDouble = () => {
    // For demo purposes, we'll just reveal a random clue as daily double
    const catIndex = Math.floor(Math.random() * 3);
    const clueIndex = Math.floor(Math.random() * 5);
    setDailyDouble({ category: catIndex, clue: clueIndex });
  };

  const renderClueCell = (clue: any, categoryIndex: number, clueIndex: number) => {
    const isRevealed = revealedAnswers[categoryIndex][clueIndex];
    const isDailyDouble = dailyDouble?.category === categoryIndex && dailyDouble?.clue === clueIndex;
    
    if (isRevealed) {
      return (
        <GlassCard style={styles.revealedCell}>
          <Text variant="small" style={{ color: theme.COLORS.textSecondary, textAlign: 'center' }}>
            {clue.question}
          </Text>
          <Text variant="small" style={{ color: theme.COLORS.accentTeal, textAlign: 'center', marginTop: 5 }}>
            Answer: {clue.answer}
          </Text>
        </GlassCard>
      );
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.clueCell,
          isDailyDouble && styles.dailyDoubleCell
        ]}
        onPress={() => handleCluePress(categoryIndex, clueIndex)}
      >
        <LinearGradient
          colors={[
            isDailyDouble ? theme.COLORS.warning : theme.COLORS.primaryGradientStart,
            isDailyDouble ? theme.COLORS.error : theme.COLORS.primaryGradientEnd
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.clueGradient}
        >
          <Text 
            variant="header" 
            style={{ 
              color: theme.COLORS.background, 
              textAlign: 'center',
              fontSize: isDailyDouble ? theme.TYPOGRAPHY.small.fontSize : theme.TYPOGRAPHY.body.fontSize
            }}
          >
            {isDailyDouble ? 'DD' : `$${clue.value}`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      <GlassCard>
        <LinearGradient
          colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View style={styles.headerContainer}>
            <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
              Relational Jeopardy!
            </Text>
            <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>
              Categories designed by couples who rebuilt
            </Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreColumn}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>You</Text>
              <Text variant="header" style={{ color: theme.COLORS.success, fontSize: 24 }}>${scores.user}</Text>
            </View>
            <View style={styles.scoreColumn}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>Partner</Text>
              <Text variant="header" style={{ color: theme.COLORS.accentViolet, fontSize: 24 }}>${partnerScore}</Text>
            </View>
          </View>
          
          <View style={styles.boardContainer}>
            <View style={styles.categoriesRow}>
              {JEOPARDY_CATEGORIES.map((category, catIndex) => (
                <View key={catIndex} style={styles.categoryCell}>
                  <Text 
                    variant="small" 
                    style={{ 
                      color: theme.COLORS.textPrimary, 
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.cluesGrid}>
              {JEOPARDY_CATEGORIES[0].clues.map((_, clueIndex) => (
                <View key={clueIndex} style={styles.clueRow}>
                  {JEOPARDY_CATEGORIES.map((_, catIndex) => (
                    <View key={`${catIndex}-${clueIndex}`} style={styles.clueCellWrapper}>
                      {renderClueCell(JEOPARDY_CATEGORIES[catIndex].clues[clueIndex], catIndex, clueIndex)}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          {selectedClue && (
            <View style={styles.answerContainer}>
              <Text variant="body" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
                {selectedClue.question}
              </Text>
              
              <Text variant="small" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                Your Answer:
              </Text>
              <View style={styles.answerInputContainer}>
                <TouchableOpacity 
                  style={styles.answerInput} 
                  onPress={() => Alert.prompt('Your Answer', 'Type your answer:', (text) => setAnswer(text))}
                >
                  <Text 
                    variant="body" 
                    style={{ 
                      color: answer ? theme.COLORS.textPrimary : theme.COLORS.textHint,
                      fontStyle: answer ? 'normal' : 'italic'
                    }}
                  >
                    {answer || 'Type your answer...'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleAnswerSubmit}
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
                    Submit Answer
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </GlassCard>
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Relational Jeopardy!',
    description: 'Categories designed by couples who rebuilt',
    category: 'game-show' as const,
    difficulty: 'hard' as const,
    xpReward: 80,
    currentStep: revealedAnswers.flat().filter(Boolean).length,
    totalTime: 1200,
    playerData: { 
      vulnerabilityScore: scores.user > 500 ? 95 : scores.user > 200 ? 80 : 60, 
      honestyScore: scores.user > 500 ? 90 : scores.user > 200 ? 75 : 55, 
      completionTime: 0, 
      partnerSync: partnerScore > 0 ? 85 : 20 
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
            score: scores.user,
            state: JSON.stringify({ completed: true, finalScore: scores.user })
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
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.SPACING.lg,
  },
  scoreColumn: {
    alignItems: 'center',
  },
  boardContainer: {
    flex: 1,
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: theme.SPACING.md,
  },
  categoryCell: {
    flex: 1,
    padding: theme.SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  cluesGrid: {
    flex: 1,
  },
  clueRow: {
    flexDirection: 'row',
    marginBottom: theme.SPACING.sm,
  },
  clueCellWrapper: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  clueCell: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyDoubleCell: {
    transform: [{ scale: 1.1 }],
  },
  clueGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.SIZES.borderRadius,
  },
  revealedCell: {
    flex: 1,
    padding: theme.SPACING.sm,
    justifyContent: 'center',
  },
  answerContainer: {
    marginTop: theme.SPACING.lg,
  },
  answerInputContainer: {
    marginBottom: theme.SPACING.md,
  },
  answerInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    minHeight: 50,
  },
  submitButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
});