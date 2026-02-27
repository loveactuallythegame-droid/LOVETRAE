/**
 * Relational Jeopardy - Love Arcade Game
 * Classic Jeopardy format with relationship-themed categories
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks scores and revealed answers
 * - Completes game with final score
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

const { width, height } = Dimensions.get('window');

// Game Constants
const GAME_ID = 'relational-jeopardy';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 2000;

// Jeopardy Categories
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

const JEOPARDY_CATEGORIES: Category[] = [
    {
        name: "Accountability Plans",
        clues: [
            { value: 100, question: "This involves taking responsibility for your actions", answer: "What is ownership?", revealed: false },
            { value: 200, question: "This is the first step to repairing trust", answer: "What is acknowledgment?", revealed: false },
            { value: 300, question: "This describes making amends for harm caused", answer: "What is restitution?", revealed: false },
            { value: 400, question: "This is about changing harmful patterns", answer: "What is behavioral change?", revealed: false, dailyDouble: true },
            { value: 500, question: "This requires consistent follow-through over time", answer: "What is reliability?", revealed: false }
        ]
    },
    {
        name: "Redefinition",
        clues: [
            { value: 100, question: "This is the process of changing how you see your relationship", answer: "What is reframing?", revealed: false },
            { value: 200, question: "This involves creating new narratives about past events", answer: "What is rewriting history?", revealed: false },
            { value: 300, question: "This means establishing new expectations", answer: "What is setting boundaries?", revealed: false },
            { value: 400, question: "This is about building new traditions", answer: "What is creating rituals?", revealed: false },
            { value: 500, question: "This involves developing a shared vision", answer: "What is co-creating the future?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Integration",
        clues: [
            { value: 100, question: "This refers to incorporating new behaviors", answer: "What is assimilation?", revealed: false },
            { value: 200, question: "This involves blending old and new selves", answer: "What is synthesis?", revealed: false },
            { value: 300, question: "This is about maintaining growth over time", answer: "What is sustainability?", revealed: false, dailyDouble: true },
            { value: 400, question: "This involves bringing insights into daily life", answer: "What is application?", revealed: false },
            { value: 500, question: "This is the ultimate goal of relationship growth", answer: "What is transformation?", revealed: false }
        ]
    },
    {
        name: "Communication",
        clues: [
            { value: 100, question: "This type of listening involves fully focusing on your partner", answer: "What is active listening?", revealed: false },
            { value: 200, question: "This phrase structure helps express feelings without blame", answer: "What is I feel statements?", revealed: false },
            { value: 300, question: "This is the ability to understand your partner's perspective", answer: "What is empathy?", revealed: false },
            { value: 400, question: "This communication style avoids conflict but builds resentment", answer: "What is passive-aggressive?", revealed: false },
            { value: 500, question: "This Gottman term describes criticism, contempt, defensiveness, and stonewalling", answer: "What are the Four Horsemen?", revealed: false }
        ]
    },
    {
        name: "Intimacy",
        clues: [
            { value: 100, question: "This type of intimacy involves emotional closeness", answer: "What is emotional intimacy?", revealed: false },
            { value: 200, question: "This is the foundation of physical intimacy", answer: "What is consent?", revealed: false },
            { value: 300, question: "This practice involves being fully present with your partner", answer: "What is mindfulness?", revealed: false },
            { value: 400, question: "This term describes the fear of emotional closeness", answer: "What is intimacy avoidance?", revealed: false },
            { value: 500, question: "This concept involves sharing your authentic self", answer: "What is vulnerability?", revealed: false }
        ]
    }
];

const RelationalJeopardy: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [categories, setCategories] = useState<Category[]>(JEOPARDY_CATEGORIES);
    const [score, setScore] = useState(0);
    const [selectedClue, setSelectedClue] = useState<{catIndex: number, clueIndex: number} | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [dailyDoubleWager, setDailyDoubleWager] = useState(0);
    const [showDailyDouble, setShowDailyDouble] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [answeredClues, setAnsweredClues] = useState(0);

    const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0);

    // Select a clue
    const selectClue = (catIndex: number, clueIndex: number) => {
        const clue = categories[catIndex].clues[clueIndex];
        if (clue.revealed) return;

        setSelectedClue({ catIndex, clueIndex });
        
        if (clue.dailyDouble) {
            setShowDailyDouble(true);
            setDailyDoubleWager(0);
        }
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!selectedClue) return;

        const { catIndex, clueIndex } = selectedClue;
        const clue = categories[catIndex].clues[clueIndex];
        
        let points = clue.value;
        
        // Daily double logic
        if (clue.dailyDouble && showDailyDouble) {
            points = dailyDoubleWager;
            setShowDailyDouble(false);
        }

        // Check answer (simplified - contains key words)
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = clue.answer.toLowerCase().replace('what is ', '').replace('?', '').trim();
        
        const isCorrect = normalizedUser.includes(normalizedCorrect) || 
                         normalizedCorrect.includes(normalizedUser) ||
                         normalizedUser.length > 5 && normalizedCorrect.split(' ').some(word => 
                             normalizedUser.includes(word) && word.length > 3
                         );

        // Update categories
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);

        if (isCorrect) {
            const newScore = score + points;
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: points,
                correct: true
            }]);

            Alert.alert('Correct!', `+${points} points`, [{ text: 'Continue' }]);
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

        setAnsweredClues(prev => prev + 1);
        setSelectedClue(null);
        setUserAnswer('');

        // Check if game complete
        if (answeredClues + 1 >= totalClues) {
            finishGame(isCorrect ? score + points : Math.max(0, score - points));
        }
    };

    // Skip clue
    const skipClue = async () => {
        if (!selectedClue) return;
        
        const { catIndex, clueIndex } = selectedClue;
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);
        
        setAnsweredClues(prev => prev + 1);
        setSelectedClue(null);
        setUserAnswer('');
        setShowDailyDouble(false);

        if (answeredClues + 1 >= totalClues) {
            finishGame(score);
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Jeopardy Novice';
        if (finalScore >= 1500) badge = 'Jeopardy Champion';
        else if (finalScore >= 1000) badge = 'Quiz Master';
        else if (finalScore >= 500) badge = 'Knowledge Seeker';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            categoriesPlayed: categories.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}`,
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
            <View style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Loading Jeopardy...</Text>
                </LinearGradient>
            </View>
        );
    }

    // Clue selected view
    if (selectedClue) {
        const clue = categories[selectedClue.catIndex].clues[selectedClue.clueIndex];
        
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Daily Double */}
                        {showDailyDouble && (
                            <View style={styles.dailyDoubleBanner}>
                                <Text style={styles.dailyDoubleText}>🎯 DAILY DOUBLE!</Text>
                                <Text style={styles.wagerText}>Current Score: {score}</Text>
                                <TextInput
                                    style={styles.wagerInput}
                                    placeholder="Enter wager..."
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={dailyDoubleWager.toString()}
                                    onChangeText={(text) => setDailyDoubleWager(Math.min(score, parseInt(text) || 0))}
                                />
                            </View>
                        )}

                        {/* Question */}
                        <GlassCard style={styles.questionCard}>
                            <Text style={styles.categoryLabel}>{categories[selectedClue.catIndex].name}</Text>
                            <Text style={styles.valueLabel}>${clue.value}</Text>
                            <Text style={styles.questionText}>{clue.question}</Text>
                        </GlassCard>

                        {/* Answer Input */}
                        <TextInput
                            style={styles.answerInput}
                            placeholder="What is...?"
                            placeholderTextColor="#999"
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                            autoFocus
                        />

                        {/* Buttons */}
                        <TouchableOpacity 
                            style={[styles.submitButton, !userAnswer.trim() && styles.disabledButton]}
                            onPress={submitAnswer}
                            disabled={!userAnswer.trim() || (showDailyDouble && dailyDoubleWager <= 0)}
                        >
                            <Text style={styles.submitText}>Submit Answer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.skipButton} onPress={skipClue}>
                            <Text style={styles.skipText}>Skip (-${clue.value})</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    }

    // Game board view
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Relational Jeopardy!</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>Score: ${score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                        <Text style={styles.progressText}>
                            {answeredClues} / {totalClues} clues
                        </Text>
                    </View>

                    {/* Game Board */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.board}>
                            {categories.map((category, catIndex) => (
                                <View key={category.name} style={styles.categoryColumn}>
                                    {/* Category Header */}
                                    <View style={styles.categoryHeader}>
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                    </View>
                                    
                                    {/* Clues */}
                                    {category.clues.map((clue, clueIndex) => (
                                        <TouchableOpacity
                                            key={clue.value}
                                            style={[
                                                styles.clueCell,
                                                clue.revealed && styles.clueRevealed,
                                                clue.dailyDouble && !clue.revealed && styles.dailyDoubleCell
                                            ]}
                                            onPress={() => selectClue(catIndex, clueIndex)}
                                            disabled={clue.revealed}
                                        >
                                            <Text style={[
                                                styles.clueValue,
                                                clue.revealed && styles.clueValueRevealed
                                            ]}>
                                                {clue.revealed ? '—' : `$${clue.value}`}
                                            </Text>
                                            {clue.dailyDouble && !clue.revealed && (
                                                <Text style={styles.ddBadge}>DD</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Session Info */}
                    {session && (
                        <Text style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Text>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    scoreText: {
        fontSize: 24,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    syncText: {
        marginLeft: 8,
        fontSize: 14,
    },
    progressText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginTop: 5,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    board: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    categoryColumn: {
        width: 140,
        marginRight: 10,
    },
    categoryHeader: {
        backgroundColor: '#060ce9',
        padding: 10,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 5,
    },
    categoryName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 11,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    clueCell: {
        backgroundColor: '#060ce9',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 5,
    },
    clueRevealed: {
        backgroundColor: 'rgba(6, 12, 233, 0.3)',
    },
    dailyDoubleCell: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    clueValue: {
        color: '#FFD700',
        fontSize: 22,
        fontWeight: 'bold',
    },
    clueValueRevealed: {
        color: 'rgba(255,255,255,0.3)',
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    wagerText: {
        fontSize: 16,
        color: '#000',
        marginTop: 10,
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
        minHeight: 200,
        justifyContent: 'center',
    },
    categoryLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 5,
    },
    valueLabel: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    questionText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 28,
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
        marginBottom: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    skipText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default RelationalJeopardy;
