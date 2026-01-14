import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const ROUNDS = [
    {
        q: "What emotional itch were you scratching with multiple relationships?",
        top: ["Validation addiction (42%)", "Fear of real intimacy (28%)", "Thrill of reinvention (18%)", "Avoiding self-confrontation (8%)"],
    },
    {
        q: "What was the first thing you did that felt TRULY like yourself again?",
        top: ["Reconnected with an old friend (35%)", "Made a decision alone (25%)", "Wore something they hated (20%)", "Canceled a plan to nap (12%)"]
    }
];

export default function IntimacyFeud({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Intimacy Feud. You vs. 100 recovered couples.");
    }, [gameId]);

    function submitGuess() {
        if (guess === null) return;
        const r = ROUNDS[round];
        HapticFeedbackSystem.success();
        speakMarcie(`Survey says... Answer ${guess + 1} was indeed on the board.`);

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
        Alert.alert("Feud Finished", "You matched the survey!", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Round {round + 1}</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.q}</Text>

                {current.top.map((ans, i) => (
                    <SquishyButton
                        key={i}
                        onPress={() => setGuess(i)}
                        style={[styles.opt, guess === i ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: guess === i ? '#120016' : '#fff' }}>{guess === i ? ans : `Answer ${i + 1}`}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submitGuess} style={styles.submitBtn}>
                    <Text variant="header">Buzz In</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'The Intimacy Feud',
        description: 'Guess top survey answers',
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
    opt: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center'
    },
    selected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#33DEA5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
