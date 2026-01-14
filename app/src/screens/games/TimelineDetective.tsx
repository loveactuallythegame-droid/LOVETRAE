import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function TimelineDetective({ route, navigation }: any) {
    const { gameId } = route.params;
    const [evidence, setEvidence] = useState<string[]>([]);
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
        speakMarcie("Welcome to Timeline Detective. The lie wasn't an act, it was a system. Let's dismantle it.");
    }, [gameId]);

    function addEvidence(fact: string) {
        HapticFeedbackSystem.selection();
        setEvidence(prev => [...prev, fact]);
        if (evidence.length === 2) {
            setTimeout(() => {
                HapticFeedbackSystem.success();
                speakMarcie("Pattern identified: 'Escalation after emotional neglect'.");
                finish();
            }, 1000);
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
        Alert.alert("Case Solved", "Master Forensics Status Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Investigation Board</Text>
                <Text variant="instructions">Place evidence on the timeline:</Text>

                <View style={styles.timeline}>
                    {evidence.map((e, i) => (
                        <View key={i} style={styles.pin}>
                            <Text variant="body" style={{ fontSize: 10 }}>{e}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.evidencePool}>
                    <SquishyButton onPress={() => addEvidence("Feb 12: Created Profile")} style={styles.evidenceBtn}>
                        <Text variant="body">Feb 12: Created Profile</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => addEvidence("April 15: First Coffee")} style={styles.evidenceBtn}>
                        <Text variant="body">April 15: First Coffee</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => addEvidence("May 20: Discovery Day")} style={styles.evidenceBtn}>
                        <Text variant="body">May 20: Discovery Day</Text>
                    </SquishyButton>
                </View>

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Timeline Detective',
        description: 'Reconstruct the double life',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: evidence.length,
        totalTime: 600,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, evidence]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    timeline: {
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10
    },
    pin: {
        backgroundColor: '#FA1F63',
        padding: 8,
        borderRadius: 4
    },
    evidencePool: {
        gap: 10
    },
    evidenceBtn: {
        backgroundColor: '#2A1A31',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    }
});
