import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useGamePersistence<T>(gameId: string, initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(`game_state_${gameId}`).then((s) => {
      if (s) setState(JSON.parse(s));
      setLoaded(true);
    });
  }, [gameId]);

  const saveState = async (newState: T) => {
    setState(newState);
    await AsyncStorage.setItem(`game_state_${gameId}`, JSON.stringify(newState));
  };

  const clearState = async () => {
    await AsyncStorage.removeItem(`game_state_${gameId}`);
  };

  return { state, saveState, clearState, loaded };
}
