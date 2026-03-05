import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const ROUNDS = [
    {
        q: "What is the single most important word to include when you tell The Story of Our Family Now?",
        top: ["Choice (48%)", "Truth (22%)", "Baby (15%)", "Resilience (10%)", "Love (5%)"]
    },
    {
        q: "Name something that should be in your 'New Truth Contract' to help manage triggers.",
        top: ["Code word for triggered (52%)", "Scheduled talks (28%)", "No secret convos (12%)", "Plan for social (8%)"]
    }
];

export default function FamilyFeudNewReality({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
    const [guess, setGuess] = useState<number | null>(null);
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
        speakMarcie("Welcome to Family Feud: Our New Reality Edition! Tonight's opponent? The Ghosts of the Past.");
    }, [gameId]);

    function submitGuess() {
        if (guess === null) return;
        HapticFeedbackSystem.success();
        speakMarcie(`Survey says... It's on the board!`);

        if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setGuess(null);
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
        Alert.alert("Reality Forged", "You matched the survey!", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={{ gap: SPACING.regular }}>
            <GlassCard>
                <Text variant="h1" center style={styles.gameTitle}>The Love Arcade</Text>
                <Text variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Text>
                
                <Text variant="h3" style={{ marginTop: SPACING.large }}>Round {round + 1}</Text>
                <Text variant="body" style={{ marginBottom: SPACING.large }}>{current.q}</Text>

                {current.top.map((ans, i) => (
                    <SquishyButton
                        key={i}
                        variant={guess === i ? 'primary' : 'ghost'}
                        onPress={() => setGuess(i)}
                        style={styles.opt}
                    >
                        <Text variant="button" style={{ color: guess === i ? COLORS.textPrimary : COLORS.textSecondary }}>
                            {guess === i ? ans : `Answer ${i + 1}`}
                        </Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submitGuess} style={styles.submitBtn}>
                    <Text variant="button">Buzz In</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Family Feud: New Reality',
        description: 'You vs. The Ghosts of the Past',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 200,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        marginBottom: SPACING.regular,
    },
    opt: {
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        alignItems: 'center'
    },
    submitBtn: {
        marginTop: SPACING.large,
        marginBottom: SPACING.large,
    },
});
