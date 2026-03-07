import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS, ANIMATIONS } from '../../theme';

export default function EyeContactChallenge({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'eye-contact-challenge' };
  const [timeRemaining, setTimeRemaining] = useState(60);
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
            where('userId', '!=', user.uid)
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
    }, ANIMATIONS.duration.slow);
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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <GlassCard>
        <LinearGradient
          colors={[COLORS.backgroundCard, COLORS.backgroundSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
          <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
          
          <Typography variant="h3" style={styles.challengeTitle}>
            Eye Contact Challenge
          </Typography>
          
          <View style={styles.timerContainer}>
            <Typography variant="h1" style={styles.timerText}>
              {timeRemaining}s
            </Typography>
            <Typography variant="body" center style={styles.statusText}>
              {connectionStatus === 'connecting' ? 'Connecting to partner...' : 
               connectionStatus === 'connected' ? 'Partner connected!' : 
               'Maintain eye contact'}
            </Typography>
          </View>

          {!gameStarted ? (
            <View style={styles.startContainer}>
              <Typography variant="body" center style={styles.startInstructions}>
                Prepare to connect with your partner through sustained eye contact.
                Tap the heart each time you feel a connection.
              </Typography>
              <SquishyButton 
                onPress={startGame}
                disabled={!partnerReady}
              >
                <Typography variant="button">
                  {partnerReady ? 'Start Challenge' : 'Waiting for Partner...'}
                </Typography>
              </SquishyButton>
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <View style={styles.scoreContainer}>
                <Typography variant="caption" style={styles.scoreLabel}>
                  Current Score
                </Typography>
                <Typography variant="h2" style={styles.scoreValue}>
                  {score}
                </Typography>
              </View>
              
              <View style={styles.streakContainer}>
                <Typography variant="caption" style={styles.streakLabel}>
                  Connection Streak
                </Typography>
                <Typography variant="h3" style={styles.streakValue}>
                  {streak}x
                </Typography>
              </View>
              
              <SquishyButton 
                style={styles.heartButton} 
                onPress={incrementScore}
              >
                <LinearGradient
                  colors={[COLORS.romanceHub, COLORS.emotionalConnection]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heartGradient}
                >
                  <Typography variant="h1" style={styles.heartEmoji}>
                    ❤️
                  </Typography>
                </LinearGradient>
              </SquishyButton>
              
              <Typography variant="caption" center style={styles.tapHint}>
                Tap when you feel a connection!
              </Typography>
            </View>
          )}

          {gameCompleted && (
            <View style={styles.resultsContainer}>
              <Typography variant="h2" center style={styles.completeTitle}>
                Challenge Complete!
              </Typography>
              <Typography variant="body" center style={styles.completeMessage}>
                You and your partner maintained eye contact and connected {score/10} times
              </Typography>
              <SquishyButton 
                onPress={() => navigation.goBack()}
              >
                <Typography variant="button">Return to Menu</Typography>
              </SquishyButton>
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
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.card,
    alignItems: 'center',
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    marginBottom: SPACING.regular,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  startContainer: {
    alignItems: 'center',
    flex: 1,
  },
  gameContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  heartButton: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xlarge,
  },
  heartGradient: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxlarge,
  },
  challengeTitle: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    marginTop: SPACING.regular,
  },
  timerText: {
    color: COLORS.warmOrange,
  },
  statusText: {
    color: COLORS.textSecondary,
  },
  startInstructions: {
    marginBottom: SPACING.xlarge,
    color: COLORS.textSecondary,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  scoreValue: {
    color: COLORS.success,
  },
  streakLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  streakValue: {
    color: COLORS.softViolet,
  },
  heartEmoji: {
    color: COLORS.backgroundPrimary,
  },
  tapHint: {
    marginTop: SPACING.regular,
    color: COLORS.brightYellow,
  },
  completeTitle: {
    marginBottom: SPACING.regular,
    color: COLORS.success,
  },
  completeMessage: {
    marginBottom: SPACING.xlarge,
    color: COLORS.textPrimary,
  },
});
