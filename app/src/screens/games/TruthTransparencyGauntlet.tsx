import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const ROUNDS = [
    {
        q: "What is the purpose of 'Defining the Betrayal Together'?",
        opts: [
            { id: 'A', text: "Assign blame" },
            { id: 'B', text: "Create a shared, factual foundation" },
            { id: 'C', text: "Punish the unfaithful partner" },
            { id: 'D', text: "Make the betrayed partner feel worse" }
        ],
        correct: 'B'
    }
];

export default function TruthTransparencyGauntlet({ route, navigation }: any) {
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
        speakMarcie("Welcome to the Gauntlet. The fare is integrity. Don't make me pull over.");
    }, [gameId]);

    function submit() {
        if (!choice) return;
        const correct = ROUNDS[round].correct;
        if (choice === correct) {
            HapticFeedbackSystem.success();
            speakMarcie("Correct. You're building on bedrock, not quicksand.");
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Wrong. Pull over. We need to talk about foundations.");
        }
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 200,
                state: JSON.stringify({ xp: 200 })
            });
        }
        Alert.alert("Ride Complete", "Truth Architects Status: Pending.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Question {round + 1}</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.q}</Text>

                {current.opts.map(o => (
                    <SquishyButton
                        key={o.id}
                        onPress={() => setChoice(o.id)}
                        style={[styles.opt, choice === o.id ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: choice === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Lock In Answer</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Truth & Transparency Gauntlet',
        description: 'Cash Cab for integrity',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    opt: {
        padding: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    selected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700'
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#FA1F63',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
