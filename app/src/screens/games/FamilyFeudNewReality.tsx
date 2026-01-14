import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

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
