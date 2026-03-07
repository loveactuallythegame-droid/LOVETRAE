import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { GlassCard, Text, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

export default function CycleBreaker({ route, navigation }: any) {
    const { gameId } = route.params;
    const [pos, setPos] = useState(0);
    const sessionId = useRef<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }: any) => {
            const user = data.session?.user;
            if (user) {
                const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
                if (couple.data?.couple_code) {
                    const session = await createGameSession(gameId, user.id, couple.data.couple_code);
                    sessionId.current = session.id;
                }
            }
        });
        speakMarcie("Welcome to Cycle Breaker. You're playing against The Loop.");
    }, [gameId]);

    function roll() {
        HapticFeedbackSystem.selection();
        // Simulate progression
        if (pos === 0) {
            setPos(2);
            speakMarcie("Space 2: Trigger Analysis. Name the fear.");
        } else if (pos === 2) {
            setPos(6);
            speakMarcie("Space 6: Cycle Rewrite. Unlock the Escape Hatch.");
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 200,
                state: JSON.stringify({ xp: 200 })
            });
        }
        Alert.alert("Cycle Smashed", "Escape Hatch Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: SPACING.regular }}>
            <GlassCard>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Text variant="sass">Break free from destructive cycles! Identify triggers and rewrite reactions.</Text>
                    </View>
                </View>

                <Text variant="h2">Current Space: {pos}</Text>

                {pos === 0 && <Text variant="body">Start. Roll to move.</Text>}

                {pos === 2 && (
                    <View>
                        <Text variant="instructions">Trigger: Late Phone Call.</Text>
                        <SquishyButton onPress={roll} style={styles.actionBtn}>
                            <Text variant="body">Action: Name 'Catastrophic Thought'</Text>
                        </SquishyButton>
                    </View>
                )}

                {pos === 6 && (
                    <View>
                        <Text variant="instructions">Rewrite the reaction.</Text>
                        <SquishyButton onPress={roll} style={styles.actionBtn}>
                            <Text variant="body">Action: Say 'My alarm is loud' instead of attacking</Text>
                        </SquishyButton>
                    </View>
                )}

                {pos === 0 && (
                    <SquishyButton onPress={roll} style={styles.rollBtn}>
                        <LinearGradient
                            colors={GRADIENTS.primary.colors}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.gradientButton}
                        >
                            <Text variant="h2" style={{ color: COLORS.textPrimary }}>Roll Die</Text>
                        </LinearGradient>
                    </SquishyButton>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Cycle Breaker',
        description: 'Escape the loop',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: pos,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, pos]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    rollBtn: {
        padding: SPACING.xlarge,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.round,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: SPACING.xlarge,
        ...SHADOWS.buttonGlow,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.round,
        paddingVertical: SPACING.xlarge,
    },
    actionBtn: {
        marginTop: SPACING.xlarge,
        backgroundColor: COLORS.mintGreen,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
        alignItems: 'center',
        marginBottom: SPACING.xlarge,
        ...SHADOWS.buttonGlow,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover',
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
});
