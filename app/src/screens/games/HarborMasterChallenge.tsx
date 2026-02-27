/**
 * Harbor Master's Challenge - Love Arcade Game
 * BPD/Emotional Regulation focused cooperative game
 * Couples learn to navigate emotional storms together
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks alignment choices
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

// Game Constants
const GAME_ID = 'harbor-storm';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 400;

// Scenarios
interface Choice {
    id: string;
    text: string;
    healthy: boolean;
    points: number;
}

interface Scenario {
    id: number;
    title: string;
    desc: string;
    partner1Choice: string;
    partner2Choice: string;
    choices: Choice[];
    lesson: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        title: "The Job Loss Storm",
        desc: "A major stressor hits (job loss). The storm clouds gather. Partner 1 is triggered and dysregulated.",
        partner1Choice: "SSP (Storm-Sensitive Partner) Response:",
        partner2Choice: "SHP (Storm-Helping Partner) Response:",
        choices: [
            { id: 'A', text: "Use TIPP skills (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation)", healthy: true, points: 100 },
            { id: 'B', text: "Withdraw and isolate", healthy: false, points: 20 },
            { id: 'C', text: "Blame external circumstances", healthy: false, points: 30 },
            { id: 'D', text: "Ask for a 20-minute break to self-regulate", healthy: true, points: 90 }
        ],
        lesson: "Co-regulation requires one partner to stay anchored while the other regulates."
    },
    {
        id: 2,
        title: "The Abandonment Trigger",
        desc: "Partner seems distant. Old wounds of abandonment surface. The emotional waves are rising.",
        partner1Choice: "SSP Response:",
        partner2Choice: "SHP Response:",
        choices: [
            { id: 'A', text: "Check the facts before reacting", healthy: true, points: 100 },
            { id: 'B', text: "Accuse and demand reassurance", healthy: false, points: 10 },
            { id: 'C', text: "Validate: 'I see you're hurting'", healthy: true, points: 95 },
            { id: 'D', text: "Get defensive and withdraw", healthy: false, points: 15 }
        ],
        lesson: "Validation doesn't mean agreement. It means 'I see you.'"
    },
    {
        id: 3,
        title: "The Shame Spiral",
        desc: "A mistake was made. Shame threatens to capsize the relationship boat.",
        partner1Choice: "SSP Response:",
        partner2Choice: "SHP Response:",
        choices: [
            { id: 'A', text: "Radical acceptance of the mistake", healthy: true, points: 100 },
            { id: 'B', text: "Self-punishment and rumination", healthy: false, points: 20 },
            { id: 'C', text: "Offer repair without defensiveness", healthy: true, points: 90 },
            { id: 'D', text: "Minimize or deflect", healthy: false, points: 25 }
        ],
        lesson: "Shame can't survive empathy. Repair requires both partners."
    }
];

const HarborMasterChallenge: React.FC = () => {
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
    const [round, setRound] = useState(0);
    const [p1Choice, setP1] = useState<string | null>(null);
    const [p2Choice, setP2] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const currentScenario = SCENARIOS[round];

    // Calculate alignment
    const calculateAlignment = () => {
        if (!p1Choice || !p2Choice) return { score: 0, message: '' };

        const choice1 = currentScenario.choices.find(c => c.id === p1Choice);
        const choice2 = currentScenario.choices.find(c => c.id === p2Choice);

        let roundScore = (choice1?.points || 0) + (choice2?.points || 0);
        let message = '';

        if (choice1?.healthy && choice2?.healthy) {
            roundScore += 100; // Co-regulation bonus
            message = "Perfect alignment! You're sailing together.";
        } else if (choice1?.healthy || choice2?.healthy) {
            roundScore += 50; // One partner anchored
            message = "Good! One partner stayed regulated.";
        } else {
            message = "Stormy seas. Both partners need regulation.";
        }

        return { score: roundScore, message };
    };

    // Reveal choices
    const revealChoices = async () => {
        if (!p1Choice || !p2Choice) {
            Alert.alert("Required", "Both partners must choose a response.");
            return;
        }

        setShowResults(true);
        const { score: roundScore, message } = calculateAlignment();
        const newScore = score + roundScore;
        setScore(newScore);

        // Save to backend
        await updateScore(newScore, false, [{
            scenario: currentScenario.id,
            p1Choice,
            p2Choice,
            roundScore,
            alignment: message
        }]);

        Alert.alert(
            `Scenario ${round + 1} Results`,
            `${message}\n\nRound Score: ${roundScore} points`,
            [
                {
                    text: round < SCENARIOS.length - 1 ? 'Next Scenario' : 'Finish',
                    onPress: () => {
                        if (round < SCENARIOS.length - 1) {
                            setRound(prev => prev + 1);
                            setP1(null);
                            setP2(null);
                            setShowResults(false);
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
        
        let badge = 'Deckhand';
        if (finalScore >= 1000) badge = 'Harbor Master';
        else if (finalScore >= 750) badge = 'First Mate';
        else if (finalScore >= 500) badge = 'Able Seaman';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            scenariosCompleted: SCENARIOS.length
        }]);

        Alert.alert(
            'Harbor Secure! ⚓',
            `Final Score: ${finalScore}/${MAX_SCORE * SCENARIOS.length}\nBadge: ${badge}\n\nYou've earned the Golden Compass!`,
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

    // Get choice details
    const getChoiceDetails = (choiceId: string) => {
        return currentScenario.choices.find(c => c.id === choiceId);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Entering the Harbor...</Text>
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
                        <Text style={styles.title}>Harbor Master's Challenge</Text>
                        <Text style={styles.subtitle}>Navigate emotional storms together</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>Score: {score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                        <Text style={styles.roundText}>
                            Scenario {round + 1} of {SCENARIOS.length}
                        </Text>
                    </View>

                    {/* Scenario Card */}
                    <GlassCard style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
                        <Text style={styles.scenarioDesc}>{currentScenario.desc}</Text>
                    </GlassCard>

                    {/* Partner 1 Choices */}
                    <Text style={styles.sectionTitle}>🌊 {currentScenario.partner1Choice}</Text>
                    <View style={styles.choicesContainer}>
                        {currentScenario.choices.map((choice) => (
                            <TouchableOpacity
                                key={`p1-${choice.id}`}
                                style={[
                                    styles.choiceButton,
                                    p1Choice === choice.id && styles.selectedChoice,
                                    showResults && getChoiceDetails(p1Choice || '')?.healthy && p1Choice === choice.id && styles.healthyChoice,
                                    showResults && !getChoiceDetails(p1Choice || '')?.healthy && p1Choice === choice.id && styles.unhealthyChoice
                                ]}
                                onPress={() => !showResults && setP1(choice.id)}
                                disabled={showResults}
                            >
                                <Text style={[
                                    styles.choiceText,
                                    p1Choice === choice.id && styles.selectedText
                                ]}>
                                    {choice.text}
                                </Text>
                                {showResults && p1Choice === choice.id && (
                                    <Text style={styles.pointsBadge}>+{choice.points}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Partner 2 Choices */}
                    <Text style={styles.sectionTitle}>⚓ {currentScenario.partner2Choice}</Text>
                    <View style={styles.choicesContainer}>
                        {currentScenario.choices.map((choice) => (
                            <TouchableOpacity
                                key={`p2-${choice.id}`}
                                style={[
                                    styles.choiceButton,
                                    p2Choice === choice.id && styles.selectedChoice,
                                    showResults && getChoiceDetails(p2Choice || '')?.healthy && p2Choice === choice.id && styles.healthyChoice,
                                    showResults && !getChoiceDetails(p2Choice || '')?.healthy && p2Choice === choice.id && styles.unhealthyChoice
                                ]}
                                onPress={() => !showResults && setP2(choice.id)}
                                disabled={showResults}
                            >
                                <Text style={[
                                    styles.choiceText,
                                    p2Choice === choice.id && styles.selectedText
                                ]}>
                                    {choice.text}
                                </Text>
                                {showResults && p2Choice === choice.id && (
                                    <Text style={styles.pointsBadge}>+{choice.points}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Alignment Meter */}
                    {showResults && (
                        <GlassCard style={styles.resultCard}>
                            <Text style={styles.lessonTitle}>💡 Lesson:</Text>
                            <Text style={styles.lessonText}>{currentScenario.lesson}</Text>
                        </GlassCard>
                    )}

                    {/* Submit Button */}
                    {!showResults && (
                        <TouchableOpacity
                            style={[styles.submitButton, (!p1Choice || !p2Choice) && styles.disabledButton]}
                            onPress={revealChoices}
                            disabled={!p1Choice || !p2Choice}
                        >
                            <Text style={styles.submitText}>Reveal Choices</Text>
                        </TouchableOpacity>
                    )}

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
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    scoreText: {
        fontSize: 20,
        color: '#22d3ee',
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
    scenarioCard: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderColor: '#22d3ee',
        borderWidth: 1,
    },
    scenarioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#22d3ee',
        marginBottom: 10,
    },
    scenarioDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 12,
        fontWeight: '600',
    },
    choicesContainer: {
        marginBottom: 20,
    },
    choiceButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedChoice: {
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
    },
    healthyChoice: {
        borderColor: '#33DEA5',
        backgroundColor: 'rgba(51, 222, 165, 0.2)',
    },
    unhealthyChoice: {
        borderColor: '#ff4444',
        backgroundColor: 'rgba(255, 68, 68, 0.2)',
    },
    choiceText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    pointsBadge: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#FFD700',
        color: '#000',
        padding: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
    },
    resultCard: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    lessonTitle: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    lessonText: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: '#22d3ee',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitText: {
        color: '#000',
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

export default HarborMasterChallenge;
