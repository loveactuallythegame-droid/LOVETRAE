/**
 * Escape from the Echo Chamber - Love Arcade Game
 * A digital escape room where couples break repetitive patterns
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves progress after each puzzle
 * - Completes game and submits final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

// Game Constants
const GAME_ID = 'echo-chamber-escape';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 100;

// Puzzle Data
interface Puzzle {
    id: number;
    title: string;
    description: string;
    hint: string;
    answers: string[];
    marcieSuccess: string;
    marcieFail: string;
}

const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: 'The Administrative Love',
        description: 'Shared Terminal: SYSTEM_SCALE: [?] locations | MANAGEMENT: [?] app\n\nFind the number that represents your shared routine.',
        hint: 'How many locations do you manage together? Think about your shared life admin.',
        answers: ['3', 'three', 'notes', 'admin', 'routine'],
        marcieSuccess: "File 1 Decrypted. It wasn't love, it was administration.",
        marcieFail: "Access Denied. The echo grows louder."
    },
    {
        id: 2,
        title: 'The Soulmate Script',
        description: "Audio Clip: 'You're my soulmate.' (Click the empty box?)\n\nWhat word completes this overused phrase?",
        hint: 'What script are you reading from?',
        answers: ['script', 'box', 'delete', 'romance', 'movie'],
        marcieSuccess: "Soulmate script deleted. Next.",
        marcieFail: "Still reading from the same tired script."
    },
    {
        id: 3,
        title: 'The Death of Routine',
        description: "Obituary: 'Expired due to...'\n\nWhat kills relationships slowly?",
        hint: 'What dies when you stop paying attention?',
        answers: ['neglect', 'routine', 'boredom', 'sameness', 'predictability'],
        marcieSuccess: "Obituary written. Now write a new story.",
        marcieFail: "Can't see what's right in front of you."
    }
];

const EscapeEchoChamber: React.FC = () => {
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
    const [currentStage, setCurrentStage] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const currentPuzzle = PUZZLES[currentStage];

    // Check answer
    const checkAnswer = async () => {
        if (!userInput.trim()) return;

        const normalizedInput = userInput.toLowerCase().trim();
        const isCorrect = currentPuzzle.answers.some(
            answer => normalizedInput.includes(answer.toLowerCase())
        );

        if (isCorrect) {
            // Calculate points (fewer attempts = more points)
            const basePoints = 33;
            const attemptBonus = Math.max(0, (3 - attempts) * 5);
            const puzzleScore = basePoints + attemptBonus;
            
            const newScore = score + puzzleScore;
            setScore(newScore);
            setCompletedPuzzles([...completedPuzzles, currentPuzzle.id]);
            
            // Save to backend
            await updateScore(newScore, false, [
                { 
                    puzzleId: currentPuzzle.id, 
                    solved: true, 
                    attempts: attempts + 1,
                    points: puzzleScore 
                }
            ]);

            // Show success
            Alert.alert(
                'Puzzle Solved! 🔓',
                currentPuzzle.marcieSuccess,
                [
                    { 
                        text: currentStage < PUZZLES.length - 1 ? 'Next Puzzle' : 'Finish', 
                        onPress: () => {
                            if (currentStage < PUZZLES.length - 1) {
                                setCurrentStage(prev => prev + 1);
                                setUserInput('');
                                setAttempts(0);
                                setShowHint(false);
                            } else {
                                finishGame(newScore);
                            }
                        }
                    }
                ]
            );
        } else {
            setAttempts(prev => prev + 1);
            Alert.alert(
                'Incorrect',
                currentPuzzle.marcieFail,
                [{ text: 'Try Again' }]
            );
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        // Calculate badge
        let badge = 'Echo Survivor';
        if (finalScore >= 95) badge = 'Pattern Breaker';
        else if (finalScore >= 85) badge = 'Echo Escapee';
        else if (finalScore >= 70) badge = 'Routine Rebel';

        // Complete in backend
        await completeGame(finalScore, [
            { completed: true, badge, puzzlesSolved: PUZZLES.length }
        ]);

        Alert.alert(
            'Echo Chamber Breached! 🎉',
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}\n\nYou broke the script!`,
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

    // Reset game
    const resetGame = () => {
        setCurrentStage(0);
        setUserInput('');
        setScore(0);
        setAttempts(0);
        setCompletedPuzzles([]);
        setGameCompleted(false);
        setShowHint(false);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Entering the Echo Chamber...</Text>
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
                        <Text style={styles.title}>Escape the Echo Chamber</Text>
                        <Text style={styles.subtitle}>Break the love script</Text>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                Puzzle {currentStage + 1} of {PUZZLES.length}
                            </Text>
                            <View style={styles.scoreRow}>
                                <Text style={styles.scoreText}>Score: {score}</Text>
                                {isSyncing && <Text style={styles.syncText}>💾</Text>}
                            </View>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${((currentStage + 1) / PUZZLES.length) * 100}%` }
                            ]} 
                        />
                    </View>

                    {/* Puzzle Card */}
                    <GlassCard style={styles.puzzleCard}>
                        <Text style={styles.puzzleTitle}>{currentPuzzle?.title}</Text>
                        <Text style={styles.puzzleDescription}>{currentPuzzle?.description}</Text>
                        
                        {attempts > 1 && (
                            <TouchableOpacity 
                                style={styles.hintButton}
                                onPress={() => setShowHint(!showHint)}
                            >
                                <Text style={styles.hintButtonText}>
                                    {showHint ? 'Hide Hint' : 'Need a Hint?'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        
                        {showHint && (
                            <View style={styles.hintBox}>
                                <Text style={styles.hintText}>💡 {currentPuzzle?.hint}</Text>
                            </View>
                        )}
                    </GlassCard>

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter solution..."
                            placeholderTextColor="#9ca3af"
                            value={userInput}
                            onChangeText={setUserInput}
                            onSubmitEditing={checkAnswer}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        
                        <TouchableOpacity 
                            style={[styles.submitButton, !userInput.trim() && styles.disabledButton]}
                            onPress={checkAnswer}
                            disabled={!userInput.trim()}
                        >
                            <Text style={styles.submitText}>Decrypt File</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Attempts Counter */}
                    <Text style={styles.attemptsText}>
                        Attempts: {attempts} {attempts > 0 && '(Fewer attempts = more points!)'}
                    </Text>

                    {/* Reset Button */}
                    <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                        <Text style={styles.resetText}>Start Over</Text>
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
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 5,
        fontStyle: 'italic',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    progressText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        color: '#db147c',
        fontWeight: 'bold',
        fontSize: 16,
    },
    syncText: {
        marginLeft: 5,
        fontSize: 12,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginBottom: 25,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#db147c',
        borderRadius: 2,
    },
    puzzleCard: {
        padding: 20,
        marginBottom: 20,
    },
    puzzleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    puzzleDescription: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 22,
    },
    hintButton: {
        marginTop: 15,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    hintButtonText: {
        color: '#db147c',
        fontSize: 13,
        fontWeight: '600',
    },
    hintBox: {
        marginTop: 15,
        padding: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#FFD700',
    },
    hintText: {
        color: '#FFD700',
        fontSize: 14,
        fontStyle: 'italic',
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#db147c',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    attemptsText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
    resetButton: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    resetText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EscapeEchoChamber;
