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
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

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
            <ScreenLayout showHeader={false} scrollable={true}>
                    <Typography variant="h1" center style={styles.loadingText}>The Love Arcade</Typography>
                <Typography variant="body" center>Preparing the Kitchen...</Typography>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                    <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

                    {/* Header */}
                    <View style={styles.header}>
                        <Typography variant="h2" center>Chopped: Family Forge</Typography>
                        <Typography variant="body" center style={styles.subtitleText}>Cook the perfect response</Typography>
                        <View style={styles.scoreRow}>
                            <Typography variant="caption" style={styles.scoreText}>Score: {score}</Typography>
                            {isSyncing && <Typography variant="caption">💾</Typography>}
                        </View>
                        <Typography variant="caption" center style={styles.roundText}>
                            Round {round + 1} of {BASKETS.length}
                        </Typography>
                    </View>

                    {/* Basket Card */}
                    <GlassCard style={styles.basketCard}>
                        <View style={styles.basketHeader}>
                            <Typography variant="h2" style={styles.basketEmoji}>🧺</Typography>
                            <Typography variant="h3">{currentBasket.name}</Typography>
                        </View>
                        <Typography variant="body" style={styles.scenario}>{currentBasket.scenario}</Typography>
                    </GlassCard>

                    {/* Base Ingredients */}
                    <Typography variant="label" style={styles.sectionTitle}>Base (Core Action):</Typography>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.baseIngredients.map((ingredient) => (
                            <SquishyButton
                                key={`base-${ingredient.id}`}
                                variant={baseChoice === ingredient.id ? 'primary' : 'secondary'}
                                onPress={() => setBaseChoice(ingredient.id)}
                                style={[
                                    styles.ingredientButton,
                                    baseChoice === ingredient.id && styles.selectedIngredient
                                ]}
                            >
                                <Typography variant="body" style={[
                                    styles.ingredientText,
                                    baseChoice === ingredient.id && styles.selectedText
                                ]}>
                                    {ingredient.text}
                                </Typography>
                                <Typography variant="caption" style={styles.pointsText}>+{ingredient.points} pts</Typography>
                            </SquishyButton>
                        ))}
                    </View>

                    {/* Seasoning Ingredients */}
                    <Typography variant="label" style={styles.sectionTitle}>Seasoning (Tone/Delivery):</Typography>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.seasoningIngredients.map((ingredient) => (
                            <SquishyButton
                                key={`season-${ingredient.id}`}
                                variant={seasoningChoice === ingredient.id ? 'primary' : 'secondary'}
                                onPress={() => setSeasoningChoice(ingredient.id)}
                                style={[
                                    styles.ingredientButton,
                                    seasoningChoice === ingredient.id && styles.selectedSeasoning
                                ]}
                            >
                                <Typography variant="body" style={[
                                    styles.ingredientText,
                                    seasoningChoice === ingredient.id && styles.selectedText
                                ]}>
                                    {ingredient.text}
                                </Typography>
                                <Typography variant="caption" style={styles.pointsText}>+{ingredient.points} pts</Typography>
                            </SquishyButton>
                        ))}
                    </View>

                    {/* Preview */}
                    {baseChoice && seasoningChoice && (
                        <GlassCard style={styles.previewCard}>
                            <Typography variant="label" style={styles.previewTitle}>Your Dish Preview:</Typography>
                            <Typography variant="body" style={styles.previewText}>
                                {currentBasket.baseIngredients.find(b => b.id === baseChoice)?.text}
                            </Typography>
                            <Typography variant="h2" center style={styles.previewPlus}>+</Typography>
                            <Typography variant="body" style={styles.previewText}>
                                {currentBasket.seasoningIngredients.find(s => s.id === seasoningChoice)?.text}
                            </Typography>
                            <Typography variant="caption" center style={styles.previewScore}>
                                Estimated: {calculateRoundScore()} points
                            </Typography>
                        </GlassCard>
                    )}

                    {/* Submit Button */}
                    <SquishyButton
                        onPress={submitDish}
                        disabled={!baseChoice || !seasoningChoice}
                        style={[styles.submitButton, (!baseChoice || !seasoningChoice) && styles.disabledButton]}
                    >
                        <Typography variant="button" style={{ color: COLORS.textPrimary }}>
                            {round < BASKETS.length - 1 ? 'Plate the Dish' : 'Complete Service'}
                        </Typography>
                    </SquishyButton>

                    {/* Session Info */}
                    {session && (
                        <Typography variant="caption" center style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                    )}
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    scrollContent: {
        padding: SPACING.regular,
        paddingTop: SPACING.xlarge,
    },
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.regular,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.regular,
    },
    subtitleText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.tiny,
        fontStyle: 'italic',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.small,
    },
    scoreText: {
        color: COLORS.gradientStart,
        fontWeight: 'bold',
    },
    roundText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.tiny,
    },
    loadingText: {
        marginTop: SPACING.xxxlarge,
        marginBottom: SPACING.regular,
    },
    basketCard: {
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(139, 69, 19, 0.3)',
        borderColor: '#8B4513',
        borderWidth: 2,
    },
    basketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.small,
    },
    basketEmoji: {
        marginRight: SPACING.small,
    },
    scenario: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    sectionTitle: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    ingredientsContainer: {
        marginBottom: SPACING.regular,
    },
    ingredientButton: {
        marginBottom: SPACING.small,
    },
    selectedIngredient: {
        borderColor: COLORS.gradientStart,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
    },
    selectedSeasoning: {
        borderColor: COLORS.brightYellow,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
    ingredientText: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.micro,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    pointsText: {
        color: COLORS.textHint,
    },
    previewCard: {
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(51, 222, 165, 0.1)',
    },
    previewTitle: {
        color: COLORS.success,
        marginBottom: SPACING.small,
    },
    previewText: {
        color: COLORS.textPrimary,
        fontStyle: 'italic',
    },
    previewPlus: {
        color: COLORS.success,
        marginVertical: SPACING.tiny,
    },
    previewScore: {
        color: COLORS.brightYellow,
        marginTop: SPACING.small,
    },
    submitButton: {
        marginTop: SPACING.small,
    },
    disabledButton: {
        opacity: 0.5,
    },
    sessionInfo: {
        color: COLORS.textHint,
        marginTop: SPACING.regular,
    },
});

export default ChoppedFamily;
