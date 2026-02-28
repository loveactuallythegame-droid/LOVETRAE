import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
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
  partnerA Revelation: string;
  partnerBRevelation: string;
  alignmentPercentage: number;
  gamePhase: 'intro' | 'question' | 'revelation' | 'analysis' | 'results';
  sessionId: string;
  isLoading: boolean;
  marcieFeedback: string;
  marcieAnimation: string;
}

const HeartOfTheMatterGameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { updateGameProgress, currentGameSession } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: '',
    partnerA Revelation: '',
    partnerBRevelation: '',
    alignmentPercentage: 0,
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  // Game questions based on Design Bible specifications
  const gameQuestions = [
    "What was the deepest word-wound you've never fully confessed?",
    "What truth about yourself are you most afraid your partner already suspects?",
    "What part of your story have you been editing out to stay lovable?",
    "What do you secretly believe this fight is really about?",
    "What vulnerability feels too dangerous to speak aloud?"
  ];

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
        'heart-of-the-matter',
        'emotional-connection'
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('heart-of-the-matter', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    const randomQuestion = gameQuestions[Math.floor(Math.random() * gameQuestions.length)];
    setGameState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      gamePhase: 'question'
    }));
  };

  const handleRevelationSubmit = async (partner: 'A' | 'B', revelation: string) => {
    try {
      setGameState(prev => ({
        ...prev,
        isLoading: true,
        [`partner${partner}Revelation`]: revelation
      }));

      // Get Dr. Marcie's feedback
      const context = `Heart of the Matter game - Partner ${partner} revelation`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        revelation,
        2 // Reality Check Specialist level
      );

      setGameState(prev => ({
        ...prev,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'analysis',
        isLoading: false
      }));

      // Update game progress
      updateGameProgress('heart-of-the-matter', 50);

    } catch (error) {
      console.error('Failed to process revelation:', error);
      Alert.alert('Processing Error', 'Failed to process your revelation. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const calculateAlignment = async () => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Simple semantic analysis (in real app, this would use AI)
      const revelationA = gameState.partnerA Revelation.toLowerCase();
      const revelationB = gameState.partnerBRevelation.toLowerCase();
      
      // Calculate alignment based on semantic similarity
      let alignment = 0;
      const commonWords = ['trust', 'honesty', 'communication', 'respect', 'love'];
      
      commonWords.forEach(word => {
        if (revelationA.includes(word) || revelationB.includes(word)) {
          alignment += 20;
        }
      });

      // Ensure alignment is between 0-100
      alignment = Math.min(100, Math.max(0, alignment));

      setGameState(prev => ({
        ...prev,
        alignmentPercentage: alignment,
        gamePhase: 'results',
        isLoading: false
      }));

      // Update game session with results
      await gamesApi.updateSession(
        gameState.sessionId,
        alignment,
        true,
        [
          {
            partner: 'A',
            revelation: gameState.partnerA Revelation,
            timestamp: new Date().toISOString()
          },
          {
            partner: 'B',
            revelation: gameState.partnerBRevelation,
            timestamp: new Date().toISOString()
          }
        ]
      );

      // Update global game state
      updateGameProgress('heart-of-the-matter', 100);

    } catch (error) {
      console.error('Failed to calculate alignment:', error);
      Alert.alert('Calculation Error', 'Failed to calculate alignment. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const finishGame = () => {
    navigation.navigate('GameResultsScreen', {
      gameId: 'heart-of-the-matter',
      score: gameState.alignmentPercentage,
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
          <Text style={styles.loadingText}>Processing your revelation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Intro phase
  if (gamePhase === 'intro') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.introContainer}>
            <Text style={styles.gameTitle}>HEART OF THE MATTER</Text>
            <Text style={styles.gameSubtitle}>The Deepest Word-Wound Revelation</Text>
            
            <View style={styles.introCard}>
              <Text style={styles.introText}>
                In this game, you and your partner will reveal the deepest emotional wounds 
                you've never fully confessed. Dr. Marcie will guide you through this vulnerable 
                process with her signature therapeutic insight.
              </Text>
              
              <Text style={styles.introWarning}>
                ⚠️ This game requires emotional safety and trust. Ensure you're both ready 
                for deep vulnerability before proceeding.
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
                <Text style={styles.startButtonText}>BEGIN REVELATION</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Question phase
  if (gamePhase === 'question') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>THE INQUIRY</Text>
            <Text style={styles.mainQuestion}>
              WHAT WAS THE DEEPEST{' '}
              <Text style={styles.italicPrimary}>WORD-WOUND</Text>?
            </Text>
            
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{gameState.currentQuestion}</Text>
            </View>

            <Text style={styles.instructionText}>
              Take a moment to reflect on this question. When you're ready, 
              share your revelation with your partner.
            </Text>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setGameState(prev => ({ ...prev, gamePhase: 'revelation' }))}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.accentViolet, COLORS.accentRose]}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.continueButtonText}>I'M READY TO SHARE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Revelation phase
  if (gamePhase === 'revelation') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.revelationContainer}>
            <Text style={styles.revelationTitle}>YOUR REVELATION</Text>
            <Text style={styles.revelationPrompt}>
              Share your deepest word-wound below:
            </Text>
            
            <View style={styles.revelationInputContainer}>
              <TextInput
                style={styles.revelationInput}
                placeholder="Type your revelation here..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={gameState.partnerA Revelation}
                onChangeText={(text) => setGameState(prev => ({ 
                  ...prev, 
                  partnerA Revelation: text 
                }))}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                !gameState.partnerA Revelation.trim() && styles.submitButtonDisabled
              ]}
              onPress={() => handleRevelationSubmit('A', gameState.partnerA Revelation)}
              disabled={!gameState.partnerA Revelation.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>SUBMIT REVELATION</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Analysis phase
  if (gamePhase === 'analysis') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient 
          colors={[COLORS.background, COLORS.surface]} 
          style={styles.backgroundGradient}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>DR. MARCIE'S ANALYSIS</Text>
            
            <View style={styles.marcieContainer}>
              <Text style={styles.marcieAvatar}>👩‍⚕️</Text>
              <Text style={styles.marcieName}>DR. MARCIE LISS</Text>
              <View style={styles.marcieFeedbackContainer}>
                <Text style={styles.marcieFeedback}>
                  "{gameState.marcieFeedback}"
                </Text>
              </View>
            </View>

            <View style={styles.revelationsContainer}>
              <View style={styles.revelationCard}>
                <Text style={styles.revelationPartner}>PARTNER A</Text>
                <Text style={styles.revelationText}>
                  "{gameState.partnerA Revelation}"
                </Text>
              </View>
              
              <View style={styles.revelationCard}>
                <Text style={styles.revelationPartner}>PARTNER B</Text>
                <Text style={styles.revelationText}>
                  "{gameState.partnerBRevelation}"
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={calculateAlignment}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.accentTeal, COLORS.accentViolet]}
                style={styles.calculateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.calculateButtonText}>CALCULATE ALIGNMENT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Results phase
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient 
        colors={[COLORS.background, COLORS.surface]} 
        style={styles.backgroundGradient}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>ALIGNMENT RESULTS</Text>
          
          <View style={styles.alignmentMeterContainer}>
            <Text style={styles.meterTitle}>SEMANTIC ALIGNMENT METER</Text>
            <View style={styles.meterTrack}>
              <LinearGradient
                colors={[COLORS.innerLineStart, COLORS.innerLineEnd]}
                style={[styles.meterFill, { width: `${gameState.alignmentPercentage}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.alignmentPercentage}>
              {gameState.alignmentPercentage}%
            </Text>
            <View style={styles.meterLabels}>
              <Text style={styles.meterLabelText}>DISSONANCE</Text>
              <Text style={styles.meterLabelText}>NEUTRAL</Text>
              <Text style={[styles.meterLabelText, { color: COLORS.accentPink }]}>
                TRANSCENDENCE
              </Text>
            </View>
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.resultsText}>
              {gameState.alignmentPercentage >= 80 
                ? "Remarkable alignment! Your revelations show deep emotional resonance."
                : gameState.alignmentPercentage >= 60
                ? "Good alignment detected. There's meaningful connection in your truths."
                : "Alignment challenges identified. This reveals important growth opportunities."
              }
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.finishButton}
            onPress={finishGame}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
              style={styles.finishButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.finishButtonText}>COMPLETE GAME</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  
  // Question styles
  questionContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  questionTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  mainQuestion: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    textTransform: 'uppercase',
  },
  italicPrimary: {
    fontStyle: 'italic',
    color: COLORS.primaryGradientStart,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.lg,
  },
  questionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.accentViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  continueButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Revelation styles
  revelationContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  revelationTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  revelationPrompt: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  revelationInputContainer: {
    marginBottom: SPACING.xl,
  },
  revelationInput: {
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
  submitButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  submitButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Analysis styles
  analysisContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  analysisTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
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
  revelationsContainer: {
    marginBottom: SPACING.xl,
  },
  revelationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  revelationPartner: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  revelationText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  calculateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.accentTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  calculateButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  calculateButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Results styles
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  resultsTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
  },
  alignmentMeterContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.lg,
  },
  meterTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  meterTrack: {
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  meterFill: {
    height: '100%',
  },
  alignmentPercentage: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabelText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.xl,
  },
  resultsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  finishButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  finishButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  finishButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default HeartOfTheMatterGameScreen;
