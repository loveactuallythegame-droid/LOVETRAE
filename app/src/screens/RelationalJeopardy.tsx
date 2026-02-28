import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
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
  jeopardyCategories: string[];
  pointValues: number[];
  answeredTiles: string[];
  activeChallenge: string;
  score: number;
  gamePhase: 'intro' | 'board' | 'challenge' | 'results';
  sessionId: string;
  isLoading: boolean;
  currentCategory: string;
  currentPoints: number;
  dailyDouble: boolean;
  finalJeopardy: boolean;
  marcieFeedback: string;
  marcieAnimation: string;
}

const jeopardyCategories = [
  'SHARED HISTORY', 
  'THE TRUTH HURTS', 
  'FUTURE ECHOES', 
  'RED FLAGS', 
  'EMOTIONAL DEBT'
];

const pointValues = [100, 200, 300, 400, 500];

const RelationalJeopardyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { updateGameProgress, currentGameSession } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    jeopardyCategories,
    pointValues,
    answeredTiles: [],
    activeChallenge: 'Select a challenge from the board.',
    score: 2450,
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    currentCategory: '',
    currentPoints: 0,
    dailyDouble: false,
    finalJeopardy: false,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  // Jeopardy questions based on Design Bible specifications
  const jeopardyQuestions = {
    'SHARED HISTORY': {
      100: "What was the first thing you noticed about your partner that made you think 'this is different'?",
      200: "Describe the moment you realized this relationship was worth fighting for.",
      300: "What pattern from your family of origin have you successfully broken together?",
      400: "What story about your relationship do you tell differently now than you did a year ago?",
      500: "What truth about your shared history have you both agreed to stop editing?"
    },
    'THE TRUTH HURTS': {
      100: "What do you pretend not to notice to keep the peace?",
      200: "What complaint do you have that you've never said out loud?",
      300: "What part of your partner's story do you think they're still lying to themselves about?",
      400: "What truth about yourself have you been avoiding because it might hurt them?",
      500: "What are you both pretending is fine when it's actually breaking?"
    },
    'FUTURE ECHOES': {
      100: "What version of yourselves are you trying to grow into?",
      200: "What fear about your future together keeps you up at night?",
      300: "What dream have you given up on that you want them to know about?",
      400: "What would you sacrifice to ensure this relationship survives?",
      500: "What future are you both walking toward that you're afraid to name?"
    },
    'RED FLAGS': {
      100: "What warning sign did you ignore that you now understand?",
      200: "What pattern do you see repeating that scares you?",
      300: "What boundary have you let them cross that you shouldn't have?",
      400: "What part of this relationship feels like it's on life support?",
      500: "What are you both doing that's slowly killing the connection?"
    },
    'EMOTIONAL DEBT': {
      100: "What apology do you still owe that you've been avoiding?",
      200: "What forgiveness have you been withholding?",
      300: "What emotional labor are you tired of doing alone?",
      400: "What debt do you feel you can never repay?",
      500: "What would it take to balance the emotional ledger between you?"
    }
  };

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
        'relational-jeopardy',
        'game-show'
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('relational-jeopardy', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'board'
    }));
  };

  const handleTilePress = async (category: string, points: number) => {
    const tileKey = `${category}-${points}`;
    
    if (gameState.answeredTiles.includes(tileKey)) {
      return; // Already answered
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      const question = jeopardyQuestions[category][points];
      const isDailyDouble = Math.random() < 0.1; // 10% chance
      
      // Get Dr. Marcie's introduction for this challenge
      const context = `Relational Jeopardy - ${category} for $${points}`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        question,
        3 // Radical Truth Wizard level for deep insights
      );

      setGameState(prev => ({
        ...prev,
        currentCategory: category,
        currentPoints: points,
        activeChallenge: `For $${points} in ${category}: ${question}`,
        dailyDouble: isDailyDouble,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'challenge',
        isLoading: false
      }));

      // Mark tile as answered
      setGameState(prev => ({
        ...prev,
        answeredTiles: [...prev.answeredTiles, tileKey]
      }));

    } catch (error) {
      console.error('Failed to load challenge:', error);
      Alert.alert('Challenge Error', 'Failed to load the challenge. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const submitAnswer = async (answer: string) => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Get Dr. Marcie's feedback on the answer
      const context = `Relational Jeopardy answer evaluation - ${gameState.currentCategory} for $${gameState.currentPoints}`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        answer,
        2 // Reality Check Specialist level
      );

      // Calculate points (simplified - in real app, this would be more sophisticated)
      const points = gameState.dailyDouble ? gameState.currentPoints * 2 : gameState.currentPoints;
      const newScore = gameState.score + points;

      // Update game session
      await gamesApi.updateSession(
        gameState.sessionId,
        newScore,
        false,
        [
          {
            category: gameState.currentCategory,
            points: gameState.currentPoints,
            question: gameState.activeChallenge,
            answer: answer,
            daily_double: gameState.dailyDouble,
            timestamp: new Date().toISOString()
          }
        ]
      );

      setGameState(prev => ({
        ...prev,
        score: newScore,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        isLoading: false
      }));

      // Update global game state
      const progress = (gameState.answeredTiles.length / 25) * 100; // 5x5 grid
      updateGameProgress('relational-jeopardy', progress);

      // Check if all tiles are answered
      if (gameState.answeredTiles.length >= 24) { // All tiles answered
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gamePhase: 'results' }));
        }, 3000);
      } else {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gamePhase: 'board' }));
        }, 3000);
      }

    } catch (error) {
      console.error('Failed to submit answer:', error);
      Alert.alert('Submission Error', 'Failed to submit your answer. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const finishGame = () => {
    navigation.navigate('GameResultsScreen', {
      gameId: 'relational-jeopardy',
      score: gameState.score,
      sessionId: gameState.sessionId
    });
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
          <Text style={styles.loadingText}>Loading challenge...</Text>
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
            <Text style={styles.mainTitle}>
              ROUND 4: <Text style={styles.titleHighlight}>THE RECONSTRUCTION</Text>
            </Text>
            <Text style={styles.subtitle}>
              Navigate the debris of deception to earn Truth Credits.
            </Text>
            
            <View style={styles.introCard}>
              <Text style={styles.introText}>
                Categories designed by couples who rebuilt their relationships 
                after betrayal. Each question reveals deeper truths about 
                your connection.
              </Text>
              
              <Text style={styles.introWarning}>
                ⚠️ These questions are designed to surface difficult truths. 
                Ensure you're both ready for deep emotional work.
              </Text>
            </View>

            <View style={styles.categoriesPreview}>
              {gameState.jeopardyCategories.map((category, index) => (
                <View key={category} style={styles.categoryPreviewItem}>
                  <Text style={styles.categoryPreviewText}>{category}</Text>
                </View>
              ))}
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
                <Text style={styles.startButtonText}>ENTER THE BOARD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Board phase
  if (gameState.gamePhase === 'board') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.gameContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>TRUTH CREDITS</Text>
              <Text style={styles.scoreValue}>${gameState.score}</Text>
            </View>

            <View style={styles.gameBoard}>
              <View style={styles.headerRow}>
                {gameState.jeopardyCategories.map(cat => (
                  <View key={cat} style={styles.headerCell}>
                    <Text style={styles.headerText} numberOfLines={2}>
                      {cat}
                    </Text>
                  </View>
                ))}
              </View>
              
              {gameState.pointValues.map(points => (
                <View key={points} style={styles.row}>
                  {gameState.jeopardyCategories.map(cat => {
                    const tileKey = `${cat}-${points}`;
                    const isAnswered = gameState.answeredTiles.includes(tileKey);
                    const isDailyDouble = Math.random() < 0.05; // 5% chance per tile
                    
                    return (
                      <JeopardyTile
                        key={`${cat}-${points}`}
                        points={points}
                        category={cat}
                        onPress={handleTilePress}
                        answered={isAnswered}
                        isDailyDouble={isDailyDouble && !isAnswered}
                      />
                    );
                  })}
                </View>
              ))}
            </View>

            {gameState.answeredTiles.length >= 20 && (
              <TouchableOpacity 
                style={styles.finalJeopardyButton}
                onPress={() => setGameState(prev => ({ 
                  ...prev, 
                  finalJeopardy: true,
                  gamePhase: 'challenge' 
                }))}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.accentYellow, COLORS.accentOrange]}
                  style={styles.finalJeopardyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.finalJeopardyButtonText}>FINAL JEOPARDY</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Challenge phase
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient 
        colors={[COLORS.background, COLORS.surface]} 
        style={styles.backgroundGradient}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.challengeContainer}>
          {gameState.dailyDouble && (
            <View style={styles.dailyDoubleBanner}>
              <Text style={styles.dailyDoubleText}>🎯 DAILY DOUBLE 🎯</Text>
            </View>
          )}
          
          {gameState.finalJeopardy && (
            <View style={styles.finalJeopardyBanner}>
              <Text style={styles.finalJeopardyText}>🏆 FINAL JEOPARDY 🏆</Text>
            </View>
          )}

          <View style={styles.challengeHeader}>
            <Text style={styles.challengeCategory}>
              {gameState.finalJeopardy ? 'FINAL JEOPARDY' : gameState.currentCategory}
            </Text>
            <Text style={styles.challengePoints}>
              {gameState.finalJeopardy ? 'WAGER' : `$${gameState.currentPoints}`}
            </Text>
          </View>

          <View style={styles.challengeContent}>
            <Text style={styles.challengeText}>
              {gameState.activeChallenge}
            </Text>

            {gameState.marcieFeedback && (
              <View style={styles.marcieContainer}>
                <Text style={styles.marcieAvatar}>👩‍⚕️</Text>
                <Text style={styles.marcieName}>DR. MARCIE LISS</Text>
                <View style={styles.marcieFeedbackContainer}>
                  <Text style={styles.marcieFeedback}>
                    "{gameState.marcieFeedback}"
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.answerSection}>
              <Text style={styles.answerPrompt}>Your Answer:</Text>
              <TextInput
                style={styles.answerInput}
                placeholder="Type your answer..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={gameState.activeChallenge}
                onChangeText={(text) => setGameState(prev => ({ 
                  ...prev, 
                  activeChallenge: text 
                }))}
              />

              <TouchableOpacity 
                style={styles.submitAnswerButton}
                onPress={() => submitAnswer(gameState.activeChallenge)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                  style={styles.submitAnswerButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.submitAnswerButtonText}>
                    {gameState.finalJeopardy ? 'SUBMIT FINAL ANSWER' : 'SUBMIT ANSWER'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const JeopardyTile = ({ points, category, onPress, answered, isDailyDouble }) => (
  <TouchableOpacity
    style={[
      styles.tile, 
      answered && styles.tileAnswered,
      isDailyDouble && styles.tileDailyDouble
    ]}
    onPress={() => !answered && onPress(category, points)}
    disabled={answered}
    activeOpacity={0.8}
  >
    {answered ? (
      <Text style={styles.tileAnsweredIcon}>✅</Text>
    ) : (
      <View style={styles.tileContent}>
        <Text style={styles.tileText}>${points}</Text>
        {isDailyDouble && <Text style={styles.tileDailyDoubleIcon}>🎯</Text>}
      </View>
    )}
  </TouchableOpacity>
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
  mainTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  titleHighlight: {
    color: COLORS.accentYellow,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
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
  categoriesPreview: {
    marginBottom: SPACING.xl,
  },
  categoryPreviewItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryPreviewText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
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
  
  // Board styles
  gameContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.lg,
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
  gameBoard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: SIZES.borderRadius,
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.accentYellow,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  headerCell: {
    flex: 1,
    padding: SPACING.sm,
    margin: 1,
    backgroundColor: COLORS.accentBlue,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  headerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    backgroundColor: COLORS.accentBlue,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  tileAnswered: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tileDailyDouble: {
    borderWidth: 2,
    borderColor: COLORS.accentYellow,
  },
  tileContent: {
    alignItems: 'center',
  },
  tileText: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  tileAnsweredIcon: {
    fontSize: 24,
  },
  tileDailyDoubleIcon: {
    fontSize: 12,
    color: COLORS.accentYellow,
    marginTop: 2,
  },
  finalJeopardyButton: {
    marginTop: SPACING.lg,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  finalJeopardyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  finalJeopardyButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Challenge styles
  challengeContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  dailyDoubleBanner: {
    backgroundColor: COLORS.accentYellow,
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  dailyDoubleText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  finalJeopardyBanner: {
    backgroundColor: COLORS.accentOrange,
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  finalJeopardyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  challengeCategory: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
  },
  challengePoints: {
    ...TYPOGRAPHY.header,
    color: COLORS.accentYellow,
  },
  challengeContent: {
    marginBottom: SPACING.xl,
  },
  challengeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  marcieContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  marcieAvatar: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  marcieName: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  marcieFeedbackContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius * 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  marcieFeedback: {
    ...TYPOGRAPHY.body,
    color: COLORS.accentRose,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  answerSection: {
    marginBottom: SPACING.xl,
  },
  answerPrompt: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
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
    marginBottom: SPACING.lg,
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
  submitAnswerButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  submitAnswerButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default RelationalJeopardyScreen;
