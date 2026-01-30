
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const categories = ['Origin Story', 'Pet Peeves', 'Future Dreams', 'Daily Rituals', 'Inner World'];
const values = [100, 200, 300, 400, 500];

const JeopardyCard = ({ value, played, onPress }: { value: number, played: boolean, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} disabled={played} style={[styles.card, played && styles.playedCard]}>
        <Text style={[styles.cardValue, played && styles.playedCardValue]}>${value}</Text>
    </TouchableOpacity>
);

const CouplesJeopardyGameScreen = () => {
    const [board, setBoard] = useState(Array(5).fill(Array(5).fill(false)));

    const handleCardPress = (catIndex: number, valIndex: number) => {
        const newBoard = board.map(row => [...row]);
        newBoard[catIndex][valIndex] = true;
        setBoard(newBoard);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#1a0a10', '#2d132c']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.mainTitle}>Couple's Jeopardy</Text>
                <Text style={styles.subTitle}>Level 1: The Foundations</Text>

                <View style={styles.boardContainer}>
                    {categories.map((category, catIndex) => (
                        <View key={category} style={styles.categoryColumn}>
                            <View style={styles.categoryHeader}><Text style={styles.categoryTitle}>{category}</Text></View>
                            {values.map((value, valIndex) => (
                                <JeopardyCard 
                                    key={value} 
                                    value={value} 
                                    played={board[catIndex][valIndex]} 
                                    onPress={() => handleCardPress(catIndex, valIndex)} 
                                />
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.footerControls}>
                    <View style={styles.playerScoreBox}>
                        <Text style={styles.playerName}>Alex Johnson</Text>
                        <Text style={styles.playerScore}>$1,200</Text>
                    </View>
                    <TouchableOpacity style={styles.buzzButton}>
                       <LinearGradient colors={['#00f5d4', '#00bfa5']} style={styles.buzzButtonGradient}>
                           <Text style={styles.buzzButtonText}>BUZZ</Text>
                       </LinearGradient>
                    </TouchableOpacity>
                    <View style={[styles.playerScoreBox, {alignItems: 'flex-end'}]}>
                        <Text style={styles.playerName}>Jordan Smith</Text>
                        <Text style={styles.playerScore}>$850</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { alignItems: 'center', padding: 10 },
    mainTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 44, color: '#FFF', textShadowColor: '#ff005e', textShadowRadius: 10 },
    subTitle: { fontFamily: 'SweetPink-Regular', color: '#ff005e', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 },
    boardContainer: { flexDirection: 'row', backgroundColor: 'rgba(26, 26, 26, 0.4)', borderRadius: 24, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    categoryColumn: { flex: 1, marginHorizontal: 5 },
    categoryHeader: { backgroundColor: '#ff005e', padding: 10, borderRadius: 12, marginBottom: 10, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
    categoryTitle: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', textTransform: 'uppercase', fontSize: 12, textAlign: 'center' },
    card: { backgroundColor: '#1a1a1a', borderRadius: 12, aspectRatio: 1.25, alignItems: 'center', justifyContent: 'center', marginVertical: 5 },
    playedCard: { backgroundColor: 'rgba(26,26,26,0.5)', opacity: 0.5 },
    cardValue: { fontFamily: 'BarbieDream-Regular', fontSize: 28, color: '#ffd700' },
    playedCardValue: { textDecorationLine: 'line-through', color: 'rgba(255, 215, 0, 0.5)' },
    footerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 20, marginTop: 20 },
    playerScoreBox: { backgroundColor: 'rgba(26, 26, 26, 0.6)', padding: 15, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#ff005e', flex: 1 },
    playerName: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12 },
    playerScore: { fontFamily: 'BarbieDream-Regular', color: '#ff005e', fontSize: 24 },
    buzzButton: { width: 100, height: 100, borderRadius: 50, marginHorizontal: 20, shadowColor: '#00f5d4', shadowRadius: 15, shadowOpacity: 0.8 },
    buzzButtonGradient: { flex: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
    buzzButtonText: { fontFamily: 'BarbieDream-Regular', color: '#1a0a10', fontSize: 24 },
});

export default CouplesJeopardyGameScreen;
