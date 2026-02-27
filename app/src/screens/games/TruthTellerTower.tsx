/**
 * Truth Teller Tower - Love Arcade Game
 * A "Who Wants to Be a Millionaire" style game with couple's questions
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves score after each question
 * - Completes game and submits final score
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { useWebSocket } from '../../hooks/useWebSocket';

// Components
import { GlassCard, Text, SquishyButton } from '../../components/ui';

const { width, height } = Dimensions.get('window');

// Game Constants
const GAME_ID = 'truth-teller-tower';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 100;

// Question Bank
const QUESTIONS = [
    {
        id: 1,
        text: "Before rebuilding, you must name the dragon. What's the #1 reason couples fail Phase 1?",
        options: [
            { id: 'A', text: 'They call it "a rough patch."' },
            { id: 'B', text: 'They skip naming the betrayal and jump to "fixing."' },
            { id: 'C', text: 'They let the betrayed partner define it alone.' },
            { id: 'D', text: 'They use clinical jargon to sound smart.' }
        ],
        correct: 'B',
        marcieReason: "If you don't name the monster, it lives in your basement rent-free.",
        value: 10
    },
    {
        id: 2,
        text: "What's the most dangerous phrase in conflict resolution?",
        options: [
            { id: 'A', text: '"I hate you"' },
            { id: 'B', text: '"Calm down"' },
            { id: 'C', text: '"Let\'s talk"' },
            { id: 'D', text: '"You always..."' }
        ],
        correct: 'B',
        marcieReason: '"Calm down" is emotional gasoline. Never works.",
        value: 20
    },
    {
        id: 3,
        text: "According to Gottman, what's the #1 predictor of divorce?",
        options: [
            { id: 'A', text: 'Financial stress' },
            { id: 'B', text: 'Infidelity' },
            { id: 'C', text: 'Contempt' },
            { id: 'D', text: 'Lack of sex' }
        ],
        correct: 'C',
        marcieReason: 'Contempt is relationship poison. Eye rolls kill marriages.',
        value: 30
    },
    {
        id: 4,
        text: "In the aftermath of betrayal, what must happen FIRST?",
        options: [
            { id: 'A', text: 'Forgiveness' },
            { id: 'B', text: 'Transparency' },
            { id: 'C', text: 'Time apart' },
            { id: 'D', text: 'Couples therapy' }
        ],
        correct: 'B',
        marcieReason: 'You can\'t rebuild on quicksand. Transparency first, trust second.',
        value: 25
    },
    {
        id: 5,
        text: "What's the healthiest way to express anger?",
        options: [
            { id: 'A', text: 'Silent treatment' },
            { id: 'B', text: 'Yelling it out' },
            { id: 'C', text: 'Using \"I feel\" statements' },
            { id: 'D', text: 'Passive-aggressive notes' }
        ],
        correct: 'C',
        marcieReason: '"I feel" statements own your emotions without attacking. Revolutionary concept.',
        value: 15
    }
];

// Lifelines
interface Lifelines {
    fiftyFifty: boolean;
    askMarcie: boolean;
    doubleConfidence: boolean;
}

const TruthTellerTower: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { gameId: routeGameId } = route.params as { gameId?: string } || {};
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [qIndex, setQIndex] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [lifelines, setLifelines] = useState<Lifelines>({
        fiftyFifty: true,
        askMarcie: true,
        doubleConfidence: true
    });
    const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
    const [marcieHint, setMarcieHint] = useState<string | null>(null);
    const [partnerResponse, setPartnerResponse] = useState<any>(null);

    // WebSocket for real-time sync
    const { sendMessage, lastMessage } = useWebSocket(
        session?.user_id || null,
        auth.currentUser ? null : null
    );

    // Get current question
    const currentQuestion = QUESTIONS[qIndex];

    // Handle answer selection
    const handleAnswerSelect = (optionId: string) => {
        setMyAnswer(optionId);
    };

    // Handle prediction selection
    const handlePredictionSelect = (optionId: string) => {
        setPrediction(optionId);
    };

    // Use 50:50 lifeline
    const useFiftyFifty = () => {
        if (!lifelines.fiftyFifty || !currentQuestion) return;
        
        const wrongOptions = currentQuestion.options
            .filter(opt => opt.id !== currentQuestion.correct)
            .map(opt => opt.id);
        
        // Randomly eliminate 2 wrong answers
        const toEliminate = wrongOptions
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
        
        setEliminatedOptions(toEliminate);
        setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    };

    // Use Ask Marcie lifeline
    const useAskMarcie = () => {
        if (!lifelines.askMarcie || !currentQuestion) return;
        
        setMarcieHint(currentQuestion.marcieReason);
        setLifelines(prev => ({ ...prev, askMarcie: false }));
    };

    // Use Double Confidence lifeline
    const useDoubleConfidence = () => {
        if (!lifelines.doubleConfidence) return;
        setLifelines(prev => ({ ...prev, doubleConfidence: false }));
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!myAnswer || !prediction || !currentQuestion) return;

        let roundPoints = 0;
        
        // Points for correct answer
        if (myAnswer === currentQuestion.correct) {
            roundPoints += currentQuestion.value;
        }
        
        // Points for predicting partner's answer correctly
        if (prediction === currentQuestion.correct) {
            roundPoints += Math.round(currentQuestion.value / 2);
        }
        
        // Double confidence bonus
        if (!lifelines.doubleConfidence && myAnswer === currentQuestion.correct) {
            roundPoints *= 2;
        }

        const newScore = score + roundPoints;
        setScore(newScore);

        // Save progress to backend
        await updateScore(newScore, false, [
            { 
                questionId: currentQuestion.id, 
                myAnswer, 
                prediction, 
                correct: currentQuestion.correct,
                points: roundPoints 
            }
        ]);

        // Move to next question or finish
        if (qIndex < QUESTIONS.length - 1) {
            setQIndex(prev => prev + 1);
            setMyAnswer(null);
            setPrediction(null);
            setEliminatedOptions([]);
            setMarcieHint(null);
        } else {
            finishGame(newScore);
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        // Calculate badge
        let badge = 'Truth Adjacent';
        if (finalScore >= 90) badge = 'The Unfiltered Signal';
        else if (finalScore >= 70) badge = 'Honesty Amplifier';
        else if (finalScore >= 50) badge = 'Reality Checker';

        // Complete game in backend
        await completeGame(finalScore, [
            { completed: true, badge, totalQuestions: QUESTIONS.length }
        ]);

        Alert.alert(
            "Tower Scaled! 🏆",
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}`,
            [
                { 
                    text: "View Results", 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: finalScore, 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: "Play Again", onPress: () => resetGame() }
            ]
        );
    };

    // Reset game
    const resetGame = () => {
        setQIndex(0);
        setMyAnswer(null);
        setPrediction(null);
        setScore(0);
        setGameCompleted(false);
        setLifelines({
            fiftyFifty: true,
            askMarcie: true,
            doubleConfidence: true
        });
        setEliminatedOptions([]);
        setMarcieHint(null);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Preparing Truth Teller Tower...</Text>
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
                        <Text style={styles.title}>Truth Teller Tower</Text>
                        <Text style={styles.subtitle}>Round {qIndex + 1} of {QUESTIONS.length}</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>Score: {score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                    </View>

                    {/* Question */}
                    <GlassCard style={styles.questionCard}>
                        <Text style={styles.questionText}>{currentQuestion?.text}</Text>
                        {marcieHint && (
                            <View style={styles.marcieHint}>
                                <Text style={styles.marcieText}>💡 {marcieHint}</Text>
                            </View>
                        )}
                    </GlassCard>

                    {/* Your Answer Section */}
                    <Text style={styles.sectionTitle}>Your Answer:</Text>
                    <View style={styles.optionsContainer}>
                        {currentQuestion?.options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionButton,
                                    myAnswer === option.id && styles.selectedOption,
                                    eliminatedOptions.includes(option.id) && styles.eliminatedOption
                                ]}
                                onPress={() => handleAnswerSelect(option.id)}
                                disabled={eliminatedOptions.includes(option.id)}
                            >
                                <Text style={styles.optionLabel}>{option.id}:</Text>
                                <Text style={styles.optionText}>{option.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Predict Partner Section */}
                    <Text style={styles.sectionTitle}>Predict Your Partner's Answer:</Text>
                    <View style={styles.optionsContainer}>
                        {currentQuestion?.options.map((option) => (
                            <TouchableOpacity
                                key={`pred-${option.id}`}
                                style={[
                                    styles.predictionButton,
                                    prediction === option.id && styles.selectedPrediction
                                ]}
                                onPress={() => handlePredictionSelect(option.id)}
                            >
                                <Text style={styles.optionLabel}>{option.id}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Lifelines */}
                    <View style={styles.lifelinesContainer}>
                        <TouchableOpacity
                            style={[styles.lifelineButton, !lifelines.fiftyFifty && styles.usedLifeline]}
                            onPress={useFiftyFifty}
                            disabled={!lifelines.fiftyFifty}
                        >
                            <Text style={styles.lifelineText}>50:50</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.lifelineButton, !lifelines.askMarcie && styles.usedLifeline]}
                            onPress={useAskMarcie}
                            disabled={!lifelines.askMarcie}
                        >
                            <Text style={styles.lifelineText}>Ask Marcie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.lifelineButton, !lifelines.doubleConfidence && styles.usedLifeline]}
                            onPress={useDoubleConfidence}
                            disabled={!lifelines.doubleConfidence}
                        >
                            <Text style={styles.lifelineText}>2x Points</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!myAnswer || !prediction) && styles.disabledButton]}
                        onPress={submitAnswer}
                        disabled={!myAnswer || !prediction}
                    >
                        <Text style={styles.submitText}>
                            {qIndex < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Game'}
                        </Text>
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
    scoreContainer: {
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
        marginBottom: 20,
        padding: 20,
    },
    questionText: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 24,
    },
    marcieHint: {
        marginTop: 15,
        padding: 12,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#db147c',
    },
    marcieText: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 10,
        fontWeight: '600',
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
    eliminatedOption: {
        opacity: 0.3,
    },
    optionLabel: {
        color: '#db147c',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    predictionButton: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPrediction: {
        borderColor: '#33DEA5',
        backgroundColor: 'rgba(51, 222, 165, 0.2)',
    },
    lifelinesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    lifelineButton: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#db147c',
    },
    usedLifeline: {
        opacity: 0.3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    lifelineText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    submitButton: {
        backgroundColor: '#db147c',
        paddingVertical: 15,
        borderRadius: 25,
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

export default TruthTellerTower;