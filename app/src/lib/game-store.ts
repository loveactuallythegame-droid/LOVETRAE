
import { create } from 'zustand';

// Basic interface, assuming a more complete model exists in models.ts
export interface GameSession {
  id: string;
  partners: [string, string];
  current_turn: string;
  scores: {
    [uid: string]: number;
  };
  game_type: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  history: any[];
}

interface GameState {
  session: GameSession | null;
  loading: boolean;
  error: string | null;
  setSession: (session: GameSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  session: null,
  loading: true,
  error: null,
  setSession: (session) => set({ session, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));
