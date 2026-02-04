import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

const LOTS = [
  { text: "You fold laundry like a Zen master.", real: true, cost: 50 },
  { text: "I love how you chew gum loudly.", real: false, cost: 10 },
  { text: "Your smile when you see a dog.", real: true, cost: 80 },
];

export default function AppreciationAuction({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);
  const [coins, setCoins] = useState(100);

  function bid(amount: number) {
    if (coins < amount) {
      speakMarcie("Insufficient funds, darling.");
      HapticFeedbackSystem.error();
      return;
    }
    setCoins(c => c - amount);
    if (LOTS[index].real) {
      HapticFeedbackSystem.success();
      speakMarcie("Sold! A genuine appreciation.");
    } else {
      HapticFeedbackSystem.warning();
      speakMarcie("You bought a fake? Awkward.");
    }

    if (index < LOTS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Auction Closed", `Remaining Coins: ${coins}`, [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  function pass() {
    if (LOTS[index].real) {
      speakMarcie("You passed on a real one? Someone's missing out.");
    } else {
      speakMarcie("Smart pass. That was AI garbage.");
    }
    if (index < LOTS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Auction Closed", `Remaining Coins: ${coins}`, [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Bid on authentic appreciation! Distinguish genuine compliments from fake ones.</Text>
          </View>
        </View>

        <Text variant="header">Lot #{index + 1}</Text>
        <Text variant="sass" style={styles.lot}>"{LOTS[index].text}"</Text>
        <Text variant="keyword" style={{ textAlign: 'center' }}>Balance: {coins} Coins</Text>
        <View style={styles.actions}>
          <SquishyButton onPress={() => bid(LOTS[index].cost)} style={styles.bidBtn}>
            <LinearGradient
              colors={['#37cf97', '#b37dec']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text variant="header" style={{ color: '#ffffff' }}>Bid {LOTS[index].cost}</Text>
            </LinearGradient>
          </SquishyButton>
          <SquishyButton onPress={pass} style={styles.passBtn}>
            <LinearGradient
              colors={['#db147c', '#f05d68']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text variant="header" style={{ color: '#ffffff' }}>Pass</Text>
            </LinearGradient>
          </SquishyButton>
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Appreciation Auction',
    description: 'Bid on real vs fake appreciations',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  lot: { 
    fontSize: 20, 
    textAlign: 'center', 
    marginVertical: 16, 
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 12 },
  bidBtn: { 
    padding: 16, 
    borderRadius: 12, 
    flex: 1, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  passBtn: { 
    padding: 16, 
    borderRadius: 12, 
    flex: 1, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
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
  }
});
