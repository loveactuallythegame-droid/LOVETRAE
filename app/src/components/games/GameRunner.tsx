import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../lib/game-store';
import { vertexAIService } from '../../lib/vertex-ai-service';
import { GameTemplateProps, GameState, MarcieAnimation } from '../../lib/game-types';
import EnhancedMarcieHost from '../ai-host/EnhancedMarcieHost';
import GameHeader from '../layout/GameHeader';
import GameFeedback from './GameFeedback';
import ResultsScreen from './ResultsScreen';
import * as Haptics from 'expo-haptics';

interface GameRunnerProps extends GameTemplateProps {
  children: React.ReactNode;
  gameTitle: string;
  gameIcon?: string;
  showTimer?: boolean;
  showMarcie?: boolean;
}

const GameRunner: React.FC<GameRunnerProps> = ({
  gameId,
  coupleId,
  onComplete,
  onExit,
  children,
  gameTitle,
  gameIcon,
  showTimer = true,
  showMarcie = true,
}) => {
  const {
    currentSession,
    gameState,
    loading,
    error,
    partnerOnline,
    currentMarcieAnimation,
    marcieVisible,
    initializeGame,
    updateGameState,
    endGame,
    triggerMarcieAnimation,
    setError,
  } = useGameStore();

  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [gameContent, setGameContent] = useState<any>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);

  // Game lifecycle management
  useEffect(() => {
    const initializeGameSession = async () => {
      try {
        await initializeGame(coupleId, gameId);
      } catch (error) {
        console.error('Failed to initialize game session:', error);
        setError('Failed to start game. Please try again.');
      }
    };

    initializeGameSession();

    return () => {
      // Cleanup game session
      if (currentSession && (currentSession as any).unsubscribe) {
        (currentSession as any).unsubscribe();
      }
    };
  }, [coupleId, gameId]);

  // Timer management
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'ready_to_start' || gameState === 'question_active') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // AI content generation
  useEffect(() => {
    const generateGameContent = async () => {
      if (gameState === 'loading_content' && currentSession) {
        try {
          setIsContentLoading(true);
          
          // Fetch couple data for personalization
          const coupleData = await fetchCoupleData(coupleId);
          
          // Generate personalized content based on game type
          let content;
          switch (gameId) {
            case 'jeopardy':
              content = await vertexAIService.generateJeopardyCategories(coupleData);
              break;
            case 'millionaire':
              content = await vertexAIService.generateGameContent('millionaire', coupleData);
              break;
            case 'newlywed':
              content = await vertexAIService.generateGameContent('newlywed', coupleData);
              break;
            default:
              content = await vertexAIService.generateGameContent(gameId, coupleData);
          }

          setGameContent(content);
          setIsContentLoading(false);
          
          // Transition to ready state
          await updateGameState({ gameStarted: true });
          
          // Trigger Marcie introduction
          triggerMarcieAnimation({
            type: 'idle',
            speech: `Welcome to ${gameTitle}, darlings! Let's see how well you really know each other...`,
            duration: 5000,
          });

        } catch (error) {
          console.error('Failed to generate game content:', error);
          setError('Failed to load game content. Using default questions.');
          setIsContentLoading(false);
        }
      }
    };

    generateGameContent();
  }, [gameState, currentSession, gameId, coupleId]);

  // Game state change handler with Marcie animations
  useEffect(() => {
    const handleGameStateChange = async () => {
      switch (gameState) {
        case 'waiting_for_partner':
          triggerMarcieAnimation({
            type: 'impatient',
            speech: "Waiting for your partner to join... Don't they know we're on a schedule?",
          });
          break;
          
        case 'question_active':
          triggerMarcieAnimation({
            type: 'thinking',
            speech: "Here's your question, darlings. Think carefully now...",
          });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
          
        case 'correct_answer':
          triggerMarcieAnimation({
            type: 'correct',
            speech: "Excellent! Someone's been paying attention in relationship school!",
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
          
        case 'wrong_answer':
          triggerMarcieAnimation({
            type: 'wrong',
            speech: "Oh darling, that's... not quite right. But I love the confidence!",
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
          
        case 'vulnerable_input_detected':
          triggerMarcieAnimation({
            type: 'listening',
            speech: "Thank you for sharing that vulnerability. It takes real courage.",
          });
          break;
          
        case 'game_loss':
          triggerMarcieAnimation({
            type: 'warning',
            speech: "Don't worry, darling. Every setback is just setup for a comeback!",
          });
          break;
      }
    };

    handleGameStateChange();
  }, [gameState]);

  // Partner online status monitoring
  useEffect(() => {
    if (!partnerOnline && gameState === 'waiting_for_partner') {
      triggerMarcieAnimation({
        type: 'impatient',
        speech: "Still waiting... Maybe they got lost in the cosmic void of relationships?",
      });
    }
  }, [partnerOnline, gameState]);

  // Handle game completion
  const handleGameComplete = useCallback(async (results: any) => {
    try {
      const finalResults = {
        ...results,
        duration: timer,
        marcieCommentary: await vertexAIService.generateMarcieCommentary(
          results.winner === 'tie' ? 'game_win' : 'game_loss',
          results
        ),
      };

      setFinalResults(finalResults);
      setShowResults(true);
      
      // End game session
      await endGame(results.scores);
      
      // Call parent completion handler
      onComplete(finalResults);
    } catch (error) {
      console.error('Failed to complete game:', error);
      setError('Failed to complete game properly');
    }
  }, [timer, endGame, onComplete]);

  // Handle game exit
  const handleExit = useCallback(() => {
    // Cleanup and exit
    if (currentSession && (currentSession as any).unsubscribe) {
      (currentSession as any).unsubscribe();
    }
    onExit();
  }, [currentSession, onExit]);

  // Fetch couple data helper
  const fetchCoupleData = async (coupleId: string): Promise<Couple> => {
    // This would be implemented to fetch actual couple data from Firebase
    // For now, return mock data
    return {
      id: coupleId,
      player1_id: 'player1',
      player2_id: 'player2',
      couple_code: 'LA-TEST-LOVE',
      origin_story: {
        meet_cute: 'Met at a coffee shop when they both reached for the same book',
        first_impression: 'Thought they were charming but a bit awkward',
        turning_point: 'When they stayed up all night talking about their dreams',
        current_status: 'Navigating the beautiful chaos of building a life together',
      },
      relationship_diagnosis: 'The Chaotic Soulmates',
      trust_meter: 0.7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // Loading state
  if (loading || isContentLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a0033', '#330066']} style={styles.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef1b6e" />
          <Text style={styles.loadingText}>
            {gameState === 'loading_content' ? 'Generating personalized content...' : 'Starting game...'}
          </Text>
          {gameState === 'waiting_for_partner' && (
            <Text style={styles.waitingText}>Waiting for partner to join...</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a0033', '#330066']} style={styles.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => initializeGame(coupleId, gameId)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <Text style={styles.exitButtonText}>Exit Game</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Results screen
  if (showResults && finalResults) {
    return (
      <ResultsScreen
        scores={finalResults.scores}
        marcieCommentary={finalResults.marcieCommentary}
        onContinue={handleExit}
        duration={finalResults.duration}
      />
    );
  }

  // Main game screen
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={['#1a0033', '#330066', '#4d0099']} 
        style={styles.background} 
      />
      
      {/* Game Header */}
      <GameHeader
        title={gameTitle}
        icon={gameIcon}
        onExit={handleExit}
        timer={showTimer ? timer : undefined}
        partnerOnline={partnerOnline}
      />

      {/* Dr. Marcie Overlay */}
      {showMarcie && marcieVisible && (
        <EnhancedMarcieHost
          animation={currentMarcieAnimation}
          position={{ x: 20, y: 100 }}
          size={180}
          cosmicGlow={true}
          neonRing={true}
          float={true}
        />
      )}

      {/* Game Content */}
      <View style={styles.gameContent}>
        {React.cloneElement(children as React.ReactElement, {
          gameContent,
          gameState,
          currentSession,
          onGameComplete: handleGameComplete,
          triggerMarcieAnimation,
        })}
      </View>

      {/* Game Feedback */}
      {gameState === 'correct_answer' && (
        <GameFeedback
          type="success"
          message="Correct! Well done!"
          duration={2000}
        />
      )}

      {gameState === 'wrong_answer' && (
        <GameFeedback
          type="error"
          message="Not quite right, but good try!"
          duration={2000}
        />
      )}
    </SafeAreaView>
  );
};

// Helper function to map Marcie animation to component mode
const getMarcieModeFromAnimation = (animation: MarcieAnimation | null): any => {
  if (!animation) return 'idle';
  
  const modeMap = {
    idle: 'idle',
    impatient: 'tap-watch',
    correct: 'point',
    listening: 'lean',
    wrong: 'hold-timer',
    shocked: 'idle',
    thinking: 'hold-timer',
    warning: 'point',
  };

  return modeMap[animation.type] || 'idle';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  waitingText: {
    color: '#ef1b6e',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ef1b6e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  exitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameContent: {
    flex: 1,
    marginTop: 20,
  },
});

export default GameRunner;
