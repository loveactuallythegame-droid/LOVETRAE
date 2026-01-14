import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function FutureCouncil({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Future Council. You survived the fire. Now design the city.");
    }, [gameId]);

    function ratify() {
        HapticFeedbackSystem.success();
        speakMarcie("Decree Ratified. 'We proactively protect our relationship.'");
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Council Adjourned", "Decree Drafters Status: Certified.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Scenario 1: Relapse Prevention</Text>
                <Text variant="body">An old dating app contact messages: "Hey."</Text>

                <View style={styles.entry}>
                    <Text variant="instructions">Partner A (Action):</Text>
                    <Text variant="body" style={styles.draft}>"Show message + Block contact."</Text>
                </View>

                <View style={styles.entry}>
                    <Text variant="instructions">Partner B (Value):</Text>
                    <Text variant="body" style={styles.draft}>"Proactive protection."</Text>
                </View>

                <SquishyButton onPress={ratify} style={styles.submitBtn}>
                    <Text variant="header">Ratify Decree</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'The Future Council',
        description: 'Draft future laws',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: round,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    entry: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8,
        marginVertical: 6
    },
    draft: {
        fontStyle: 'italic',
        color: '#33DEA5',
        marginTop: 4
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
