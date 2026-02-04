import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const PlayerCard = ({ name, coins, color, onBid }: { name: string, coins: number, color: string, onBid: () => void }) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.playerCard, { borderColor: color }]}
    >
        <Text style={styles.playerName}>{name}</Text>
        <Text style={[styles.playerCoins, { color: '#ffffff' }]}>{coins}</Text>
        <Text style={styles.playerCoinsLabel}>Emotional Coins</Text>
        <TouchableOpacity style={[styles.bidButton, { backgroundColor: '#ffffff' }]} onPress={onBid}>
            <Text style={[styles.bidButtonText, { color: '#db147c' }]}>BID 25 COINS</Text>
        </TouchableOpacity>
    </LinearGradient>
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
        
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>Bid on authentic appreciation! Genuine compliments are worth their weight in gold.</Text>
          </View>
        </View>
        
        <Header title="Appreciation Auction" />
        <ScrollView contentContainerStyle={styles.content}>
            <LinearGradient
                colors={['#a22ac4', '#9056ef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.auctionPodium}
            >
                <Text style={styles.auctioneerName}>Dr. Marcie Liss</Text>
                <Text style={styles.auctioneerQuote}>"Going once, going twice..."</Text>
                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.appreciationCard}
                >
                    <Text style={styles.appreciationText}>"You fold laundry like a Zen master"</Text>
                    <View style={styles.bidInfo}>
                        <Text style={styles.currentBid}>{currentBid}</Text>
                        <Text style={styles.highestBidder}>Highest Bidder: {highestBidder}</Text>
                    </View>
                </LinearGradient>
            </LinearGradient>

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
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
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
    content: { padding: 20 },
    auctionPodium: { 
        alignItems: 'center', 
        marginBottom: 30,
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    auctioneerName: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 24, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    auctioneerQuote: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 16, 
        color: '#ff7600', 
        fontStyle: 'italic', 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    appreciationCard: {
        borderRadius: 20,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    appreciationText: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 28, 
        color: '#ffffff', 
        textAlign: 'center', 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    bidInfo: { alignItems: 'center' },
    currentBid: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 36, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    highestBidder: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 14, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    playersContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    playerCard: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '45%',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    playerName: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#ffffff', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    playerCoins: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 28,
        color: '#ffffff',
    },
    playerCoinsLabel: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        marginBottom: 15,
        opacity: 0.8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    bidButton: { 
        paddingVertical: 15, 
        paddingHorizontal: 10, 
        borderRadius: 10, 
        width: '100%', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    bidButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 14, 
        fontWeight: 'bold',
    },
});

export default AppreciationAuctionGameScreen;