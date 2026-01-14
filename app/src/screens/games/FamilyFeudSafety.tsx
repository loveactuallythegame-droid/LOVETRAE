import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const SURVEYS = [
    {
        q: "What is the #1 thing a survivor needs to feel after verbal violence to stabilize?",
        answers: [
            { text: "SAFETY", points: 92 },
            { text: "Apology", points: 5 },
            { text: "Love", points: 3 }
        ]
    }
];

export default function FamilyFeudSafety({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
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
        speakMarcie("Welcome to Family Feud: Safety Edition. 100 trauma therapists answered.");
    }, [gameId]);

    function guess(idx: number) {
        if (idx === 0) {
            HapticFeedbackSystem.success();
            speakMarcie("Number one answer! Safety. The floor must hold before you can stand.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Good answer, but not the top one. Try again.");
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Safety Architects", "Top Answer Found.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = SURVEYS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Survey Says...</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.q}</Text>

                {current.answers.map((a, i) => (
                    <SquishyButton key={i} onPress={() => guess(i)} style={styles.ansBtn}>
                        <Text variant="body">{a.text} ??</Text>
                    </SquishyButton>
                ))}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Family Feud: Safety Edition',
        description: 'You vs. Ghosts of Past',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 500,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    ansBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    }
});
