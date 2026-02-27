/**
 * The Intimacy Feud - Love Arcade Game
 * Family Feud style survey game for couples
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves guesses and responses
 * - Completes game with final score
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

const { width, height } = Dimensions.get('window');

// Game Constants
const GAME_ID = 'intimacy-feud';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 250;

// Survey Questions
interface SurveyAnswer {
    text: string;
    value: number;
    rank: number;
    revealed: boolean;
}

interface SurveyQuestion {
    id: string;
    question: string;
    answers: SurveyAnswer[];
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: '1',
        question: "What's your partner's biggest complaint about your relationship?",
        answers: [
            { text: "Not enough quality time", value: 42, rank: 1, revealed: false },
            { text: "Poor communication", value: 28, rank: 2, revealed: false },
            { text: "Lack of physical affection", value: 15, rank: 3, revealed: false },
            { text: "Trust issues", value: 10, rank: 4, revealed: false },
            { text: "Different life goals", value: 5, rank: 5, revealed: false }
        ]
    },
    {
        id: '2',
        question: "What's the most important thing for a strong relationship?",
        answers: [
            { text: "Good communication", value: 35, rank: 1, revealed: false },
            { text: "Physical intimacy", value: 25, rank: 2, revealed: false },
            { text: "Shared values", value: 20, rank: 3, revealed: false },
            { text: "Trust", value: 15, rank: 4, revealed: false },
            { text: "Quality time", value: 5, rank: 5, revealed: false }
        ]
    },
    {
        id: '3',
        question: "What's your partner's favorite way to show love?",
        answers: [
            { text: "Words of affirmation", value: 30, rank: 1, revealed: false },
            { text: "Acts of service", value: 25, rank: 2, revealed: false },
            { text: "Gifts", value: 20, rank: 3, revealed: false },
            { text: "Quality time", value: 15, rank: 4, revealed: false },
            { text: "Physical touch", value: 10, rank: 5, revealed: false }
        ]
    }
];

const IntimacyFeud: React.FC = () => {
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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [guesses, setGuesses] = useState<string[]>([]);

    const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
    const totalPoints = currentQuestion?.answers.reduce((sum, ans) => sum + ans.value, 0) || 0;
    const earnedPoints = currentQuestion?.answers
        .filter(ans => revealedAnswers.has(ans.text))
        .reduce((sum, ans) => sum + ans.value, 0) || 0;

    // Check guess
    const makeGuess = (guess: string) => {
        if (!guess.trim()) return;

        const normalizedGuess = guess.toLowerCase().trim();
        
        // Check if already guessed
        if (guesses.includes(normalizedGuess)) {
            Alert.alert('Already Guessed', 'You already tried that answer!');
            return;
        }

        setGuesses([...guesses, normalizedGuess]);

        // Find matching answer
        const match = currentQuestion?.answers.find(ans => 
            ans.text.toLowerCase().includes(normalizedGuess) ||
            normalizedGuess.includes(ans.text.toLowerCase())
        );

        if (match && !revealedAnswers.has(match.text)) {
            // Correct guess
            const newRevealed = new Set(revealedAnswers);
            newRevealed.add(match.text);
            setRevealedAnswers(newRevealed);
            
            // Update score
            const newScore = score + match.value;
            setScore(newScore);

            // Save to backend
            updateScore(newScore, false, [
                { 
                    questionId: currentQuestion.id,
                    guess: match.text,
                    points: match.value,
                    correct: true
                }
            ]);

            // Check if all answers found
            if (newRevealed.size === currentQuestion.answers.length) {
                setTimeout(() => nextQuestion(), 1500);
            }
        } else {
            // Wrong guess - add strike
            const newStrikes = strikes + 1;
            setStrikes(newStrikes);
            
            if (newStrikes >= 3) {
                // Too many strikes, move to next question
                Alert.alert(
                    'Three Strikes!',
                    'Moving to next question...',
                    [{ text: 'OK', onPress: () => nextQuestion() }]
                );
            } else {
                Alert.alert(
                    'Survey Says...',
                    `❌ Not on the board! ${3 - newStrikes} strikes remaining.`,
                    [{ text: 'Try Again' }]
                );
            }
        }
    };

    // Next question
    const nextQuestion = async () => {
        if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setRevealedAnswers(new Set());
            setStrikes(0);
            setGuesses([]);
        } else {
            finishGame();
        }
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        // Calculate badge
        let badge = 'Feud Fighter';
        if (score >= 200) badge = 'Survey Champion';
        else if (score >= 150) badge = 'Top Answer';
        else if (score >= 100) badge = 'Board Clearer';

        await completeGame(score, [
            { completed: true, badge, questionsAnswered: SURVEY_QUESTIONS.length }
        ]);

        Alert.alert(
            'Game Complete! 🎉',
            `Final Score: ${score}/${MAX_SCORE}\nBadge: ${badge}`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score, 
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
                    <Text style={styles.loadingText}>Loading Survey...</Text>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>The Intimacy Feud</Text>
                        <Text style={styles.subtitle}>Survey Says...</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>Score: {score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                    </View>

                    {/* Question */}
                    <GlassCard style={styles.questionCard}>
                        <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {SURVEY_QUESTIONS.length}</Text>
                        <Text style={styles.questionText}>{currentQuestion?.question}</Text>
                    </GlassCard>

                    {/* Strikes */}
                    <View style={styles.strikesContainer}>
                        <Text style={styles.strikesLabel}>Strikes:</Text>
                        <View style={styles.strikesRow}>
                            {[1, 2, 3].map((strikeNum) => (
                                <View 
                                    key={strikeNum}
                                    style={[
                                        styles.strike,
                                        strikes >= strikeNum && styles.strikeActive
                                    ]}
                                >
                                    <Text style={styles.strikeText}>X</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Answer Board */}
                    <View style={styles.boardContainer}>
                        {currentQuestion?.answers.map((answer, index) => (
                            <View 
                                key={answer.text}
                                style={[
                                    styles.answerRow,
                                    revealedAnswers.has(answer.text) && styles.answerRevealed
                                ]}
                            >
                                <Text style={styles.answerNumber}>{index + 1}</Text>
                                <View style={styles.answerContent}>
                                    {revealedAnswers.has(answer.text) ? (
                                        <>
                                            <Text style={styles.answerText}>{answer.text}</Text>
                                            <Text style={styles.answerValue}>{answer.value} pts</Text>
                                        </>
                                    ) : (
                                        <Text style={styles.hiddenText}>???</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Quick Guess Buttons */}
                    <View style={styles.quickGuesses}>
                        <Text style={styles.guessLabel}>Quick Guesses:</Text>
                        <View style={styles.guessButtons}>
                            {['Time', 'Communication', 'Trust', 'Affection'].map((guess) => (
                                <TouchableOpacity
                                    key={guess}
                                    style={styles.guessButton}
                                    onPress={() => makeGuess(guess)}
                                >
                                    <Text style={styles.guessButtonText}>{guess}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Skip Button */}
                    <TouchableOpacity style={styles.skipButton} onPress={nextQuestion}>
                        <Text style={styles.skipText}>Skip Question →</Text>
                    </TouchableOpacity>

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
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 5,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    scoreText: {
        fontSize: 20,
        color: '#db147c',
        fontWeight: 'bold',
    },
    syncText: {
        marginLeft: 8,
        fontSize: 14,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    questionCard: {
        padding: 20,
        marginBottom: 15,
    },
    questionNumber: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 8,
    },
    questionText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        lineHeight: 24,
    },
    strikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    strikesLabel: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
    strikesRow: {
        flexDirection: 'row',
        gap: 8,
    },
    strike: {
        width: 35,
        height: 35,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    strikeActive: {
        backgroundColor: '#ff4444',
        borderColor: '#ff4444',
    },
    strikeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    boardContainer: {
        marginBottom: 20,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        marginBottom: 8,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    answerRevealed: {
        backgroundColor: 'rgba(51, 222, 165, 0.1)',
        borderColor: '#33DEA5',
    },
    answerNumber: {
        width: 30,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 'bold',
        fontSize: 16,
    },
    answerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    answerText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    answerValue: {
        color: '#33DEA5',
        fontWeight: 'bold',
        fontSize: 14,
    },
    hiddenText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 16,
    },
    quickGuesses: {
        marginBottom: 20,
    },
    guessLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 10,
    },
    guessButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    guessButton: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#db147c',
    },
    guessButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    skipButton: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 25,
        marginBottom: 10,
    },
    skipText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default IntimacyFeud;
