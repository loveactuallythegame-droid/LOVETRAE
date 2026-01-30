
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const PlayerCard = ({ name, coins, color, onBid }: { name: string, coins: number, color: string, onBid: () => void }) => (
    <View style={[styles.playerCard, { borderColor: color }]}>
        <Text style={styles.playerName}>{name}</Text>
        <Text style={[styles.playerCoins, { color }]}>{coins}</Text>
        <Text style={styles.playerCoinsLabel}>Emotional Coins</Text>
        <TouchableOpacity style={[styles.bidButton, { backgroundColor: color }]} onPress={onBid}>
            <Text style={styles.bidButtonText}>BID 25 COINS</Text>
        </TouchableOpacity>
    </View>
);

const AppreciationAuctionGameScreen = () => {
    const [playerACoins, setPlayerACoins] = useState(450);
    const [playerBCoins, setPlayerBCoins] = useState(320);
    const [currentBid, setCurrentBid] = useState(150);
    const [highestBidder, setHighestBidder] = useState('Jamie');

    const handleBid = (player: 'A' | 'B') => {
        const bidAmount = player === 'A' ? 25 : 50;
        if (player === 'A') {
            setPlayerACoins(playerACoins - bidAmount);
            setHighestBidder('Alex');
        } else {
            setPlayerBCoins(playerBCoins - bidAmount);
            setHighestBidder('Jamie');
        }
        setCurrentBid(currentBid + bidAmount);
    };

  return (
    <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#141118', '#191022']} style={styles.background} />
        <Header title="Appreciation Auction" />
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.auctionPodium}>
                <Text style={styles.auctioneerName}>Dr. Marcie Liss</Text>
                <Text style={styles.auctioneerQuote}>"Going once, going twice..."</Text>
                <View style={styles.appreciationCard}>
                    <Text style={styles.appreciationText}>"You fold laundry like a Zen master"</Text>
                    <View style={styles.bidInfo}>
                        <Text style={styles.currentBid}>{currentBid}</Text>
                        <Text style={styles.highestBidder}>Highest Bidder: {highestBidder}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.playersContainer}>
                <PlayerCard name="Alex" coins={playerACoins} color="#00f5ff" onBid={() => handleBid('A')} />
                <PlayerCard name="Jamie" coins={playerBCoins} color="#ff007a" onBid={() => handleBid('B')} />
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#191022' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { padding: 20 },
    auctionPodium: { alignItems: 'center', marginBottom: 30 },
    auctioneerName: { fontFamily: 'BarbieDream-Regular', fontSize: 24, color: '#FFF' },
    auctioneerQuote: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#7f13ec', fontStyle: 'italic', marginBottom: 20 },
    appreciationCard: {
        backgroundColor: '#1a1520',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    appreciationText: { fontFamily: 'BarbieDream-Regular', fontSize: 28, color: '#FFF', textAlign: 'center', marginBottom: 20 },
    bidInfo: { alignItems: 'center' },
    currentBid: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 36, color: '#FFF' },
    highestBidder: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#ff007a' },
    playersContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    playerCard: {
        backgroundColor: 'rgba(48, 40, 57, 0.4)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '45%',
        borderWidth: 2,
    },
    playerName: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 10 },
    playerCoins: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 28 },
    playerCoinsLabel: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 15 },
    bidButton: { paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10, width: '100%', alignItems: 'center' },
    bidButtonText: { fontFamily: 'BarbieDream-Regular', fontSize: 14, color: '#000', fontWeight: 'bold' },
});

export default AppreciationAuctionGameScreen;
