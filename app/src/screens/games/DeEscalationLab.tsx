import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

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
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Scenario {round + 1}</Text>
                <Text variant="body">{current.event}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8 }}>
                        <Text variant="keyword">Fact</Text>
                        <Text variant="body" style={{ fontSize: 12 }}>{current.fact}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8 }}>
                        <Text variant="keyword">Injury</Text>
                        <Text variant="body" style={{ fontSize: 12 }}>{current.injury}</Text>
                    </View>
                </View>

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
                    <Text variant="header">De-Escalate</Text>
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
        backgroundColor: '#33DEA5',
        borderColor: '#33DEA5'
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
