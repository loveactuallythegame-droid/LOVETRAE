/**
 * Chopped: Family Forge Edition - Love Arcade Game
 * Based on Chopped cooking show - couples craft responses to family challenges
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks ingredient selections
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

// Game Constants
const GAME_ID = 'family-forge';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 500;

// Challenge Baskets
interface Ingredient {
    id: string;
    text: string;
    points: number;
}

interface Basket {
    name: string;
    scenario: string;
    baseIngredients: Ingredient[];
    seasoningIngredients: Ingredient[];
}

const BASKETS: Basket[] = [
    {
        name: "The Sleep Training Standoff",
        scenario: "Disagreement on sleep training + Resentment + Exhaustion",
        baseIngredients: [
            { id: 'A', text: "Let's research together tonight.", points: 100 },
            { id: 'B', text: "I'll take tonight. You decide tomorrow.", points: 80 },
            { id: 'C', text: "Can we table this and just hold each other?", points: 60 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Hand on arm: 'I trust your instinct.'", points: 100 },
            { id: 'B', text: "Let's ask pediatrician — no blame.", points: 80 },
            { id: 'C', text: "Laugh: 'Remember when we thought this would be hard?'", points: 60 }
        ]
    },
    {
        name: "The In-Law Invasion",
        scenario: "Unsolicited advice + Holiday stress + Different traditions",
        baseIngredients: [
            { id: 'A', text: "We present a united front, then discuss privately.", points: 100 },
            { id: 'B', text: "You handle your parents, I'll handle mine.", points: 70 },
            { id: 'C', text: "Let's create our own holiday ritual.", points: 90 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Thank them, then do what works for us.", points: 80 },
            { id: 'B', text: "Humor: 'We're still figuring it out too!'", points: 100 },
            { id: 'C', text: "Validate: 'They mean well, but...'", points: 60 }
        ]
    },
    {
        name: "The Discipline Divide",
        scenario: "Different parenting styles + Child pushing boundaries + Tired",
        baseIngredients: [
            { id: 'A', text: "Let's discuss our non-negotiables.", points: 100 },
            { id: 'B', text: "Tag team: I'll step in when you need a break.", points: 90 },
            { id: 'C', text: "Consistency first, perfection never.", points: 80 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Lower voice, not standards.", points: 100 },
            { id: 'B', text: "Model the behavior we want.", points: 90 },
            { id: 'C', text: "Repair after rupture.", points: 80 }
        ]
    }
];

const ChoppedFamily: React.FC = () => {
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
    const [baseChoice, setBaseChoice] = useState<string | null>(null);
    const [seasoningChoice, setSeasoningChoice] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [completedRounds, setCompletedRounds] = useState(0);

    const currentBasket = BASKETS[round];

    // Calculate round score
    const calculateRoundScore = () => {
        if (!baseChoice || !seasoningChoice) return 0;
        
        const basePoints = currentBasket.baseIngredients.find(b => b.id === baseChoice)?.points || 0;
        const seasoningPoints = currentBasket.seasoningIngredients.find(s => s.id === seasoningChoice)?.points || 0;
        
        // Bonus for synergistic pairing
        let synergyBonus = 0;
        if (baseChoice === seasoningChoice) {
            synergyBonus = 50; // Aligned choices
        }
        
        return basePoints + seasoningPoints + synergyBonus;
    };

    // Submit dish
    const submitDish = async () => {
        if (!baseChoice || !seasoningChoice) {
            Alert.alert("Incomplete Dish", "Select both a Base and a Seasoning!");
            return;
        }

        const roundScore = calculateRoundScore();
        const newScore = score + roundScore;
        setScore(newScore);
        setCompletedRounds(prev => prev + 1);

        // Save to backend
        await updateScore(newScore, false, [{
            round: round + 1,
            basket: currentBasket.name,
            base: baseChoice,
            seasoning: seasoningChoice,
            roundScore
        }]);

        // Show feedback
        let feedback = "Good effort!";
        if (roundScore >= 250) feedback = "Five-Star Response! Standing ovation!";
        else if (roundScore >= 200) feedback = "Chef's kiss! Beautifully balanced.";
        else if (roundScore >= 150) feedback = "Solid dish. Room for growth.";

        Alert.alert(
            `Round ${round + 1} Complete!`,
            `${feedback}\n\nScore: ${roundScore} points`,
            [
                {
                    text: round < BASKETS.length - 1 ? 'Next Round' : 'Finish',
                    onPress: () => {
                        if (round < BASKETS.length - 1) {
                            setRound(prev => prev + 1);
                            setBaseChoice(null);
                            setSeasoningChoice(null);
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
        
        let badge = 'Line Cook';
        if (finalScore >= 1200) badge = 'Master Chef';
        else if (finalScore >= 900) badge = 'Sous Chef';
        else if (finalScore >= 600) badge = 'Home Cook';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            roundsCompleted: BASKETS.length
        }]);

        Alert.alert(
            'Kitchen Closed! 👨‍🍳',
            `Final Score: ${finalScore}/${MAX_SCORE * BASKETS.length}\nBadge: ${badge}`,
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
                    <Text style={styles.loadingText}>Preparing the Kitchen...</Text>
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
                        <Text style={styles.title}>Chopped: Family Forge</Text>
                        <Text style={styles.subtitle}>Cook the perfect response</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>Score: {score}</Text>
                            {isSyncing && <Text style={styles.syncText}>💾</Text>}
                        </View>
                        <Text style={styles.roundText}>
                            Round {round + 1} of {BASKETS.length}
                        </Text>
                    </View>

                    {/* Basket Card */}
                    <GlassCard style={styles.basketCard}>
                        <View style={styles.basketHeader}>
                            <Text style={styles.basketEmoji}>🧺</Text>
                            <Text style={styles.basketName}>{currentBasket.name}</Text>
                        </View>
                        <Text style={styles.scenario}>{currentBasket.scenario}</Text>
                    </GlassCard>

                    {/* Base Ingredients */}
                    <Text style={styles.sectionTitle}>Base (Core Action):</Text>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.baseIngredients.map((ingredient) => (
                            <TouchableOpacity
                                key={`base-${ingredient.id}`}
                                style={[
                                    styles.ingredientButton,
                                    baseChoice === ingredient.id && styles.selectedIngredient
                                ]}
                                onPress={() => setBaseChoice(ingredient.id)}
                            >
                                <Text style={[
                                    styles.ingredientText,
                                    baseChoice === ingredient.id && styles.selectedText
                                ]}>
                                    {ingredient.text}
                                </Text>
                                <Text style={styles.pointsText}>+{ingredient.points} pts</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Seasoning Ingredients */}
                    <Text style={styles.sectionTitle}>Seasoning (Tone/Delivery):</Text>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.seasoningIngredients.map((ingredient) => (
                            <TouchableOpacity
                                key={`season-${ingredient.id}`}
                                style={[
                                    styles.ingredientButton,
                                    seasoningChoice === ingredient.id && styles.selectedSeasoning
                                ]}
                                onPress={() => setSeasoningChoice(ingredient.id)}
                            >
                                <Text style={[
                                    styles.ingredientText,
                                    seasoningChoice === ingredient.id && styles.selectedText
                                ]}>
                                    {ingredient.text}
                                </Text>
                                <Text style={styles.pointsText}>+{ingredient.points} pts</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Preview */}
                    {baseChoice && seasoningChoice && (
                        <GlassCard style={styles.previewCard}>
                            <Text style={styles.previewTitle}>Your Dish Preview:</Text>
                            <Text style={styles.previewText}>
                                {currentBasket.baseIngredients.find(b => b.id === baseChoice)?.text}
                            </Text>
                            <Text style={styles.previewPlus}>+</Text>
                            <Text style={styles.previewText}>
                                {currentBasket.seasoningIngredients.find(s => s.id === seasoningChoice)?.text}
                            </Text>
                            <Text style={styles.previewScore}>
                                Estimated: {calculateRoundScore()} points
                            </Text>
                        </GlassCard>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!baseChoice || !seasoningChoice) && styles.disabledButton]}
                        onPress={submitDish}
                        disabled={!baseChoice || !seasoningChoice}
                    >
                        <Text style={styles.submitText}>
                            {round < BASKETS.length - 1 ? 'Plate the Dish' : 'Complete Service'}
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
    basketCard: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(139, 69, 19, 0.3)',
        borderColor: '#8B4513',
        borderWidth: 2,
    },
    basketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    basketEmoji: {
        fontSize: 30,
        marginRight: 10,
    },
    basketName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    scenario: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#FFD700',
        marginBottom: 12,
        fontWeight: '600',
    },
    ingredientsContainer: {
        marginBottom: 20,
    },
    ingredientButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedIngredient: {
        borderColor: '#db147c',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
    },
    selectedSeasoning: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
    ingredientText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 4,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    pointsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    previewCard: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: 'rgba(51, 222, 165, 0.1)',
    },
    previewTitle: {
        color: '#33DEA5',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    previewText: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic',
    },
    previewPlus: {
        color: '#33DEA5',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 5,
    },
    previewScore: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#8B4513',
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

export default ChoppedFamily;
