
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebaseClient';

const GameScreenLoveTreaty = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gameId, coupleId } = route.params;
  
  const [gameState, setGameState] = useState(null);
  const [player1Stance, setPlayer1Stance] = useState('');
  const [player2Stance, setPlayer2Stance] = useState('');
  const [mergedStance, setMergedStance] = useState('');
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const gameRef = doc(db, "games", gameId, "couples", coupleId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setGameState(data);
        setCurrentArticleIndex(data.currentArticleIndex || 0);
        setPlayer1Stance(data.player1Stance || '');
        setPlayer2Stance(data.player2Stance || '');
        setMergedStance(data.mergedStance || '');
      } else {
        // Initialize game state if it doesn't exist
        const initialGameState = {
          gameId,
          coupleId,
          currentArticleIndex: 0,
          articles: [
            { title: "Article I: Communication Protocols", prompt: "When disagreements arise, we will..." },
            { title: "Article II: Shared Responsibilities", prompt: "To maintain a balanced home environment, we will..." },
            { title: "Article III: Quality Time", prompt: "We will dedicate time to each other by..." },
          ],
          player1Stance: '',
          player2Stance: '',
          mergedStance: '',
          status: 'drafting'
        };
        setDoc(gameRef, initialGameState);
        setGameState(initialGameState)
      }
    });

    return () => unsubscribe();
  }, [gameId, coupleId]);

  const handleStanceUpdate = async (stance) => {
    const gameRef = doc(db, "games", gameId, "couples", coupleId);
    if (currentUser.uid === gameState.player1) {
      setPlayer1Stance(stance);
      await updateDoc(gameRef, { player1Stance: stance });
    } else {
      setPlayer2Stance(stance);
      await updateDoc(gameRef, { player2Stance: stance });
    }
  };

  const handleMergeUpdate = async (stance) => {
    const gameRef = doc(db, "games", gameId, "couples", coupleId);
    setMergedStance(stance)
    await updateDoc(gameRef, { mergedStance: stance });
  }

  const ratifyArticle = async () => {
    const gameRef = doc(db, "games", gameId, "couples", coupleId);
    const nextArticleIndex = currentArticleIndex + 1;

    if (nextArticleIndex < gameState.articles.length) {
      await updateDoc(gameRef, {
        currentArticleIndex: nextArticleIndex,
        player1Stance: '', // Reset for next article
        player2Stance: '',
        mergedStance: '',
        status: 'drafting'
      });
    } else {
      // Game over
      await updateDoc(gameRef, { status: 'completed' });
      Alert.alert("Congratulations!", "You have successfully ratified your Love Treaty.");
      navigation.goBack();
    }
  };

  if (!gameState) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading Game...</Text></View>;
  }

  const currentArticle = gameState.articles[currentArticleIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.articleTitle}>{currentArticle.title}</Text>
      <Text style={styles.articlePrompt}>{currentArticle.prompt}</Text>

      <View style={styles.playerInputContainer}>
        <Text style={styles.inputLabel}>Your Stance</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your personal clause..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={currentUser.uid === gameState.player1 ? player1Stance : player2Stance}
          onChangeText={handleStanceUpdate}
          editable={gameState.status === 'drafting'}
        />
      </View>

      {gameState.status === 'negotiating' && (
        <View style={styles.playerInputContainer}>
          <Text style={styles.inputLabel}>Partner's Stance</Text>
          <Text style={styles.partnerStance}>{currentUser.uid === gameState.player1 ? player2Stance : player1Stance}</Text>
          <Text style={styles.inputLabel}>Merged Stance</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Negotiate and merge your clauses..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={mergedStance}
            onChangeText={handleMergeUpdate}
          />
        </View>
      )}

      <TouchableOpacity style={styles.actionButton} onPress={ratifyArticle}>
        <Text style={styles.actionButtonText}>Ratify Article</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b192e',
    padding: 24,
  },
  loadingText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
  },
  articleTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  articlePrompt: {
    color: '#FF7ED4',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  playerInputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  partnerStance: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    minHeight: 100,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#AC3AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GameScreenLoveTreaty;
