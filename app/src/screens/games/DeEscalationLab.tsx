import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';

const SCENARIOS = [
    {
        event: "A deleted text notification is seen.",
        fact: "Notification deleted.",
        injury: "Feels like hiding.",
        opts: [
            { id: 'A', text: "Why did you delete it?" },
            { id: 'B', text: "I saw a deleted notification. My alarm went off. Can we pause?" },
            { id: 'C', text: "Whatever." }
        ],
        correct: 'B'
    }
];

export default function DeEscalationLab({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
    const [choice, setChoice] = useState<string | null>(null);
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
        speakMarcie("Welcome to The De-Escalation Lab. This isn't a battlefield. It's training.");
    }, [gameId]);

    function submit() {
        if (!choice) return;
        const correct = SCENARIOS[round].correct;
        if (choice === correct) {
            HapticFeedbackSystem.success();
            speakMarcie("Correct. You named the ghost instead of fighting it.");
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Wrong. That's escalation. Try 'My alarm went off'.");
        }
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 300,
                state: JSON.stringify({ xp: 300 })
            });
        }
        Alert.alert("Lab Complete", "Master Calibrators Status Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = SCENARIOS[round];

    const inputArea = (
        <ScrollView style={{ gap: SPACING.regular }} showsVerticalScrollIndicator={false}>
            <GlassCard padding="large">
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="sass">Learn to de-escalate conflicts! Practice naming emotions instead of reacting.</Typography>
                    </View>
                </View>

                <Typography variant="h2" style={styles.scenarioTitle}>Scenario {round + 1}</Typography>
                <Typography variant="body" style={styles.scenarioText}>{current.event}</Typography>
                <View style={styles.factInjuryContainer}>
                    <GlassCard style={styles.factInjuryBox} padding="small">
                        <Typography variant="label">Fact</Typography>
                        <Typography variant="body" style={styles.smallText}>{current.fact}</Typography>
                    </GlassCard>
                    <GlassCard style={styles.factInjuryBox} padding="small">
                        <Typography variant="label">Injury</Typography>
                        <Typography variant="body" style={styles.smallText}>{current.injury}</Typography>
                    </GlassCard>
                </View>

                {current.opts.map(o => (
                    <SquishyButton
                        key={o.id}
                        onPress={() => setChoice(o.id)}
                        style={[styles.opt, choice === o.id ? styles.selected : {}]}
                        variant={choice === o.id ? 'primary' : 'ghost'}
                    >
                        <Typography variant="body" style={{ color: choice === o.id ? COLORS.backgroundPrimary : COLORS.textPrimary }}>{o.text}</Typography>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn} disabled={!choice}>
                    <LinearGradient
                        colors={choice ? GRADIENTS.primary.colors : ['#666', '#666']}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.gradientButton}
                    >
                        <Typography variant="h3" style={{ color: COLORS.textPrimary }}>De-Escalate</Typography>
                    </LinearGradient>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'The De-Escalation Lab',
        description: 'Simulated trigger training',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 300,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.small,
        height: SPACING.xxlarge + SPACING.small,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: SPACING.xxlarge,
        height: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    scenarioTitle: {
        marginBottom: SPACING.small,
    },
    scenarioText: {
        marginBottom: SPACING.regular,
    },
    factInjuryContainer: {
        flexDirection: 'row', 
        gap: SPACING.small, 
        marginVertical: SPACING.regular 
    },
    factInjuryBox: {
        flex: 1,
    },
    smallText: {
        fontSize: TYPOGRAPHY.fontSize.label,
    },
    opt: {
        padding: SPACING.regular,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: SPACING.small,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    },
    selected: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
        alignItems: 'center',
        marginBottom: SPACING.xlarge,
        ...SHADOWS.buttonGlow
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.large,
        paddingVertical: SPACING.regular,
    },
});
