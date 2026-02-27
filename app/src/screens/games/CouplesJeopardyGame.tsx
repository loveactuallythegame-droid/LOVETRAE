/**
 * Couples Jeopardy - Game Show Category
 * Full Jeopardy game with couple-specific categories
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks scores and revealed clues
 * - Supports Daily Double
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard } from '../../components/ui';

// Game Constants
const GAME_ID = 'couples-jeopardy';
const CATEGORY_ID = 'game-show';
const MAX_SCORE = 2500;

// Jeopardy Data
interface Clue {
    value: number;
    question: string;
    answer: string;
    revealed: boolean;
    dailyDouble?: boolean;
}

interface Category {
    name: string;
    clues: Clue[];
}

const JEOPARDY_DATA: Category[] = [
    {
        name: "Origin Story",
        clues: [
            { value: 100, question: "The city or place where you first met", answer: "Where is [your meeting place]?", revealed: false },
            { value: 200, question: "What your partner was wearing on your first date", answer: "What was [description]?", revealed: false },
            { value: 300, question: "The exact date of your anniversary", answer: "When is [date]?", revealed: false, dailyDouble: true },
            { value: 400, question: "Your partner's first impression of you", answer: "What was [impression]?", revealed: false },
            { value: 500, question: "The moment you knew you were in love", answer: "What was [moment]?", revealed: false }
        ]
    },
    {
        name: "Pet Peeves",
        clues: [
            { value: 100, question: "Something you do that annoys your partner most", answer: "What is [habit]?", revealed: false },
            { value: 200, question: "A household chore your partner avoids", answer: "What is [chore]?", revealed: false },
            { value: 300, question: "The way you squeeze the toothpaste tube", answer: "What is [method]?", revealed: false },
            { value: 400, question: "Your partner's biggest trigger word", answer: "What is [word]?", revealed: false },
            { value: 500, question: "The hill your partner will die on", answer: "What is [issue]?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Future Dreams",
        clues: [
            { value: 100, question: "Where your partner wants to retire", answer: "Where is [place]?", revealed: false },
            { value: 200, question: "Your partner's dream vacation destination", answer: "Where is [destination]?", revealed: false },
            { value: 300, question: "The career your partner secretly wants", answer: "What is [career]?", revealed: false },
            { value: 400, question: "Your partner's biggest life goal", answer: "What is [goal]?", revealed: false },
            { value: 500, question: "Where you both see yourselves in 10 years", answer: "What is [vision]?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Daily Rituals",
        clues: [
            { value: 100, question: "Your partner's morning beverage of choice", answer: "What is [drink]?", revealed: false },
            { value: 200, question: "The first thing your partner does when waking up", answer: "What is [activity]?", revealed: false },
            { value: 300, question: "Your partner's pre-bed routine", answer: "What is [routine]?", revealed: false, dailyDouble: true },
            { value: 400, question: "Something your partner does when stressed", answer: "What is [coping mechanism]?", revealed: false },
            { value: 500, question: "Your partner's secret guilty pleasure", answer: "What is [guilty pleasure]?", revealed: false }
        ]
    },
    {
        name: "Inner World",
        clues: [
            { value: 100, question: "Your partner's biggest fear", answer: "What is [fear]?", revealed: false },
            { value: 200, question: "What makes your partner feel most loved", answer: "What is [love language]?", revealed: false },
            { value: 300, question: "Your partner's core value", answer: "What is [value]?", revealed: false },
            { value: 400, question: "A childhood memory that shaped your partner", answer: "What was [memory]?", revealed: false, dailyDouble: true },
            { value: 500, question: "The one thing your partner needs most from you", answer: "What is [need]?", revealed: false }
        ]
    }
];

const CouplesJeopardyGame: React.FC = () => {
    const navigation = useNavigation();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [categories, setCategories] = useState<Category[]>(JEOPARDY_DATA);
    const [score, setScore] = useState(0);
    const [selectedClue, setSelectedClue] = useState<{catIndex: number, clueIndex: number} | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [wager, setWager] = useState(0);
    const [showWager, setShowWager] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);

    const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0);

    // Select clue
    const selectClue = (catIndex: number, clueIndex: number) => {
        const clue = categories[catIndex].clues[clueIndex];
        if (clue.revealed) return;

        setSelectedClue({ catIndex, clueIndex });
        
        if (clue.dailyDouble) {
            setShowWager(true);
            setWager(0);
        }
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!selectedClue) return;

        const { catIndex, clueIndex } = selectedClue;
        const clue = categories[catIndex].clues[clueIndex];
        
        let points = clue.value;
        if (clue.dailyDouble && showWager) {
            points = wager;
        }

        // Simple answer check (contains key words)
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = clue.answer.toLowerCase();
        
        const isCorrect = normalizedUser.length > 3; // Simplified - would use AI in production

        // Update categories
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);
        setRevealedCount(prev => prev + 1);

        if (isCorrect) {
            const newScore = score + points;
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: points,
                correct: true
            }]);

            Alert.alert('Correct!', `+$${points}`, [{ text: 'Continue' }]);
        } else {
            const newScore = Math.max(0, score - points);
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: -points,
                correct: false
            }]);

            Alert.alert('Incorrect!', `The correct answer was: ${clue.answer}`, [{ text: 'Continue' }]);
        }

        setSelectedClue(null);
        setUserAnswer('');
        setShowWager(false);

        // Check if game complete
        if (revealedCount + 1 >= totalClues) {
            finishGame(isCorrect ? score + points : Math.max(0, score - points));
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Contestant';
        if (finalScore >= 2000) badge = 'Jeopardy Champion';
        else if (finalScore >= 1500) badge = 'Quiz Master';
        else if (finalScore >= 1000) badge = 'Smart Cookie';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            categories: categories.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: $${finalScore}\nBadge: ${badge}`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: finalScore, 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: 'Exit', onPress: () => navigation.goBack() }
            ]
        );
    };

    // Loading state
    if (sessionLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#1a0a10', '#2d132c']} style={styles.background}>
                    <Text style={styles.loadingText}>Loading Jeopardy...</Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // Selected clue view
    if (selectedClue) {
        const clue = categories[selectedClue.catIndex].clues[selectedClue.clueIndex];
        
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#1a0a10', '#2d132c']} style={styles.background}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {showWager && (
                            <View style={styles.dailyDoubleBanner}>
                                <Text style={styles.dailyDoubleText}>DAILY DOUBLE!</Text>
                                <TextInput
                                    style={styles.wagerInput}
                                    placeholder={`Wager up to $${score}`}
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={wager.toString()}
                                    onChangeText={(text) => setWager(Math.min(score, parseInt(text) || 0))}
                                />
                            </View>
                        )}

                        <GlassCard style={styles.questionCard}>
                            <Text style={styles.categoryLabel}>{categories[selectedClue.catIndex].name}</Text>
                            <Text style={styles.valueLabel}>${clue.value}</Text>
                            <Text style={styles.questionText}>{clue.question}</Text>
                        </GlassCard>

                        <TextInput
                            style={styles.answerInput}
                            placeholder="What is...?"
                            placeholderTextColor="#999"
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                            autoFocus
                        />

                        <TouchableOpacity 
                            style={[styles.submitButton, !userAnswer.trim() && styles.disabledButton]}
                            onPress={submitAnswer}
                            disabled={!userAnswer.trim() || (showWager && wager <= 0)}
                        >
                            <Text style={styles.submitText}>Answer</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // Game board
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#1a0a10', '#2d132c']} style={styles.background} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.mainTitle}>Couple's Jeopardy</Text>
                    <View style={styles.scoreDisplay}>
                        <Text style={styles.scoreText}>${score}</Text>
                        {isSyncing && <Text style={styles.syncText}>💾</Text>}
                    </View>
                </View>

                <LinearGradient
                    colors={['#060ce9', '#000080']}
                    style={styles.boardContainer}
                >
                    {categories.map((category, catIndex) => (
                        <View key={category.name} style={styles.categoryColumn}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.categoryTitle}>{category.name}</Text>
                            </View>
                            {category.clues.map((clue, clueIndex) => (
                                <TouchableOpacity
                                    key={clue.value}
                                    style={[
                                        styles.card,
                                        clue.revealed && styles.playedCard,
                                        clue.dailyDouble && !clue.revealed && styles.dailyDoubleCard
                                    ]}
                                    onPress={() => selectClue(catIndex, clueIndex)}
                                    disabled={clue.revealed}
                                >
                                    <LinearGradient
                                        colors={clue.revealed ? ['#000040', '#000040'] : ['#060ce9', '#000080']}
                                        style={styles.cardGradient}
                                    >
                                        <Text style={[
                                            styles.cardValue,
                                            clue.revealed && styles.playedCardValue
                                        ]}>
                                            {clue.revealed ? '—' : `$${clue.value}`}
                                        </Text>
                                        {clue.dailyDouble && !clue.revealed && (
                                            <Text style={styles.ddBadge}>DD</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </LinearGradient>

                {session && (
                    <Text style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    scoreDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 32,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    syncText: {
        marginLeft: 8,
        fontSize: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 100,
    },
    boardContainer: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
    },
    categoryColumn: {
        flex: 1,
        marginRight: 5,
    },
    categoryHeader: {
        backgroundColor: '#060ce9',
        padding: 8,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    categoryTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 9,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    card: {
        height: 50,
        marginBottom: 5,
        borderRadius: 4,
        overflow: 'hidden',
    },
    playedCard: {
        opacity: 0.3,
    },
    dailyDoubleCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardValue: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playedCardValue: {
        color: 'rgba(255,215,0,0.3)',
    },
    ddBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FFD700',
        color: '#000',
        fontSize: 8,
        fontWeight: 'bold',
        padding: 2,
        borderRadius: 2,
    },
    dailyDoubleBanner: {
        backgroundColor: '#FFD700',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    dailyDoubleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    wagerInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: 150,
        textAlign: 'center',
        fontSize: 18,
        marginTop: 10,
    },
    questionCard: {
        padding: 20,
        marginBottom: 20,
        minHeight: 150,
        justifyContent: 'center',
    },
    categoryLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 5,
    },
    valueLabel: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    questionText: {
        fontSize: 22,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 30,
    },
    answerInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    submitButton: {
        backgroundColor: '#060ce9',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CouplesJeopardyGame;
