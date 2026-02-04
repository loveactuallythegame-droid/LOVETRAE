import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const categories = ['Origin Story', 'Pet Peeves', 'Future Dreams', 'Daily Rituals', 'Inner World'];
const values = [100, 200, 300, 400, 500];

const JeopardyCard = ({ value, played, onPress }: { value: number, played: boolean, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} disabled={played} style={[styles.card, played && styles.playedCard]}>
        <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
        >
            <Text style={[styles.cardValue, played && styles.playedCardValue]}>${value}</Text>
        </LinearGradient>
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Test your knowledge of each other! How well do you really know your partner?</Text>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.mainTitle}>Couple's Jeopardy</Text>
                <Text style={styles.subTitle}>Level 1: The Foundations</Text>

                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.boardContainer}
                >
                    {categories.map((category, catIndex) => (
                        <View key={category} style={styles.categoryColumn}>
                            <LinearGradient
                                colors={['#db147c', '#f05d68']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.categoryHeader}
                            >
                                <Text style={styles.categoryTitle}>{category}</Text>
                            </LinearGradient>
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
                </LinearGradient>

                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.footerControls}
                >
                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.playerScoreBox}
                    >
                        <Text style={styles.playerName}>Alex Johnson</Text>
                        <Text style={styles.playerScore}>$1,200</Text>
                    </LinearGradient>
                    <TouchableOpacity style={styles.buzzButton}>
                       <LinearGradient colors={['#db147c', '#f05d68']} style={styles.buzzButtonGradient}>
                           <Text style={styles.buzzButtonText}>BUZZ</Text>
                       </LinearGradient>
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.playerScoreBox, {alignItems: 'flex-end'}]}
                    >
                        <Text style={styles.playerName}>Jordan Smith</Text>
                        <Text style={styles.playerScore}>$850</Text>
                    </LinearGradient>
                </LinearGradient>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    scrollContainer: { alignItems: 'center', padding: 10 },
    mainTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 44, 
        color: '#ffffff', 
        textShadowColor: 'rgba(219, 20, 124, 0.7)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    subTitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#db147c', 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        marginBottom: 20,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    boardContainer: { 
        flexDirection: 'row', 
        borderRadius: 24, 
        padding: 10, 
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    categoryColumn: { flex: 1, marginHorizontal: 5 },
    categoryHeader: { 
        padding: 10, 
        borderRadius: 12, 
        marginBottom: 10, 
        alignItems: 'center', 
        minHeight: 60, 
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    categoryTitle: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        fontSize: 12, 
        textAlign: 'center' 
    },
    card: { 
        borderRadius: 12, 
        aspectRatio: 1.25, 
        marginVertical: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    cardGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    playedCard: { opacity: 0.5 },
    cardValue: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 28, 
        color: '#ffef1f' 
    },
    playedCardValue: { textDecorationLine: 'line-through', color: 'rgba(255, 239, 31, 0.5)' },
    footerControls: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        padding: 20, 
        marginTop: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    playerScoreBox: { 
        padding: 15, 
        borderRadius: 16, 
        borderLeftWidth: 4, 
        borderLeftColor: '#db147c', 
        flex: 1,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    playerName: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    playerScore: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    buzzButton: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginHorizontal: 20, 
        shadowColor: '#db147c', 
        shadowRadius: 15, 
        shadowOpacity: 0.8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buzzButtonGradient: { 
        flex: 1, 
        borderRadius: 50, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    buzzButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default CouplesJeopardyGameScreen;