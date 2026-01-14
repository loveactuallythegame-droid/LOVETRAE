import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const SCENARIOS = [
    {
        desc: "A major stressor hits (job loss). The storm clouds gather.",
        p1_opts: [{ id: 'A', text: "TIPP Skills" }, { id: 'B', text: "Withdraw" }],
        p2_opts: [{ id: 'A', text: "20-min Walk" }, { id: 'B', text: "Cancel plans" }]
    }
];

export default function HarborMasterChallenge({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
    const [p1Choice, setP1] = useState<string | null>(null);
    const [p2Choice, setP2] = useState<string | null>(null);
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
        speakMarcie("Welcome to The Harbor Master's Challenge. Harmony equals fair winds.");
    }, [gameId]);

    function submit() {
        if (!p1Choice || !p2Choice) {
            Alert.alert("Required", "Both captains must choose.");
            return;
        }

        HapticFeedbackSystem.success();
        // Logic: A+A is aligned in this demo
        if (p1Choice === 'A' && p2Choice === 'A') {
            speakMarcie("Aligned choices. That's co-regulation with a side of self-respect.");
        } else {
            speakMarcie("Misalignment detected. Correction course plotted.");
        }
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 400,
                state: JSON.stringify({ xp: 400 })
            });
        }
        Alert.alert("Harbor Secure", "You've earned the Golden Compass.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = SCENARIOS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Scenario 1</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.desc}</Text>

                <Text variant="sass">SSP Choice:</Text>
                <View style={styles.row}>
                    {current.p1_opts.map(o => (
                        <SquishyButton key={o.id} onPress={() => setP1(o.id)} style={[styles.btn, p1Choice === o.id ? styles.sel : {}]}>
                            <Text variant="body" style={{ fontSize: 12 }}>{o.text}</Text>
                        </SquishyButton>
                    ))}
                </View>

                <Text variant="sass" style={{ marginTop: 10 }}>SHP Choice:</Text>
                <View style={styles.row}>
                    {current.p2_opts.map(o => (
                        <SquishyButton key={o.id} onPress={() => setP2(o.id)} style={[styles.btn, p2Choice === o.id ? styles.sel : {}]}>
                            <Text variant="body" style={{ fontSize: 12 }}>{o.text}</Text>
                        </SquishyButton>
                    ))}
                </View>

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Reveal Choices</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Harbor Master’s Challenge',
        description: 'Choose Your Own Adventure',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 400,
        currentStep: round,
        totalTime: 500,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 10 },
    btn: { flex: 1, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', borderRadius: 8 },
    sel: { backgroundColor: '#FFD700' },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    }
});
