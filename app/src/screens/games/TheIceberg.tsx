import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

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
                if (data.state?.responses) {
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

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        {!gameCompleted ? (
          <GlassCard>
            <LinearGradient
              colors={GRADIENTS.background.colors}
              start={GRADIENTS.background.start}
              end={GRADIENTS.background.end}
              style={styles.gradientContainer}
            >
              <View style={styles.headerContainer}>
                <Typography variant="h2">The Iceberg</Typography>
                <Typography variant="caption">
                  {currentQuestionIndex + 1}/{ICEBERG_QUESTIONS.length}
                </Typography>
              </View>
              
              <Typography variant="h3" color={COLORS.emotionalConnection}>
                {currentQuestion.category}
              </Typography>
              
              <View style={styles.icebergContainer}>
                <View style={styles.aboveWater}>
                  <Typography variant="body" center>Above Water (Visible)</Typography>
                  <Typography variant="body" center color={COLORS.textSecondary}>
                    {currentQuestion.visible}
                  </Typography>
                </View>
                
                <View style={styles.waterLine}>
                  <Typography variant="caption" color={COLORS.aquaTeal} center>Surface Level</Typography>
                </View>
                
                <View style={styles.belowWater}>
                  <Typography variant="body" center>Below Water (Hidden)</Typography>
                  <Typography variant="body" center color={COLORS.textSecondary}>
                    {currentQuestion.hidden}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.sliderContainer}>
                <View style={styles.sliderRow}>
                  <Typography variant="caption" style={styles.sliderLabel}>
                    Visible: {aboveSliderValue}%
                  </Typography>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${aboveSliderValue}%`, backgroundColor: COLORS.gradientStart }]} />
                  </View>
                  <View style={styles.buttonRow}>
                    <SquishyButton onPress={() => handleAboveSliderChange(Math.max(0, aboveSliderValue - 10))} variant="ghost" size="small">
                      <Typography variant="h2">-</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => handleAboveSliderChange(Math.min(100, aboveSliderValue + 10))} variant="ghost" size="small">
                      <Typography variant="h2">+</Typography>
                    </SquishyButton>
                  </View>
                </View>
                
                <View style={styles.sliderRow}>
                  <Typography variant="caption" style={styles.sliderLabel}>
                    Hidden: {belowSliderValue}%
                  </Typography>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${belowSliderValue}%`, backgroundColor: COLORS.lavenderPurple }]} />
                  </View>
                  <View style={styles.buttonRow}>
                    <SquishyButton onPress={() => handleBelowSliderChange(Math.max(0, belowSliderValue - 10))} variant="ghost" size="small">
                      <Typography variant="h2">-</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => handleBelowSliderChange(Math.min(100, belowSliderValue + 10))} variant="ghost" size="small">
                      <Typography variant="h2">+</Typography>
                    </SquishyButton>
                  </View>
                </View>
              </View>
              
              <SquishyButton onPress={submitResponse}>
                <Typography variant="h2">
                  {currentQuestionIndex === ICEBERG_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                </Typography>
              </SquishyButton>
            </LinearGradient>
          </GlassCard>
        ) : (
          <GlassCard>
            <LinearGradient
              colors={GRADIENTS.background.colors}
              start={GRADIENTS.background.start}
              end={GRADIENTS.background.end}
              style={styles.gradientContainer}
            >
              <Typography variant="h2" center color={COLORS.success}>
                Iceberg Fully Revealed!
              </Typography>
              <Typography variant="body" center>
                You and your partner have explored the depths of your relationship dynamics.
              </Typography>
              <SquishyButton 
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
                style={styles.returnButton}
              >
                <Typography variant="h2">Return to Menu</Typography>
              </SquishyButton>
            </LinearGradient>
          </GlassCard>
        )}

        {partnerResponse && (
          <GlassCard style={styles.partnerCard}>
            <Typography variant="sass" color={COLORS.aquaTeal}>
              Partner's Response:
            </Typography>
            <View style={styles.partnerSliderContainer}>
              <View style={styles.sliderRow}>
                <Typography variant="caption" style={styles.sliderLabel}>
                  Visible: {partnerResponse.above}%
                </Typography>
                <View style={styles.partnerSlider}>
                  <View style={[styles.partnerSliderFill, { width: `${partnerResponse.above}%`, backgroundColor: COLORS.gradientStart }]} />
                </View>
              </View>
              <View style={styles.sliderRow}>
                <Typography variant="caption" style={styles.sliderLabel}>
                  Hidden: {partnerResponse.below}%
                </Typography>
                <View style={styles.partnerSlider}>
                  <View style={[styles.partnerSliderFill, { width: `${partnerResponse.below}%`, backgroundColor: COLORS.lavenderPurple }]} />
                </View>
              </View>
            </View>
          </GlassCard>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  gradientContainer: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  icebergContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.large,
    marginVertical: SPACING.regular,
    overflow: 'hidden',
  },
  aboveWater: {
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  waterLine: {
    padding: SPACING.small,
    backgroundColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  belowWater: {
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
  },
  sliderContainer: {
    marginVertical: SPACING.regular,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  sliderLabel: {
    width: 100,
  },
  sliderTrack: {
    flex: 1,
    height: SPACING.small,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginHorizontal: SPACING.small,
  },
  sliderFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  returnButton: {
    marginTop: SPACING.regular,
  },
  partnerCard: {
    marginTop: SPACING.regular,
  },
  partnerSliderContainer: {
    marginTop: SPACING.regular,
  },
  partnerSlider: {
    height: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    flex: 1,
  },
  partnerSliderFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
});
