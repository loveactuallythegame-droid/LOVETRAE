import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS, GRADIENTS } from '../../theme';

import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const APOLOGY_CARDS = [
  { id: '1', text: "I'm sorry you felt that way...", type: 'avoidance', value: 10 },
  { id: '2', text: "I shouldn't have raised my voice", type: 'ownership', value: 80 },
  { id: '3', text: "I was wrong and I take full responsibility", type: 'accountability', value: 100 },
  { id: '4', text: "Next time I'll pause before responding", type: 'repair', value: 70 },
  { id: '5', text: "I hurt you and I'm deeply sorry", type: 'empathy', value: 90 },
];

export default function ApologyAuction({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'apology-auction' };
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [round, setRound] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<any>(null);
  const coupleId = useRef<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
            state: { round, selectedCard, score: playerScore },
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
                  setPartnerResponse(data.state);
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

  const selectCard = (cardId: string) => {
    setSelectedCard(cardId);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const submitBid = () => {
    if (!selectedCard) return;
    
    const card = APOLOGY_CARDS.find(c => c.id === selectedCard);
    if (card) {
      setPlayerScore(prev => prev + card.value);
      setRound(prev => prev + 1);
      setSelectedCard(null);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Genuine apologies are the foundation of trust! Choose the most heartfelt option to win this auction.">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <GlassCard>
          <LinearGradient
            colors={[COLORS.backgroundInput, COLORS.backgroundInput]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Typography variant="h3" style={{ marginBottom: SPACING.md, color: COLORS.textPrimary }}>
              Round {round} of 5
            </Typography>
            <Typography variant="body" style={{ marginBottom: SPACING.lg, color: COLORS.textSecondary }}>
              Select the most genuine apology for the situation
            </Typography>

            <View style={styles.cardsContainer}>
              {APOLOGY_CARDS.map((card) => (
                <Animated.View 
                  key={card.id}
                  style={[
                    { transform: [{ scale: selectedCard === card.id ? scaleAnim : 1 }] }
                  ]}
                >
                  <LinearGradient
                    colors={GRADIENTS.primary.colors}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={[
                      styles.card,
                      selectedCard === card.id && styles.selectedCard
                    ]}
                  >
                    <SquishyButton
                      style={styles.squishyButton}
                      onPress={() => selectCard(card.id)}
                    >
                      <Typography variant="body" style={{ 
                        color: selectedCard === card.id ? COLORS.backgroundPrimary : COLORS.textPrimary,
                        textAlign: 'center'
                      }}>
                        {card.text}
                      </Typography>
                      <View style={styles.cardFooter}>
                        <Typography variant="caption" style={{ 
                          color: selectedCard === card.id ? COLORS.backgroundPrimary : COLORS.mintGreen 
                        }}>
                          Value: {card.value} pts
                        </Typography>
                      </View>
                    </SquishyButton>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>

            <SquishyButton 
              style={styles.submitButton} 
              onPress={submitBid} 
              disabled={!selectedCard}
            >
              <Typography variant="button" style={{ color: COLORS.textPrimary }}>
                Bid Apology
              </Typography>
            </SquishyButton>
          </LinearGradient>
        </GlassCard>
        
        {partnerResponse && (
          <GlassCard style={styles.partnerCard}>
            <Typography variant="caption" style={{ color: COLORS.mintGreen, marginBottom: SPACING.sm }}>
              Partner's Choice:
            </Typography>
            <Typography variant="body" style={{ color: COLORS.textSecondary }}>
              {partnerResponse.selectedCard 
                ? `Selected card with value: ${partnerResponse.selectedCard}`
                : 'Partner is selecting...'}
            </Typography>
          </GlassCard>
        )}

        <View style={styles.scoreContainer}>
          <Typography variant="caption" style={styles.scoreLabel}>Your Score</Typography>
          <Typography variant="h2" style={styles.scoreValue}>{playerScore}</Typography>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxlarge,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  gradientContainer: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    flex: 1,
    minWidth: (width - SPACING.lg * 4) / 2,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.large,
  },
  squishyButton: {
    flex: 1,
    padding: SPACING.md,
  },
  selectedCard: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  cardFooter: {
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  submitButton: {
    marginTop: SPACING.md,
    opacity: 0.7,
  },
  partnerCard: {
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  scoreContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.vibrantPink,
  },
});
