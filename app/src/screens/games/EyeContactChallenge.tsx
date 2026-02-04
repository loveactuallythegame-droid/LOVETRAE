import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function EyeContactChallenge({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'eye-contact-challenge' };
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds challenge
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const coupleId = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [partnerReady, setPartnerReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        const couple_code = profileSnap.data()?.couple_code;

        if (couple_code) {
          coupleId.current = couple_code;
          
          const sessionRef = await addDoc(collection(db, 'game_sessions'), {
            gameId,
            userId: user.uid,
            couple_id: couple_code,
            createdAt: new Date(),
            state: { timeRemaining, gameStarted, gameCompleted, score, streak },
          });
          setSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'game_sessions'),
            where('couple_id', '==', couple_code),
            where('gameId', '==', gameId),
            where('userId', '!=', user.uid) // Different user
          );
          
          const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                const data = change.doc.data();
                if (data.state) {
                  if (data.state.gameStarted) {
                    setConnectionStatus('connected');
                    setPartnerReady(true);
                  }
                  if (data.state.timeRemaining !== undefined) {
                    setTimeRemaining(data.state.timeRemaining);
                  }
                }
              }
            });
          });
          
          return () => unsubscribeSnapshot();
        }
      }
    });

    return () => unsubscribeAuth && unsubscribeAuth();
  }, [gameId]);

  const startGame = () => {
    setGameStarted(true);
    setConnectionStatus('in-progress');
    
    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const incrementScore = () => {
    if (gameStarted && timeRemaining > 0) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            timeRemaining, 
            gameStarted, 
            gameCompleted: false, 
            score: score + 10,
            streak: streak + 1
          }
        });
      }
    }
  };

  const finishGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Update in Firebase
    if (sessionId) {
      const sessionRef = doc(db, 'game_sessions', sessionId);
      updateDoc(sessionRef, {
        finished_at: new Date().toISOString(),
        score: score,
        state: JSON.stringify({ completed: true, finalScore: score, streak })
      });
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      <GlassCard>
        <LinearGradient
          colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <Text variant="header" style={{ textAlign: 'center', marginBottom: theme.SPACING.md, color: theme.COLORS.textPrimary }}>
            Eye Contact Challenge
          </Text>
          
          <View style={styles.timerContainer}>
            <Text variant="header" style={{ fontSize: 48, color: theme.COLORS.accentOrange }}>
              {timeRemaining}s
            </Text>
            <Text variant="body" style={{ color: theme.COLORS.textSecondary, textAlign: 'center' }}>
              {connectionStatus === 'connecting' ? 'Connecting to partner...' : 
               connectionStatus === 'connected' ? 'Partner connected!' : 
               'Maintain eye contact'}
            </Text>
          </View>

          {!gameStarted ? (
            <View style={styles.startContainer}>
              <Text variant="body" style={{ textAlign: 'center', marginBottom: theme.SPACING.lg, color: theme.COLORS.textSecondary }}>
                Prepare to connect with your partner through sustained eye contact.
                Tap the heart each time you feel a connection.
              </Text>
              <TouchableOpacity 
                style={styles.startButton} 
                onPress={startGame}
                disabled={!partnerReady}
              >
                <LinearGradient
                  colors={[
                    partnerReady ? theme.COLORS.primaryGradientStart : '#666',
                    partnerReady ? theme.COLORS.primaryGradientEnd : '#666'
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text 
                    variant="header" 
                    style={{ 
                      color: partnerReady ? theme.COLORS.background : theme.COLORS.textHint,
                      textAlign: 'center'
                    }}
                  >
                    {partnerReady ? 'Start Challenge' : 'Waiting for Partner...'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <View style={styles.scoreContainer}>
                <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                  Current Score
                </Text>
                <Text variant="header" style={{ fontSize: 36, color: theme.COLORS.success }}>
                  {score}
                </Text>
              </View>
              
              <View style={styles.streakContainer}>
                <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                  Connection Streak
                </Text>
                <Text variant="header" style={{ fontSize: 24, color: theme.COLORS.accentViolet }}>
                  {streak}x
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.heartButton} 
                onPress={incrementScore}
              >
                <LinearGradient
                  colors={[theme.COLORS.romanceHub, theme.COLORS.emotionalConnection]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heartGradient}
                >
                  <Text 
                    style={{ 
                      fontSize: 48, 
                      color: theme.COLORS.background,
                      fontWeight: 'bold'
                    }}
                  >
                    ❤️
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <Text variant="sass" style={{ textAlign: 'center', marginTop: theme.SPACING.md, color: theme.COLORS.accentYellow }}>
                Tap when you feel a connection!
              </Text>
            </View>
          )}

          {gameCompleted && (
            <View style={styles.resultsContainer}>
              <Text variant="header" style={{ textAlign: 'center', marginBottom: theme.SPACING.md, color: theme.COLORS.success }}>
                Challenge Complete!
              </Text>
              <Text variant="body" style={{ textAlign: 'center', marginBottom: theme.SPACING.lg, color: theme.COLORS.textPrimary }}>
                You and your partner maintained eye contact and connected {score/10} times
              </Text>
              <TouchableOpacity 
                style={styles.finishButton} 
                onPress={() => navigation.goBack()}
              >
                <LinearGradient
                  colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text 
                    variant="header" 
                    style={{ 
                      color: theme.COLORS.background,
                      textAlign: 'center'
                    }}
                  >
                    Return to Menu
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </GlassCard>
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Eye Contact Challenge',
    description: 'Connect with your partner through sustained eye contact',
    category: 'emotional-connection' as const,
    difficulty: 'easy' as const,
    xpReward: 45,
    currentStep: gameStarted ? 1 : 0,
    totalTime: 60,
    playerData: { 
      vulnerabilityScore: gameStarted ? 75 : 40, 
      honestyScore: gameStarted ? 80 : 45, 
      completionTime: 60 - timeRemaining, 
      partnerSync: partnerReady ? 100 : 20 
    },
  };

  return (
    <GameContainer 
      state={baseState} 
      inputs={["custom"]} 
      inputArea={inputArea} 
      onComplete={() => {
        if (sessionId) {
          const sessionRef = doc(db, 'game_sessions', sessionId);
          updateDoc(sessionRef, {
            finished_at: new Date().toISOString(),
            score: score,
            state: JSON.stringify({ completed: true, finalScore: score, streak })
          });
        }
        navigation.goBack();
      }} 
      sessionId={sessionId} 
    />
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  startContainer: {
    alignItems: 'center',
    flex: 1,
  },
  startButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    width: '80%',
    marginTop: theme.SPACING.lg,
  },
  gameContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  heartButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.SPACING.lg,
  },
  heartGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    alignItems: 'center',
  },
  finishButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    width: '80%',
    marginTop: theme.SPACING.lg,
  },
  gradientButton: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
});