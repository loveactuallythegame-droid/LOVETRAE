import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function TrustBingo({ route, navigation }: any) {
    const { gameId } = route.params;
    const [marked, setMarked] = useState<number[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }: any) => {
            const user = data.session?.user;
            if (user) {
                const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
                if (couple.data?.couple_code) {
                    const session = await createGameSession(gameId, user.id, couple.data.couple_code);
                    setSessionId(session.id);
                }
            }
        });
        speakMarcie("Welcome to Trust-Building Bingo. The prize is trust compound interest.");
    }, [gameId]);

    function toggle(i: number) {
        HapticFeedbackSystem.selection();
        if (marked.includes(i)) {
            setMarked(marked.filter(m => m !== i));
        } else {
            setMarked([...marked, i]);
        }
    }

    function checkBingo() {
        // Demo: if 3 marked, win
        if (marked.length >= 3) {
            HapticFeedbackSystem.success();
            speakMarcie("BINGO. You didn't just play a game. You laid bricks.");
            finish();
        } else {
            Alert.alert("Keep Building", "Not enough squares yet.");
        }
    }

    async function finish() {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Fortress Builders", "Trust Compounded.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const SQUARES = [
        "Planned phone-free date", "Shared schedule proactively", "Said 'I feel... I need...'",
        "Acknowledged effort", "15-min check-in", "Shared vulnerable feeling"
    ];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">This Week's Board</Text>
                <View style={styles.grid}>
                    {SQUARES.map((s, i) => (
                        <SquishyButton
                            key={i}
                            onPress={() => toggle(i)}
                            style={[styles.square, marked.includes(i) ? styles.marked : {}]}
                        >
                            <Text variant="body" style={{ fontSize: 10, textAlign: 'center' }}>{s}</Text>
                        </SquishyButton>
                    ))}
                </View>

                <SquishyButton onPress={checkBingo} style={styles.submitBtn}>
                    <Text variant="header">Call BINGO</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Trust-Building Bingo',
        description: 'Micro-actions for trust',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 500,
        currentStep: marked.length,
        totalTime: 604800, // 1 week in seconds (mock)
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, marked]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center'
    },
    square: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    marked: {
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
