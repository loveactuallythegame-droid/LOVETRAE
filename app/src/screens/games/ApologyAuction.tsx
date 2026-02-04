import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

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
            where('userId', '!=', user.uid) // Different user
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
  };

  const submitBid = () => {
    if (!selectedCard) return;
    
    const card = APOLOGY_CARDS.find(c => c.id === selectedCard);
    if (card) {
      setPlayerScore(prev => prev + card.value);
      setRound(prev => prev + 1);
      setSelectedCard(null);
    }
  };

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      <GlassCard>
        <LinearGradient
          colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Dr. Marcie Section */}
          <View style={styles.drMarcieSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
            </View>
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText} variant="sass">Genuine apologies are the foundation of trust! Choose the most heartfelt option to win this auction.</Text>
            </View>
          </View>
          
          <Text variant="header" style={{ marginBottom: theme.SPACING.md, color: theme.COLORS.textPrimary }}>
            Round {round} of 5
          </Text>
          <Text variant="body" style={{ marginBottom: theme.SPACING.lg, color: theme.COLORS.textSecondary }}>
            Select the most genuine apology for the situation
          </Text>

          <View style={styles.cardsContainer}>
            {APOLOGY_CARDS.map((card) => (
              <LinearGradient
                key={card.id}
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.card,
                  selectedCard === card.id && styles.selectedCard
                ]}
              >
                <SquishyButton
                  style={styles.squishyButton}
                  onPress={() => selectCard(card.id)}
                >
                  <Text variant="body" style={{ 
                    color: selectedCard === card.id ? theme.COLORS.background : theme.COLORS.textPrimary,
                    textAlign: 'center'
                  }}>
                    {card.text}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text variant="small" style={{ 
                      color: selectedCard === card.id ? theme.COLORS.background : theme.COLORS.accentTeal 
                    }}>
                      Value: {card.value} pts
                    </Text>
                  </View>
                </SquishyButton>
              </LinearGradient>
            ))}
          </View>

          <SquishyButton 
            style={styles.submitButton} 
            onPress={submitBid} 
            disabled={!selectedCard}
          >
            <Text variant="header" style={{ color: theme.COLORS.background }}>
              Bid Apology
            </Text>
          </SquishyButton>
        </LinearGradient>
      </GlassCard>
      
      {partnerResponse && (
        <GlassCard style={styles.partnerCard}>
          <Text variant="sass" style={{ color: theme.COLORS.accentTeal, marginBottom: theme.SPACING.sm }}>
            Partner's Choice:
          </Text>
          <Text variant="body" style={{ color: theme.COLORS.textSecondary }}>
            {partnerResponse.selectedCard 
              ? `Selected card with value: ${partnerResponse.selectedCard}`
              : 'Partner is selecting...'}
          </Text>
        </GlassCard>
      )}
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Apology Auction',
    description: 'Bid on the most genuine apologies',
    category: 'conflict-resolution' as const,
    difficulty: 'medium' as const,
    xpReward: 50,
    currentStep: round,
    totalTime: 300,
    playerData: { 
      vulnerabilityScore: playerScore > 75 ? 90 : playerScore > 50 ? 70 : 50, 
      honestyScore: playerScore > 75 ? 85 : playerScore > 50 ? 65 : 45, 
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
            score: playerScore,
            state: JSON.stringify({ completed: true, finalScore: playerScore })
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
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
  },
  card: {
    flex: 1,
    minWidth: (width - theme.SPACING.lg * 4) / 2,
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    marginBottom: theme.SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  squishyButton: {
    flex: 1,
    padding: theme.SPACING.md,
  },
  selectedCard: {
    backgroundColor: theme.COLORS.success,
    borderColor: theme.COLORS.success,
  },
  cardFooter: {
    marginTop: theme.SPACING.sm,
    alignItems: 'flex-end',
  },
  submitButton: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
    alignItems: 'center',
    opacity: 0.7,
    backgroundColor: '#db147c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonEnabled: {
    opacity: 1,
  },
  partnerCard: {
    marginTop: theme.SPACING.md,
    padding: theme.SPACING.md,
  },
});