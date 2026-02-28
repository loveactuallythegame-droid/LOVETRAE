import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, SIZES } from '../theme';
import { useGameStore } from '../lib/game-store';
import { gamesApi, marcieApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

interface GameState {
  currentQuestion: string;
  partnerAAnswer: string;
  partnerBAnswer: string;
  revealedAnswers: { A: boolean; B: boolean };
  gamePhase: 'intro' | 'question' | 'answer' | 'reveal' | 'results';
  sessionId: string;
  isLoading: boolean;
  score: number;
  step: number;
  totalSteps: number;
  marcieFeedback: string;
  marcieAnimation: string;
}

const newlywedQuestions = [
  "What is our top family value?",
  "What moment made you feel most connected to me this week?",
  "What is your biggest fear about our future together?",
  "What do you need more of from me emotionally?",
  "What memory do you revisit when you need to feel safe?",
  "What part of yourself do you hide to protect me?",
  "What truth about us have you been afraid to say out loud?",
  "What do you want our legacy to be?"
];

const HeartToHeartNewlywedGameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { updateGameProgress, currentGameSession } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: '',
    partnerAAnswer: '',
    partnerBAnswer: '',
    revealedAnswers: { A: false, B: false },
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    score: 2450,
    step: 6,
    totalSteps: 8,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to play this game.');
      navigation.goBack();
      return;
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Create game session with backend
      const session = await gamesApi.createSession(
        user.uid,
        'heart-to-heart-newlywed',
        'emotional-connection'
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('heart-to-heart-newlywed', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    const randomQuestion = newlywedQuestions[Math.floor(Math.random() * newlywedQuestions.length)];
    setGameState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      gamePhase: 'question'
    }));
  };

  const handleAnswerSubmit = async (partner: 'A' | 'B', answer: string) => {
    try {
      setGameState(prev => ({
        ...prev,
        isLoading: true,
        [`partner${partner}Answer`]: answer
      }));

      // Get Dr. Marcie's feedback
      const context = `Heart to Heart Newlywed game - Partner ${partner} answer`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        answer,
        1 // Tough Love Rookie level for gentle feedback
      );

      setGameState(prev => ({
        ...prev,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'reveal',
        isLoading: false
      }));

      // Update game progress
      const progress = (gameState.step / gameState.totalSteps) * 100;
      updateGameProgress('heart-to-heart-newlywed', progress);

    } catch (error) {
      console.error('Failed to process answer:', error);
      Alert.alert('Processing Error', 'Failed to process your answer. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const revealAnswer = (partner: 'A' | 'B') => {
    setGameState(prev => ({
      ...prev,
      revealedAnswers: {
        ...prev.revealedAnswers,
        [partner]: true
      }
    }));

    // Calculate score based on answer similarity
    if (gameState.revealedAnswers.A && gameState.revealedAnswers.B) {
      calculateScore();
    }
  };

  const calculateScore = () => {
    // Simple semantic similarity calculation
    const answerA = gameState.partnerAAnswer.toLowerCase();
    const answerB = gameState.partnerBAnswer.toLowerCase();
    
    // Check for semantic similarity (in real app, this would use AI)
    const semanticKeywords = {
      'integrity': ['honesty', 'truth', 'authenticity', 'genuine'],
      'family': ['children', 'home', 'together', 'unity'],
      'love': ['care', 'affection', 'connection', 'bond'],
      'communication': ['talk', 'listen', 'understand', 'share'],
      'trust': ['faith', 'confidence', 'reliance', 'belief']
    };

    let similarityScore = 0;
    Object.entries(semanticKeywords).forEach(([keyword, synonyms]) => {
      const aHasKeyword = answerA.includes(keyword) || synonyms.some(syn => answerA.includes(syn));
      const bHasKeyword = answerB.includes(keyword) || synonyms.some(syn => answerB.includes(syn));
      
      if (aHasKeyword && bHasKeyword) {
        similarityScore += 100;
      }
    });

    // Update score based on similarity
    const points = Math.min(500, similarityScore);
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const nextQuestion = () => {
    if (gameState.step < gameState.totalSteps) {
      setGameState(prev => ({
        ...prev,
        step: prev.step + 1,
        partnerAAnswer: '',
        partnerBAnswer: '',
        revealedAnswers: { A: false, B: false },
        gamePhase: 'question'
      }));
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Update game session with final results
      await gamesApi.updateSession(
        gameState.sessionId,
        gameState.score,
        true,
        [
          {
            question: gameState.currentQuestion,
            partnerA_answer: gameState.partnerAAnswer,
            partnerB_answer: gameState.partnerBAnswer,
            timestamp: new Date().toISOString()
          }
        ]
      );

      // Update global game state
      updateGameProgress('heart-to-heart-newlywed', 100);

      navigation.navigate('GameResultsScreen', {
        gameId: 'heart-to-heart-newlywed',
        score: gameState.score,
        sessionId: gameState.sessionId
      });

    } catch (error) {
      console.error('Failed to finish game:', error);
      Alert.alert('Game Error', 'Failed to complete the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Loading state
  if (gameState.isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryGradientStart} />
          <Text style={styles.loadingText}>Processing your answer...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Intro phase
  if (gameState.gamePhase === 'intro') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.introContainer}>
            <Text style={styles.gameTitle}>HEART TO HEART</Text>
            <Text style={styles.gameSubtitle}>Newlywed Game - Deep Connection Edition</Text>
            
            <View style={styles.introCard}>
              <Text style={styles.introText}>
                This isn't your typical newlywed game. We're diving deep into the 
                emotional core of your relationship. Be prepared for vulnerability, 
                honesty, and profound connection.
              </Text>
              
              <Text style={styles.introWarning}>
                💡 Tip: The goal isn't perfect alignment, but authentic understanding.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.startButton}
              onPress={startGame}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                style={styles.startButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.startButtonText}>START CONNECTION</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Question phase
  if (gameState.gamePhase === 'question') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              STEP {gameState.step}/{gameState.totalSteps} - ALIGNMENT CHECK
            </Text>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[COLORS.innerLineStart, COLORS.innerLineEnd]}
                style={[
                  styles.progressBarFill, 
                  { width: `${(gameState.step / gameState.totalSteps) * 100}%` }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          <Text style={styles.mainQuestion}>{gameState.currentQuestion}</Text>

          <Text style={styles.instructionText}>
            Both partners should answer this question independently. 
            Honesty creates the deepest connection.
          </Text>

          <View style={styles.answerButtonsContainer}>
            <TouchableOpacity 
              style={styles.answerButton}
              onPress={() => setGameState(prev => ({ ...prev, gamePhase: 'answer' }))}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.accentViolet, COLORS.accentRose]}
                style={styles.answerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.answerButtonText}>ANSWER NOW</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Answer phase
  if (gameState.gamePhase === 'answer') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.answerContainer}>
            <Text style={styles.answerTitle}>YOUR ANSWER</Text>
            <Text style={styles.answerQuestion}>{gameState.currentQuestion}</Text>
            
            <View style={styles.answerInputContainer}>
              <TextInput
                style={styles.answerInput}
                placeholder="Type your honest answer..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={gameState.partnerAAnswer}
                onChangeText={(text) => setGameState(prev => ({ 
                  ...prev, 
                  partnerAAnswer: text 
                }))}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.submitAnswerButton,
                !gameState.partnerAAnswer.trim() && styles.submitAnswerButtonDisabled
              ]}
              onPress={() => handleAnswerSubmit('A', gameState.partnerAAnswer)}
              disabled={!gameState.partnerAAnswer.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                style={styles.submitAnswerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitAnswerButtonText}>SUBMIT ANSWER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Reveal phase
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient 
        colors={[COLORS.background, COLORS.surface]} 
        style={styles.backgroundGradient}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.revealContainer}>
          <Text style={styles.revealTitle}>ANSWER REVEAL</Text>
          <Text style={styles.revealQuestion}>{gameState.currentQuestion}</Text>

          <View style={styles.gameBoard}>
            <PartnerAnswerCard 
              partnerName="PARTNER A" 
              answer={gameState.partnerAAnswer} 
              status={gameState.revealedAnswers.A ? 'revealed' : 'hidden'}
              onReveal={() => revealAnswer('A')}
            />
            
            <View style={styles.matchIndicator}>
              <Text style={{ fontSize: 40 }}>💖</Text>
              <View style={styles.matchTextBox}>
                <Text style={styles.matchText}>SEMANTIC MATCH</Text>
                <Text style={styles.matchComment}>
                  "{gameState.marcieFeedback}"
                </Text>
              </View>
            </View>

            <PartnerAnswerCard 
              partnerName="PARTNER B" 
              answer={gameState.partnerBAnswer} 
              status={gameState.revealedAnswers.B ? 'revealed' : 'hidden'}
              onReveal={() => revealAnswer('B')}
            />
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>CURRENT SCORE</Text>
            <Text style={styles.scoreValue}>${gameState.score}</Text>
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={nextQuestion}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accentTeal, COLORS.accentViolet]}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextButtonText}>
                {gameState.step < gameState.totalSteps ? 'NEXT QUESTION' : 'FINISH GAME'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PartnerAnswerCard = ({ partnerName, answer, status, onReveal }) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity
      style={[
        styles.card, 
        status === 'hidden' && styles.cardHidden
      ]}
      onPress={onReveal}
      disabled={status === 'revealed'}
      activeOpacity={0.8}
    >
      {status === 'hidden' ? (
        <Text style={styles.cardHiddenText}>?</Text>
      ) : (
        <Text style={styles.cardAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
    <Text style={styles.partnerName}>{partnerName}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  
  // Intro styles
  introContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  gameTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  gameSubtitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.lg,
  },
  introText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  introWarning: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accentYellow,
    fontWeight: '600',
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Progress styles
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  
  // Question styles
  mainQuestion: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  answerButtonsContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  answerButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.accentViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  answerButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  answerButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Answer styles
  answerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  answerTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  answerQuestion: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  answerInputContainer: {
    marginBottom: SPACING.xl,
  },
  answerInput: {
    ...TYPOGRAPHY.body,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    color: COLORS.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitAnswerButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  submitAnswerButtonDisabled: {
    opacity: 0.6,
  },
  submitAnswerButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  submitAnswerButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Reveal styles
  revealContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  revealTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  revealQuestion: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  gameBoard: {
    marginBottom: SPACING.xl,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  matchTextBox: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  matchText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accentPink,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  matchComment: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  scoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    ...TYPOGRAPHY.header,
    color: COLORS.accentYellow,
    fontSize: 32,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.accentTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  nextButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Partner card styles
  cardContainer: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  card: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  cardHidden: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardHiddenText: {
    ...TYPOGRAPHY.header,
    color: COLORS.textSecondary,
    fontSize: 48,
  },
  cardAnswer: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  partnerName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});

export default HeartToHeartNewlywedGameScreen;
