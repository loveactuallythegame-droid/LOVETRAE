/**
 * Newlywed Game - Game Show Category
 * Couples predict each other's answers to intimate questions
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks predictions and matches
 * - Completes game with sync score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

// Game Constants
const GAME_ID = 'newlywed-game';
const CATEGORY_ID = 'game-show';
const MAX_SCORE = 300;

// Question Rounds
interface Option {
    id: string;
    text: string;
}

interface Round {
    question: string;
    options: Option[];
}

const ROUNDS: Round[] = [
    {
        question: "When your partner thinks about your relationship challenges, which causes more stress right now?",
        options: [
            { id: 'A', text: "Communication issues" },
            { id: 'B', text: "Time/Schedule conflicts" },
            { id: 'C', text: "External stress (work/family)" },
            { id: 'D', text: "Intimacy/Connection" }
        ]
    },
    {
        question: "Finish this sentence from your partner's perspective: 'What makes me feel most loved is...'",
        options: [
            { id: 'A', text: "Physical affection" },
            { id: 'B', text: "Quality time together" },
            { id: 'C', text: "Words of affirmation" },
            { id: 'D', text: "Acts of service" }
        ]
    },
    {
        question: "What's your partner's biggest fear about your future together?",
        options: [
            { id: 'A', text: "Growing apart over time" },
            { id: 'B', text: "Financial struggles" },
            { id: 'C', text: "Losing the spark/passion" },
            { id: 'D', text: "Not achieving shared goals" }
        ]
    }
];

const NewlywedGame: React.FC = () => {
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
    const [round, setRound] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const currentRound = ROUNDS[round];

    // Submit answers
    const submit = async () => {
        if (!myAnswer || !prediction) {
            Alert.alert("Required", "Please answer for yourself AND predict your partner's answer.");
            return;
        }

        const isMatch = myAnswer === prediction;
        const roundScore = isMatch ? 100 : 50;
        const newScore = score + roundScore;
        setScore(newScore);
        
        if (isMatch) {
            setMatches(prev => prev + 1);
        }

        // Save to backend
        await updateScore(newScore, false, [{
            round: round + 1,
            myAnswer,
            prediction,
            match: isMatch,
            roundScore
        }]);

        const feedback = isMatch 
            ? "💕 Perfect Match! You're in sync!" 
            : "🤔 Good try! Keep learning about each other.";

        Alert.alert(
            `Round ${round + 1} Complete`,
            `${feedback}\n\n+${roundScore} points`,
            [
                {
                    text: round < ROUNDS.length - 1 ? 'Next Question' : 'Finish',
                    onPress: () => {
                        if (round < ROUNDS.length - 1) {
                            setRound(prev => prev + 1);
                            setMyAnswer(null);
                            setPrediction(null);
                        } else {
                            finishGame(newScore);
                        }
                    }
                }
            ]
        );
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Strangers';
        if (matches === 3) badge = 'Soulmates';
        else if (matches === 2) badge = 'In Sync';
        else if (matches === 1) badge = 'Getting There';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            matches,
            totalRounds: ROUNDS.length
        }]);

        Alert.alert(
            'Heart Sync Complete! 💕',
            `Final Score: ${finalScore}/${MAX_SCORE}\nMatches: ${matches}/${ROUNDS.length}\nBadge: ${badge}`,
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
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Loading Questions...</Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>The Newlywed Game</Text>
                        <Text style={styles.subtitle}>How well do you know each other?</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>Score: {score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                        <Text style={styles.roundText}>
                            Question {round + 1} of {ROUNDS.length} • Matches: {matches}
                        </Text>
                    </View>

                    {/* Question Card */}
                    <GlassCard style={styles.questionCard}>
                        <Text style={styles.questionText}>{currentRound.question}</Text>
                    </GlassCard>

                    {/* Your Answer */}
                    <Text style={styles.sectionTitle}>Your Answer:</Text>
                    <View style={styles.optionsContainer}>
                        {currentRound.options.map((option) => (
                            <TouchableOpacity
                                key={`my-${option.id}`}
                                style={[
                                    styles.optionButton,
                                    myAnswer === option.id && styles.selectedOption
                                ]}
                                onPress={() => setMyAnswer(option.id)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    myAnswer === option.id && styles.selectedText
                                ]}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Your Prediction */}
                    <Text style={styles.sectionTitle}>Predict Your Partner's Answer:</Text>
                    <View style={styles.optionsContainer}>
                        {currentRound.options.map((option) => (
                            <TouchableOpacity
                                key={`pred-${option.id}`}
                                style={[
                                    styles.predictionButton,
                                    prediction === option.id && styles.selectedPrediction
                                ]}
                                onPress={() => setPrediction(option.id)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    prediction === option.id && styles.selectedText
                                ]}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!myAnswer || !prediction) && styles.disabledButton]}
                        onPress={submit}
                        disabled={!myAnswer || !prediction}
                    >
                        <Text style={styles.submitText}>Reveal Match</Text>
                    </TouchableOpacity>

                    {/* Session Info */}
                    {session && (
                        <Text style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Text>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
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
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 10,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    roundText: {
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
    questionCard: {
        padding: 20,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 26,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#FFD700',
        marginBottom: 12,
        fontWeight: '600',
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: '#db147c',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
    },
    predictionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPrediction: {
        borderColor: '#33DEA5',
        backgroundColor: 'rgba(51, 222, 165, 0.2)',
    },
    optionText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#db147c',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default NewlywedGame;
