
import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, Unsubscribe, DocumentData } from 'firebase/firestore';
import { firestore } from '../lib/firebaseClient';

interface PresenceState {
  is_typing?: boolean;
  has_selected?: any; // Can be a boolean, string, etc.
  // Add any other presence flags you need
}

/**
 * A real-time hook to monitor a partner's presence and update the current user's presence.
 *
 * @param gameSessionId The ID of the current game session.
 * @param userId The ID of the current user.
 * @returns An object containing the partner's presence state and a function to update the current user's presence.
 */
export const usePartnerPresence = (gameSessionId: string, userId: string) => {
  const [partnerPresence, setPartnerPresence] = useState<PresenceState>({});
  const [error, setError] = useState<string | null>(null);

  // Memoize the update function for stability
  const updateUserPresence = useCallback(async (newPresence: Partial<PresenceState>) => {
    if (!gameSessionId || !userId) return;

    const docRef = doc(firestore, 'game_sessions', gameSessionId);
    const presenceField = `presence.${userId}`;

    try {
      await updateDoc(docRef, {
        [presenceField]: newPresence
      }, { merge: true }); // Use merge to avoid overwriting other presence fields
    } catch (err: any) {
      console.error("Error updating presence:", err);
      setError("Failed to update presence. " + err.message);
    }
  }, [gameSessionId, userId]);

  useEffect(() => {
    if (!gameSessionId || !userId) {
      setPartnerPresence({});
      return;
    }

    const docRef = doc(firestore, 'game_sessions', gameSessionId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const partners = data.partners || [];
        const partnerId = partners.find((p: string) => p !== userId);

        if (partnerId && data.presence && data.presence[partnerId]) {
          setPartnerPresence(data.presence[partnerId]);
        } else {
          setPartnerPresence({}); // Reset if partner or presence data is not found
        }
      } else {
        setError(`Game session (${gameSessionId}) not found.`);
      }
    }, (err: any) => {
      console.error("Presence listener error:", err);
      setError("Failed to listen for presence updates. " + err.message);
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts or dependencies change
    return () => unsubscribe();
  }, [gameSessionId, userId]);

  return { partnerPresence, updateUserPresence, error };
};

/**
 * Resets all presence flags for all players in a game session.
 * This should be called when a game ends or is terminated.
 *
 * @param gameSessionId The ID of the game session to clean up.
 */
export const resetPresenceFlags = async (gameSessionId: string) => {
  const docRef = doc(firestore, 'game_sessions', gameSessionId);
  try {
    // Setting the presence field to an empty object effectively clears all flags.
    await updateDoc(docRef, { presence: {} });
    console.log(`Presence flags reset for game session: ${gameSessionId}`);
  } catch (err: any) {
    console.error("Error resetting presence flags:", err);
  }
};
