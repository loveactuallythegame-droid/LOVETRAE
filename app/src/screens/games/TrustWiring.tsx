import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const CHALLENGES = [
    {
        alarm: "Unclear Social Plans",
        need: "Clarity",
        desc: "The light's flashing yellow. I need to know who, where, when.",
        tools: [
            { id: 'correct', text: "Proactive Transparency Template" },
            { id: 'wrong1', text: "Defensive Justification" },
            { id: 'wrong2', text: "Silent Withdrawal" }
        ]
    }
];

export default function TrustWiring({ route, navigation }: any) {
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
        speakMarcie("Welcome to Trust Wiring Simulator. Partner B sees the alarm. Partner A holds the tools.");
    }, [gameId]);

    function fixWire(toolId: string) {
        if (toolId === 'correct') {
            HapticFeedbackSystem.success();
            speakMarcie("Wire secured. Alarm deactivated.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Short circuit. Try again.");
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
        Alert.alert("Pattern Rewired", "Master Electricians Status.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = CHALLENGES[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Challenge {round + 1}</Text>

                <View style={styles.console}>
                    <Text variant="keyword" style={{ color: '#FFD700' }}>ALARM: {current.alarm}</Text>
                    <Text variant="body">Partner B says: "{current.desc}"</Text>
                </View>

                <Text variant="instructions">Partner A, select tool:</Text>
                <View style={styles.tools}>
                    {current.tools.map(t => (
                        <SquishyButton key={t.id} onPress={() => fixWire(t.id)} style={styles.toolBtn}>
                            <Text variant="body">{t.text}</Text>
                        </SquishyButton>
                    ))}
                </View>

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Trust Wiring Simulator',
        description: 'Rewire the circuit',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    console: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFD700',
        marginBottom: 20
    },
    tools: { gap: 10 },
    toolBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    }
});
