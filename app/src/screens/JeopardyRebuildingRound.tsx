import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../lib/game-store';
import { vertexAIService } from '../lib/vertex-ai-service';
import { JeopardyCategory, JeopardyClue, GameState } from '../lib/game-types';
import GameRunner from '../components/games/GameRunner';
import * as Haptics from 'expo-haptics';

interface JeopardyCellProps {
  clue: JeopardyClue;
  categoryIndex: number;
  clueIndex: number;
  onPress: (categoryIndex: number, clueIndex: number) => void;
  isActive: boolean;
}

const JeopardyCell: React.FC<JeopardyCellProps> = ({ 
  clue, 
  categoryIndex, 
  clueIndex, 
  onPress, 
  isActive 
}) => {
  const handlePress = () => {
    if (!clue.answered && isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(categoryIndex, clueIndex);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.cell, 
        clue.answered && styles.cellAnswered,
        !isActive && styles.cellDisabled
      ]} 
      onPress={handlePress}
      disabled={clue.answered || !isActive}
    >
      <LinearGradient
        colors={clue.answered ? ['#333', '#555'] : ['#ef1b6e', '#9056ef']}
        style={styles.cellGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[
          styles.cellText, 
          clue.answered && styles.cellTextAnswered
        ]}>
          ${clue.value}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface ClueModalProps {
  visible: boolean;
  clue: JeopardyClue | null;
  category: string;
  onAnswer: (answer: string) => void;
  onClose: () => void;
  activePlayer: string | null;
  buzzerEnabled: boolean;
  onBuzz: () => void;
}

const ClueModal: React.FC<ClueModalProps> = ({
  visible,
  clue,
  category,
  onAnswer,
  onClose,
  activePlayer,
  buzzerEnabled,
  onBuzz,
}) => {
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onAnswer(answer.trim());
      setAnswer('');
      setShowAnswer(false);
    }
  };

  const handleBuzz = () => {
    if (buzzerEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onBuzz();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  if (!clue) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient 
          colors={['#1a0033', '#330066']} 
          style={styles.modalBackground}
        />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
            <Text style={styles.valueText}>${clue.value}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Clue */}
          <View style={styles.clueContainer}>
            <Text style={styles.clueText}>{clue.clue}</Text>
          </View>

          {/* Buzzer or Answer Section */}
          {!activePlayer ? (
            <View style={styles.buzzerContainer}>
              <TouchableOpacity 
                style={[
                  styles.buzzerButton,
                  !buzzerEnabled && styles.buzzerDisabled
                ]} 
                onPress={handleBuzz}
                disabled={!buzzerEnabled}
              >
                <LinearGradient
                  colors={buzzerEnabled ? ['#ef1b6e', '#ff4081'] : ['#666', '#888']}
                  style={styles.buzzerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buzzerText}>BUZZ IN!</Text>
                </LinearGradient>
              </TouchableOpacity>
              {!buzzerEnabled && (
                <Text style={styles.buzzerWaitText}>Wait for the clue to finish...</Text>
              )}
            </View>
          ) : (
            <View style={styles.answerContainer}>
              <Text style={styles.answerPrompt}>Your answer:</Text>
              <TextInput
                style={styles.answerInput}
                value={answer}
                onChangeText={setAnswer}
                placeholder="What is..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoFocus
              />
              
              <View style={styles.answerButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.submitButton]} 
                  onPress={handleSubmit}
                  disabled={!answer.trim()}
                >
                  <Text style={styles.buttonText}>Submit Answer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.showAnswerButton]} 
                  onPress={handleShowAnswer}
                >
                  <Text style={styles.buttonText}>Show Answer</Text>
                </TouchableOpacity>
              </View>

              {showAnswer && (
                <View style={styles.answerReveal}>
                  <Text style={styles.answerLabel}>Correct Answer:</Text>
                  <Text style={styles.answerText}>{clue.answer}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface JeopardyRebuildingRoundProps {
  gameContent?: JeopardyCategory[];
  gameState: GameState;
  currentSession: any;
  onGameComplete: (results: any) => void;
  triggerMarcieAnimation: (animation: any) => void;
}

const JeopardyRebuildingRound: React.FC<JeopardyRebuildingRoundProps> = ({
  gameContent,
  gameState,
  currentSession,
  onGameComplete,
  triggerMarcieAnimation,
}) => {
  const [categories, setCategories] = useState<JeopardyCategory[]>([]);
  const [selectedCell, setSelectedCell] = useState<{categoryIndex: number, clueIndex: number} | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [buzzerEnabled, setBuzzerEnabled] = useState(false);
  const [answeredClues, setAnsweredClues] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);

  const { updateGameState, handleBuzz, submitAnswer } = useGameStore();

  // Initialize categories when game content loads
  useEffect(() => {
    if (gameContent && gameContent.length > 0) {
      setCategories(gameContent);
      setBuzzerEnabled(false);
      
      // Enable buzzer after 2 seconds for first question
      setTimeout(() => setBuzzerEnabled(true), 2000);
    }
  }, [gameContent]);

  // Check if game is complete
  useEffect(() => {
    if (categories.length > 0) {
      const totalClues = categories.reduce((total, cat) => total + cat.clues.length, 0);
      const answeredCount = Array.from(answeredClues).length;
      
      if (answeredCount === totalClues && !gameComplete) {
        setGameComplete(true);
        handleGameComplete();
      }
    }
  }, [answeredClues, categories, gameComplete]);

  const handleCellPress = useCallback((categoryIndex: number, clueIndex: number) => {
    const cellKey = `${categoryIndex}-${clueIndex}`;
    if (answeredClues.has(cellKey)) return;

    setSelectedCell({ categoryIndex, clueIndex });
    setActivePlayer(null);
    setBuzzerEnabled(false);
    
    // Enable buzzer after 2 seconds
    setTimeout(() => setBuzzerEnabled(true), 2000);

    // Update game state
    updateGameState({
      currentQuestion: cellKey,
      buzzerEnabled: true,
    });

    triggerMarcieAnimation({
      type: 'thinking',
      speech: "Here's your clue, darlings. First buzz gets to answer!",
    });
  }, [answeredClues, updateGameState, triggerMarcieAnimation]);

  const handleBuzz = useCallback(async () => {
    if (!selectedCell || !buzzerEnabled || activePlayer) return;

    const timestamp = Date.now();
    const cellKey = `${selectedCell.categoryIndex}-${selectedCell.clueIndex}`;
    
    // Record buzz with millisecond precision
    await handleBuzz('current_player', cellKey);
    
    setActivePlayer('current_player');
    setBuzzerEnabled(false);

    triggerMarcieAnimation({
      type: 'listening',
      speech: "First buzz! Go ahead, darling...",
    });
  }, [selectedCell, buzzerEnabled, activePlayer, handleBuzz, triggerMarcieAnimation]);

  const handleAnswer = useCallback(async (answer: string) => {
    if (!selectedCell) return;

    const category = categories[selectedCell.categoryIndex];
    const clue = category.clues[selectedCell.clueIndex];
    const cellKey = `${selectedCell.categoryIndex}-${selectedCell.clueIndex}`;
    
    // Simple answer validation (in real implementation, this would use AI)
    const isCorrect = answer.toLowerCase().includes(clue.answer.toLowerCase()) || 
                     clue.answer.toLowerCase().includes(answer.toLowerCase());
    
    // Update scores
    const newScores = { ...scores };
    if (isCorrect) {
      newScores.player1 += clue.value; // Assuming current player is player1
      
      triggerMarcieAnimation({
        type: 'correct',
        speech: `Excellent! ${clue.value} points for you, darling!`,
      });
    } else {
      newScores.player1 -= clue.value;
      
      triggerMarcieAnimation({
        type: 'wrong',
        speech: `Oh darling, that's not quite right. Minus ${clue.value} points.`,
      });
    }
    
    setScores(newScores);

    // Mark clue as answered
    const newAnsweredClues = new Set(answeredClues);
    newAnsweredClues.add(cellKey);
    setAnsweredClues(newAnsweredClues);

    // Update clue in categories
    const newCategories = [...categories];
    newCategories[selectedCell.categoryIndex].clues[selectedCell.clueIndex].answered = true;
    newCategories[selectedCell.categoryIndex].clues[selectedCell.clueIndex].answered_by = 'current_player';
    setCategories(newCategories);

    // Close modal and reset
    setSelectedCell(null);
    setActivePlayer(null);

    // Update game state
    await updateGameState({
      scores: newScores,
      currentQuestion: null,
      buzzerEnabled: false,
    });

    await submitAnswer('current_player', {
      answer,
      isCorrect,
      value: clue.value,
      category: category.name,
      clue: clue.clue,
    });
  }, [selectedCell, categories, scores, answeredClues, updateGameState, submitAnswer, triggerMarcieAnimation]);

  const handleGameComplete = useCallback(async () => {
    const results = {
      scores,
      winner: scores.player1 > scores.player2 ? 'player1' : 
              scores.player2 > scores.player1 ? 'player2' : 'tie',
      duration: 0, // This would be calculated
      marcieCommentary: await vertexAIService.generateMarcieCommentary(
        scores.player1 > scores.player2 ? 'game_win' : 'game_loss',
        { scores, categories: categories.length }
      ),
      achievements: [],
    };

    onGameComplete(results);
  }, [scores, categories, onGameComplete]);

  const renderCategory = ({ item: category, index }: { item: JeopardyCategory, index: number }) => (
    <View style={styles.categoryColumn} key={category.id}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category.name.toUpperCase()}</Text>
      </View>
      {category.clues.map((clue, clueIndex) => (
        <JeopardyCell
          key={clue.id}
          clue={clue}
          categoryIndex={index}
          clueIndex={clueIndex}
          onPress={handleCellPress}
          isActive={gameState === 'ready_to_start' || gameState === 'question_active'}
        />
      ))}
    </View>
  );

  if (categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading personalized categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Board */}
      <View style={styles.gameBoard}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.boardContent}
        />
      </View>

      {/* Scores */}
      <View style={styles.scoresContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Player 1</Text>
          <Text style={styles.scoreValue}>${scores.player1}</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Player 2</Text>
          <Text style={styles.scoreValue}>${scores.player2}</Text>
        </View>
      </View>

      {/* Clue Modal */}
      <ClueModal
        visible={!!selectedCell}
        clue={selectedCell ? categories[selectedCell.categoryIndex].clues[selectedCell.clueIndex] : null}
        category={selectedCell ? categories[selectedCell.categoryIndex].name : ''}
        onAnswer={handleAnswer}
        onClose={() => setSelectedCell(null)}
        activePlayer={activePlayer}
        buzzerEnabled={buzzerEnabled}
        onBuzz={handleBuzz}
      />
    </View>
  );
};

// Main component that wraps with GameRunner
const JeopardyRebuildingRoundScreen = () => {
  const [gameId] = useState('jeopardy');
  const [coupleId] = useState('test-couple-123'); // This would come from auth context

  const handleGameComplete = (results: any) => {
    console.log('Game completed:', results);
    // Navigate to next screen or show final results
  };

  const handleExit = () => {
    console.log('Exit game');
    // Navigate back to game library
  };

  return (
    <GameRunner
      gameId={gameId}
      coupleId={coupleId}
      onComplete={handleGameComplete}
      onExit={handleExit}
      gameTitle="Jeopardy: Rebuilding Round"
      gameIcon="🎯"
      showTimer={true}
      showMarcie={true}
    >
      <JeopardyRebuildingRound />
    </GameRunner>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  gameBoard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  boardContent: {
    paddingHorizontal: 8,
  },
  categoryColumn: {
    width: 140,
    marginHorizontal: 4,
  },
  categoryHeader: {
    backgroundColor: 'rgba(239, 27, 110, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 27, 110, 0.5)',
  },
  categoryTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cell: {
    height: 80,
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cellGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellAnswered: {
    opacity: 0.3,
  },
  cellDisabled: {
    opacity: 0.5,
  },
  cellText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cellTextAnswered: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  categoryText: {
    color: '#ef1b6e',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  valueText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  clueText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  buzzerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buzzerButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  buzzerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#ef1b6e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  buzzerText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  buzzerDisabled: {
    opacity: 0.5,
  },
  buzzerWaitText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  answerContainer: {
    marginBottom: 40,
  },
  answerPrompt: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  answerInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  showAnswerButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerReveal: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  answerLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  answerText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JeopardyRebuildingRoundScreen;
