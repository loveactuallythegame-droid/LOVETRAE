/**
 * useGameSession Hook
 * 
 * A reusable hook for integrating games with the backend API.
 * Handles session creation, score updates, and completion tracking.
 * 
 * Usage in any game screen:
 * const { session, updateScore, completeGame, isLoading, isSyncing } = useGameSession('game-id', 'category-id');
 */

import { useState, useEffect, useCallback } from 'react';
import { gamesApi, GameSession } from '../lib/api';
import { auth } from '../lib/firebaseClient';
import { Alert } from 'react-native';

interface UseGameSessionReturn {
  /** The current game session from backend */
  session: GameSession | null;
  /** Whether the session is being created */
  isLoading: boolean;
  /** Whether a score update is in progress */
  isSyncing: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Update the game score */
  updateScore: (score: number, responses?: any[]) => Promise<void>;
  /** Mark the game as completed */
  completeGame: (finalScore: number, responses?: any[]) => Promise<void>;
  /** Reset the game session */
  resetSession: () => Promise<void>;
}

export function useGameSession(
  gameId: string,
  categoryId: string
): UseGameSessionReturn {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create game session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('User not authenticated');
        }

        const token = await currentUser.getIdToken();
        const newSession = await gamesApi.createSession(
          currentUser.uid,
          gameId,
          categoryId,
          token
        );

        setSession(newSession);
        console.log(`[useGameSession] Created session: ${newSession.id}`);
      } catch (err) {
        console.error('[useGameSession] Failed to create session:', err);
        setError(err instanceof Error ? err : new Error('Failed to create game session'));
      } finally {
        setIsLoading(false);
      }
    };

    createSession();
  }, [gameId, categoryId]);

  // Update score function
  const updateScore = useCallback(async (score: number, responses?: any[]) => {
    if (!session) {
      console.warn('[useGameSession] Cannot update score: no session');
      return;
    }

    setIsSyncing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const updated = await gamesApi.updateSession(
        session.id,
        { score, completed: false, responses },
        token
      );

      setSession(updated);
    } catch (err) {
      console.error('[useGameSession] Failed to update score:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  // Complete game function
  const completeGame = useCallback(async (finalScore: number, responses?: any[]) => {
    if (!session) {
      console.warn('[useGameSession] Cannot complete game: no session');
      return;
    }

    setIsSyncing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const updated = await gamesApi.updateSession(
        session.id,
        { score: finalScore, completed: true, responses },
        token
      );

      setSession(updated);
      console.log(`[useGameSession] Game completed with score: ${finalScore}`);
    } catch (err) {
      console.error('[useGameSession] Failed to complete game:', err);
      Alert.alert('Error', 'Failed to save game results. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  // Reset session
  const resetSession = useCallback(async () => {
    setSession(null);
    setError(null);
    
    // Create new session
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const newSession = await gamesApi.createSession(
        currentUser.uid,
        gameId,
        categoryId,
        token
      );

      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset session'));
    } finally {
      setIsLoading(false);
    }
  }, [gameId, categoryId]);

  return {
    session,
    isLoading,
    isSyncing,
    error,
    updateScore,
    completeGame,
    resetSession,
  };
}

export default useGameSession;