/**
 * GameConnector - Backend Integration Component for All Games
 * 
 * This component wraps game screens and provides:
 * - Automatic game session creation in backend
 * - Score tracking and submission
 * - Real-time sync via WebSocket
 * - Loading and error states
 * 
 * Usage:
 * <GameConnector
 *   gameId="six-second-kiss"
 *   categoryId="romance-hub"
 *   onComplete={(score) => navigation.navigate('Results', { score })}
 * >
 *   {(session, updateScore) => <YourGameComponent session={session} onScore={updateScore} />}
 * </GameConnector>
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { useWebSocket } from '../../hooks/useWebSocket';

interface GameConnectorProps {
  gameId: string;
  categoryId: string;
  children: (
    session: GameSession | null,
    updateScore: (score: number, completed?: boolean, responses?: any[]) => void,
    isSyncing: boolean
  ) => React.ReactNode;
  onComplete?: (finalScore: number, session: GameSession) => void;
  onError?: (error: Error) => void;
}

interface GameState {
  score: number;
  completed: boolean;
  responses: any[];
}

export const GameConnector: React.FC<GameConnectorProps> = ({
  gameId,
  categoryId,
  children,
  onComplete,
  onError,
}) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Create game session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('User not authenticated');
        }

        const token = await currentUser.getIdToken();
        
        // Create game session in backend
        const newSession = await gamesApi.createSession(
          currentUser.uid,
          gameId,
          categoryId,
          token
        );
        
        setSession(newSession);
        console.log(`[GameConnector] Session created: ${newSession.id}`);
      } catch (err) {
        console.error('[GameConnector] Failed to create session:', err);
        setError(err instanceof Error ? err : new Error('Failed to create game session'));
        onError?.(err instanceof Error ? err : new Error('Failed to create game session'));
      } finally {
        setLoading(false);
      }
    };

    createSession();
  }, [gameId, categoryId, onError]);

  // Update score function
  const updateScore = useCallback(async (
    score: number,
    completed: boolean = false,
    responses: any[] = []
  ) => {
    if (!session) return;

    setIsSyncing(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      
      const updatedSession = await gamesApi.updateSession(
        session.id,
        { score, completed, responses },
        token
      );
      
      setSession(updatedSession);
      
      // If game completed, call onComplete callback
      if (completed && onComplete) {
        onComplete(score, updatedSession);
      }
    } catch (err) {
      console.error('[GameConnector] Failed to update score:', err);
      Alert.alert(
        'Sync Error',
        'Failed to save your progress. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  }, [session, onComplete]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
          <ActivityIndicator size="large" color="#db147c" />
          <Text style={styles.loadingText}>Preparing your game...</Text>
        </LinearGradient>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
          <Text style={styles.errorText}>Failed to load game</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  // Render game with session and update function
  return (
    <View style={styles.container}>
      {children(session, updateScore, isSyncing)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#db147c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameConnector;