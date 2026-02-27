/**
 * 6-Second Kiss Challenge Game Screen
 * 
 * This game has been updated to connect to the backend API.
 * - Creates game session on mount
 - Saves score to backend when completed
 * - Uses GameConnector for automatic sync
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend API imports
import { GameConnector } from '../../components/games/GameConnector';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';

// Game Constants
const GAME_ID = 'six-second-kiss';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;

interface GameProps {
  session: GameSession | null;
  updateScore: (score: number, completed?: boolean, responses?: any[]) => void;
  isSyncing: boolean;
}

const SixSecondKissGame: React.FC<GameProps> = ({ session, updateScore, isSyncing }) => {
  const navigation = useNavigation();
  const [player1Hold, setPlayer1Hold] = useState(false);
  const [player2Hold, setPlayer2Hold] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 0.01), 10);
    } else if (countdown <= 0) {
      setIsRunning(false);
      setCountdown(0);
      handleComplete();
    }
    return () => clearTimeout(timer);
  }, [isRunning, countdown]);

  // Start timer when both players hold
  useEffect(() => {
    if (player1Hold && player2Hold) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [player1Hold, player2Hold]);

  // Handle game completion
  const handleComplete = useCallback(() => {
    if (completed) return;
    
    setCompleted(true);
    const finalScore = Math.round(MAX_SCORE);
    
    // Save to backend
    updateScore(finalScore, true, [
      { player1Held: player1Hold, player2Held: player2Hold, time: 6 }
    ]);
    
    // Show completion alert
    Alert.alert(
      'Challenge Complete! 💋',
      'You completed the 6-second kiss challenge!',
      [
        { 
          text: 'View Results', 
          onPress: () => navigation.navigate('SixSecondKissResults', { 
            score: finalScore,
            sessionId: session?.id 
          }) 
        }
      ]
    );
  }, [completed, player1Hold, player2Hold, updateScore, navigation, session]);

  const resetGame = () => {
    setPlayer1Hold(false);
    setPlayer2Hold(false);
    setIsRunning(false);
    setCountdown(6);
    setCompleted(false);
  };

  const TouchZone = ({ player, onHold, isHolding }: { 
    player: string; 
    onHold: (val: boolean) => void; 
    isHolding: boolean;
  }) => (
    <LinearGradient
      colors={['#db147c', '#f05d68']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.touchZone, isHolding && styles.touchZoneActive]}
    >
      <TouchableOpacity
        style={styles.touchZoneInner}
        onPressIn={() => onHold(true)}
        onPressOut={() => onHold(false)}
        disabled={completed}
      >
        <MaterialIcons 
          name="touch_app" 
          size={40} 
          color={isHolding ? '#ffffff' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={styles.touchZoneText}>{player}</Text>
        {isHolding && <Text style={styles.connectedText}>Connected</Text>}
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#181116', '#230f18']} style={styles.container}>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../../assets/images/MarcieAvatar.png')} 
              style={styles.avatar} 
            />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              Ready to share some intimate moments? The 6-second kiss challenge 
              helps couples connect deeply through sustained eye contact and physical touch.
            </Text>
          </View>
        </View>

        <Text style={styles.title}>6-Second Kiss Challenge</Text>
        <Text style={styles.subtitle}>Hold to ignite the spark</Text>

        {/* Sync indicator */}
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Text style={styles.syncText}>💾 Saving...</Text>
          </View>
        )}

        <View style={styles.gameArea}>
          <TouchZone 
            player="Player 1" 
            onHold={setPlayer1Hold} 
            isHolding={player1Hold} 
          />
          
          <View style={styles.timerContainer}>
            <LinearGradient
              colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.timerGradient}
            >
              <Text style={styles.timerText}>
                {countdown.toFixed(2)}s
              </Text>
            </LinearGradient>
          </View>

          <TouchZone 
            player="Player 2" 
            onHold={setPlayer2Hold} 
            isHolding={player2Hold} 
          />
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Both partners must hold their buttons simultaneously for 6 seconds
          </Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Challenge</Text>
        </TouchableOpacity>

        {/* Session info (debug) */}
        {session && (
          <Text style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Text>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

// Main exported component wrapped with GameConnector
const SixSecondKissChallenge1: React.FC = () => {
  const navigation = useNavigation();

  const handleComplete = (score: number, session: GameSession) => {
    console.log('[SixSecondKissChallenge1] Game completed:', { score, sessionId: session.id });
    // Navigation handled in game component
  };

  const handleError = (error: Error) => {
    console.error('[SixSecondKissChallenge1] Game error:', error);
  };

  return (
    <GameConnector
      gameId={GAME_ID}
      categoryId={CATEGORY_ID}
      onComplete={handleComplete}
      onError={handleError}
    >
      {(session, updateScore, isSyncing) => (
        <SixSecondKissGame 
          session={session} 
          updateScore={updateScore} 
          isSyncing={isSyncing} 
        />
      )}
    </GameConnector>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181116',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  quoteBox: {
    flex: 1,
  },
  quoteText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  syncIndicator: {
    alignItems: 'center',
    marginBottom: 10,
  },
  syncText: {
    color: '#db147c',
    fontSize: 12,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  touchZone: {
    width: 120,
    height: 180,
    borderRadius: 20,
    padding: 3,
    opacity: 0.8,
  },
  touchZoneActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
    shadowColor: '#db147c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  touchZoneInner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchZoneText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  connectedText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  instructionsContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  instructions: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionInfo: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default SixSecondKissChallenge1;