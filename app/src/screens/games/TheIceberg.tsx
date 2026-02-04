import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Slider } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const ICEBERG_QUESTIONS = [
  {
    id: '1',
    visible: "We always laugh together", 
    hidden: "But I sometimes feel lonely even when we're together",
    category: "Connection"
  },
  {
    id: '2',
    visible: "We have similar goals for our future", 
    hidden: "But we disagree on how to achieve them",
    category: "Goals"
  },
  {
    id: '3',
    visible: "We're physically intimate regularly", 
    hidden: "But I crave more emotional intimacy",
    category: "Intimacy"
  },
  {
    id: '4',
    visible: "We rarely argue", 
    hidden: "Because I avoid conflict by shutting down",
    category: "Communication"
  },
  {
    id: '5',
    visible: "We have many friends in common", 
    hidden: "But I sometimes feel like we're living separate social lives",
    category: "Social"
  }
];

export default function TheIceberg({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'the-iceberg' };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, {above: number, below: number}>>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [aboveSliderValue, setAboveSliderValue] = useState(50);
  const [belowSliderValue, setBelowSliderValue] = useState(50);
  const coupleId = useRef<string | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<any>(null);

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
            state: { currentQuestionIndex, responses, completed: false },
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
                if (data.state?.responses) {
                  // Get the latest response from partner
                  const partnerResponses = data.state.responses;
                  const currentQId = ICEBERG_QUESTIONS[currentQuestionIndex]?.id;
                  if (currentQId && partnerResponses[currentQId]) {
                    setPartnerResponse(partnerResponses[currentQId]);
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
  }, [gameId, currentQuestionIndex]);

  const handleAboveSliderChange = (value: number) => {
    setAboveSliderValue(Math.round(value));
  };

  const handleBelowSliderChange = (value: number) => {
    setBelowSliderValue(Math.round(value));
  };

  const submitResponse = () => {
    const currentQ = ICEBERG_QUESTIONS[currentQuestionIndex];
    if (currentQ) {
      const newResponses = { 
        ...responses, 
        [currentQ.id]: { 
          above: aboveSliderValue, 
          below: belowSliderValue 
        } 
      };
      setResponses(newResponses);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            currentQuestionIndex, 
            responses: newResponses,
            completed: currentQuestionIndex === ICEBERG_QUESTIONS.length - 1
          }
        });
      }
      
      if (currentQuestionIndex < ICEBERG_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAboveSliderValue(50);
        setBelowSliderValue(50);
        setPartnerResponse(null);
      } else {
        setGameCompleted(true);
      }
    }
  };

  const currentQuestion = ICEBERG_QUESTIONS[currentQuestionIndex];

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      {!gameCompleted ? (
        <GlassCard>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.headerContainer}>
              <Text variant="header" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
                The Iceberg
              </Text>
              <Text 
                variant="small" 
                style={{ 
                  position: 'absolute', 
                  right: theme.SPACING.md, 
                  top: theme.SPACING.md,
                  color: theme.COLORS.textHint 
                }}
              >
                {currentQuestionIndex + 1}/{ICEBERG_QUESTIONS.length}
              </Text>
            </View>
            
            <Text variant="title" style={{ color: theme.COLORS.emotionalConnection, marginBottom: theme.SPACING.md }}>
              {currentQuestion.category}
            </Text>
            
            <View style={styles.icebergContainer}>
              <View style={styles.aboveWater}>
                <Text variant="body" style={{ color: theme.COLORS.textPrimary, textAlign: 'center' }}>
                  Above Water (Visible)
                </Text>
                <Text variant="body" style={{ color: theme.COLORS.textSecondary, textAlign: 'center', marginTop: theme.SPACING.sm }}>
                  {currentQuestion.visible}
                </Text>
              </View>
              
              <View style={styles.waterLine}>
                <Text variant="small" style={{ color: theme.COLORS.accentTeal, textAlign: 'center' }}>
                  Surface Level
                </Text>
              </View>
              
              <View style={styles.belowWater}>
                <Text variant="body" style={{ color: theme.COLORS.textPrimary, textAlign: 'center' }}>
                  Below Water (Hidden)
                </Text>
                <Text variant="body" style={{ color: theme.COLORS.textSecondary, textAlign: 'center', marginTop: theme.SPACING.sm }}>
                  {currentQuestion.hidden}
                </Text>
              </View>
            </View>
            
            <View style={styles.sliderContainer}>
              <View style={styles.sliderRow}>
                <Text variant="small" style={{ color: theme.COLORS.textSecondary, width: 100 }}>
                  Visible: {aboveSliderValue}%
                </Text>
                <Slider
                  style={{ flex: 1 }}
                  value={aboveSliderValue}
                  onValueChange={handleAboveSliderChange}
                  minimumValue={0}
                  maximumValue={100}
                  thumbStyle={{ backgroundColor: theme.COLORS.primaryGradientStart }}
                  trackStyle={{ backgroundColor: theme.COLORS.innerLineStart }}
                />
              </View>
              
              <View style={styles.sliderRow}>
                <Text variant="small" style={{ color: theme.COLORS.textSecondary, width: 100 }}>
                  Hidden: {belowSliderValue}%
                </Text>
                <Slider
                  style={{ flex: 1 }}
                  value={belowSliderValue}
                  onValueChange={handleBelowSliderChange}
                  minimumValue={0}
                  maximumValue={100}
                  thumbStyle={{ backgroundColor: theme.COLORS.profileRingStart }}
                  trackStyle={{ backgroundColor: theme.COLORS.innerLineEnd }}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={submitResponse}
            >
              <LinearGradient
                colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: theme.COLORS.background,
                    textAlign: 'center'
                  }}
                >
                  {currentQuestionIndex === ICEBERG_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>
      ) : (
        <GlassCard>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="header" style={{ textAlign: 'center', marginBottom: theme.SPACING.md, color: theme.COLORS.success }}>
              Iceberg Fully Revealed!
            </Text>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: theme.SPACING.lg, color: theme.COLORS.textPrimary }}>
              You and your partner have explored the depths of your relationship dynamics.
            </Text>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => {
                if (sessionId) {
                  const sessionRef = doc(db, 'game_sessions', sessionId);
                  updateDoc(sessionRef, {
                    finished_at: new Date().toISOString(),
                    score: Object.keys(responses).length * 20,
                    state: JSON.stringify({ completed: true, responses })
                  });
                }
                navigation.goBack();
              }}
            >
              <LinearGradient
                colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
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
          </LinearGradient>
        </GlassCard>
      )}

      {partnerResponse && (
        <GlassCard style={styles.partnerCard}>
          <Text variant="sass" style={{ color: theme.COLORS.accentTeal, marginBottom: theme.SPACING.sm }}>
            Partner's Response:
          </Text>
          <View style={styles.partnerSliderContainer}>
            <View style={styles.sliderRow}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary, width: 100 }}>
                Visible: {partnerResponse.above}%
              </Text>
              <View style={styles.partnerSlider}>
                <View style={[styles.partnerSliderFill, { width: `${partnerResponse.above}%`, backgroundColor: theme.COLORS.primaryGradientStart }]} />
              </View>
            </View>
            <View style={styles.sliderRow}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary, width: 100 }}>
                Hidden: {partnerResponse.below}%
              </Text>
              <View style={styles.partnerSlider}>
                <View style={[styles.partnerSliderFill, { width: `${partnerResponse.below}%`, backgroundColor: theme.COLORS.profileRingStart }]} />
              </View>
            </View>
          </View>
        </GlassCard>
      )}
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'The Iceberg',
    description: 'Explore visible vs hidden aspects of your relationship',
    category: 'emotional-connection' as const,
    difficulty: 'medium' as const,
    xpReward: 70,
    currentStep: currentQuestionIndex,
    totalTime: 600,
    playerData: { 
      vulnerabilityScore: Object.keys(responses).length > 3 ? 90 : Object.keys(responses).length > 1 ? 70 : 50, 
      honestyScore: Object.keys(responses).length > 3 ? 85 : Object.keys(responses).length > 1 ? 65 : 45, 
      completionTime: 0, 
      partnerSync: partnerResponse ? 80 : 20 
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
            score: Object.keys(responses).length * 20,
            state: JSON.stringify({ completed: true, responses })
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.SPACING.md,
  },
  icebergContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.textHint,
    borderRadius: theme.SIZES.borderRadius,
    marginBottom: theme.SPACING.lg,
    overflow: 'hidden',
  },
  aboveWater: {
    padding: theme.SPACING.md,
    backgroundColor: 'rgba(51, 222, 165, 0.2)', // Green tint for above water
    borderBottomWidth: 2,
    borderBottomColor: theme.COLORS.textHint,
  },
  waterLine: {
    padding: theme.SPACING.sm,
    backgroundColor: theme.COLORS.textHint,
    alignItems: 'center',
  },
  belowWater: {
    padding: theme.SPACING.md,
    backgroundColor: 'rgba(179, 125, 236, 0.2)', // Purple tint for below water
  },
  sliderContainer: {
    marginBottom: theme.SPACING.lg,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
  },
  submitButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  partnerCard: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.md,
  },
  partnerSliderContainer: {
    marginTop: theme.SPACING.md,
  },
  partnerSlider: {
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
  },
  partnerSliderFill: {
    height: '100%',
    borderRadius: 10,
  },
});