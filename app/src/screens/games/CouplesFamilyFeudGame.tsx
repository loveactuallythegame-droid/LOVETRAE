/**
 * Couples Family Feud - Game Show Category
 * Survey-style game where couples guess top answers
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks revealed answers and strikes
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Game Constants
const GAME_ID = 'family-feud-couples';
const CATEGORY_ID = 'game-show';

// Survey Data
interface SurveyAnswer {
    text: string;
    points: number;
    revealed: boolean;
}

interface SurveyQuestion {
    question: string;
    answers: SurveyAnswer[];
}

const SURVEY_DATA: SurveyQuestion[] = [
    {
        question: "What's the most annoying thing your partner does?",
        answers: [
            { text: "Leaves towels on the floor", points: 42, revealed: false },
            { text: "Snores loudly", points: 28, revealed: false },
            { text: "Forgets important dates", points: 15, revealed: false },
            { text: "Takes too long to get ready", points: 10, revealed: false },
            { text: "Doesn't replace toilet paper", points: 5, revealed: false }
        ]
    },
    {
        question: "What's your partner's favorite thing about you?",
        answers: [
            { text: "Sense of humor", points: 35, revealed: false },
            { text: "Kindness", points: 25, revealed: false },
            { text: "Physical appearance", points: 20, revealed: false },
            { text: "Intelligence", points: 15, revealed: false },
            { text: "Cooking skills", points: 5, revealed: false }
        ]
    },
    {
        question: "Name something couples fight about most",
        answers: [
            { text: "Money/Finances", points: 45, revealed: false },
            { text: "Household chores", points: 25, revealed: false },
            { text: "Time spent together", points: 15, revealed: false },
            { text: "In-laws/Family", points: 10, revealed: false },
            { text: "Social media/Phone use", points: 5, revealed: false }
        ]
    }
];

const CouplesFamilyFeudGame: React.FC = () => {
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
    const [currentRound, setCurrentRound] = useState(0);
    const [survey, setSurvey] = useState<SurveyQuestion>(SURVEY_DATA[0]);
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [userGuess, setUserGuess] = useState('');
    const [revealedCount, setRevealedCount] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Submit guess
    const submitGuess = async () => {
        if (!userGuess.trim()) return;

        const normalizedGuess = userGuess.toLowerCase().trim();
        
        // Find matching answer
        const matchIndex = survey.answers.findIndex(ans => 
            ans.text.toLowerCase().includes(normalizedGuess) ||
            normalizedGuess.includes(ans.text.toLowerCase())
        );

        if (matchIndex !== -1 && !survey.answers[matchIndex].revealed) {
            // Correct guess
            const newAnswers = [...survey.answers];
            newAnswers[matchIndex].revealed = true;
            setSurvey({ ...survey, answers: newAnswers });
            
            const points = survey.answers[matchIndex].points;
            const newScore = score + points;
            setScore(newScore);
            setRevealedCount(prev => prev + 1);

            await updateScore(newScore, false, [{
                round: currentRound + 1,
                guess: survey.answers[matchIndex].text,
                points
            }]);

            Alert.alert(
                'Survey Says...',
                `#${matchIndex + 1} Answer! +${points} points`,
                [{ text: 'Great!' }]
            );

            // Check if all answers revealed
            if (revealedCount + 1 >= survey.answers.length) {
                setTimeout(() => nextRound(), 1000);
            }
        } else {
            // Wrong guess - add strike
            const newStrikes = strikes + 1;
            setStrikes(newStrikes);

            if (newStrikes >= 3) {
                Alert.alert(
                    'Three Strikes!',
                    'Moving to next question...',
                    [{ text: 'OK', onPress: () => nextRound() }]
                );
            } else {
                Alert.alert(
                    'Survey Says...',
                    `❌ Not on the board! ${3 - newStrikes} strikes remaining.`,
                    [{ text: 'Try Again' }]
                );
            }
        }

        setUserGuess('');
    };

    // Next round
    const nextRound = () => {
        if (currentRound < SURVEY_DATA.length - 1) {
            const nextRoundIndex = currentRound + 1;
            setCurrentRound(nextRoundIndex);
            setSurvey(SURVEY_DATA[nextRoundIndex]);
            setStrikes(0);
            setRevealedCount(0);
        } else {
            finishGame();
        }
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        let badge = 'Survey Participant';
        if (score >= 200) badge = 'Survey Champion';
        else if (score >= 150) badge = 'Top Answer';
        else if (score >= 100) badge = 'Good Guess';

        await completeGame(score, [{
            completed: true,
            badge,
            roundsCompleted: SURVEY_DATA.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: ${score}\nBadge: ${badge}`,
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
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#120a12', '#2d1b2e']} style={styles.background}>
                    <Text style={styles.loadingText}>Loading Survey...</Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120a12', '#2d1b2e']} style={styles.background} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Couples Family Feud</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreText}>Score: {score}</Text>
                        {isSyncing && <Text style={styles.syncText}>💾</Text>}
                    </View>
                    <Text style={styles.roundText}>Round {currentRound + 1} of {SURVEY_DATA.length}</Text>
                </View>

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

                {/* Question */}
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{survey.question}</Text>
                </View>

                {/* Answer Board */}
                <LinearGradient
                    colors={['#ff7600', '#ffef1f']}
                    style={styles.board}
                >
                    {survey.answers.map((answer, index) => (
                        <View key={index} style={styles.answerRow}>
                            <Text style={styles.answerRank}>{index + 1}</Text>
                            {answer.revealed ? (
                                <>
                                    <Text style={styles.answerText}>{answer.text}</Text>
                                    <Text style={styles.answerPoints}>{answer.points}</Text>
                                </>
                            ) : (
                                <View style={styles.hiddenAnswer}>
                                    <Text style={styles.hiddenText}>???</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </LinearGradient>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Your Guess..." 
                        placeholderTextColor="#777"
                        value={userGuess}
                        onChangeText={setUserGuess}
                        onSubmitEditing={submitGuess}
                    />
                    <TouchableOpacity 
                        style={[styles.submitButton, !userGuess.trim() && styles.disabledButton]}
                        onPress={submitGuess}
                        disabled={!userGuess.trim()}
                    >
                        <Text style={styles.submitButtonText}>SURVEY SAYS!</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <Text style={styles.progressText}>
                    {revealedCount} of {survey.answers.length} answers revealed
                </Text>

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
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    roundText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        marginTop: 5,
    },
    loadingText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 100,
    },
    strikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    strikesLabel: {
        color: '#fff',
        fontSize: 18,
        marginRight: 15,
        fontWeight: 'bold',
    },
    strikesRow: {
        flexDirection: 'row',
        gap: 10,
    },
    strike: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
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
        fontSize: 20,
    },
    questionContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#ff7600',
    },
    questionText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    board: {
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    answerRank: {
        width: 30,
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 18,
    },
    answerText: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    answerPoints: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 16,
    },
    hiddenAnswer: {
        flex: 1,
        alignItems: 'center',
    },
    hiddenText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    submitButton: {
        backgroundColor: '#ff7600',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CouplesFamilyFeudGame;
