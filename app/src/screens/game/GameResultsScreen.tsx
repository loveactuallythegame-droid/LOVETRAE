
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GlobalMarcieOverlay } from '../../components/GlobalMarcieOverlay';
import { functions } from '../../services/firebase';

const GameResultsScreen = ({ route }) => {
  const { gameId } = route.params;
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const calculateGameResults = functions.httpsCallable('calculateGameResults');
        const response = await calculateGameResults({ gameId });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching game results:', error);
      }
    };

    fetchResults();
  }, [gameId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Results</Text>
      {results && <Text style={styles.score}>Score: {results.score}</Text>}
      <GlobalMarcieOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
  },
});

export default GameResultsScreen;
