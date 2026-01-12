import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

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
        <Text variant="header">Lot #{index + 1}</Text>
        <Text variant="sass" style={styles.lot}>"{LOTS[index].text}"</Text>
        <Text variant="keyword" style={{ textAlign: 'center' }}>Balance: {coins} Coins</Text>
        <View style={styles.actions}>
          <SquishyButton onPress={() => bid(LOTS[index].cost)} style={styles.bidBtn}>
            <Text variant="header">Bid {LOTS[index].cost}</Text>
          </SquishyButton>
          <SquishyButton onPress={pass} style={styles.passBtn}>
            <Text variant="header">Pass</Text>
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
  lot: { fontSize: 20, textAlign: 'center', marginVertical: 16, color: '#fff' },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 12 },
  bidBtn: { backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, flex: 1, alignItems: 'center' },
  passBtn: { backgroundColor: '#E11637', padding: 16, borderRadius: 12, flex: 1, alignItems: 'center' },
});
