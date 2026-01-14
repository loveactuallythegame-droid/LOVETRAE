import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function ConnectionConstructor({ route, navigation }: any) {
    const { gameId } = route.params;
    const [stage, setStage] = useState(1);
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
        speakMarcie("Welcome to Connection Constructor. Love is infrastructure. Let's lay the first brick.");
    }, [gameId]);

    function build() {
        HapticFeedbackSystem.success();
        if (stage === 1) {
            speakMarcie("Identity Library built. Books are labeled 'Me, Beyond Us'.");
            setStage(2);
        } else if (stage === 2) {
            speakMarcie("Predictable Park open. No grand gestures, just reliability with a heartbeat.");
            setStage(3);
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 300,
                state: JSON.stringify({ xp: 300 })
            });
        }
        Alert.alert("City Built", "Stability: 100%. Master Architects.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Phase {stage}/3</Text>

                {stage === 1 && (
                    <View>
                        <Text variant="body">Task: Build The Identity Library</Text>
                        <Text variant="instructions">Name 3 interests outside the relationship.</Text>
                        <SquishyButton onPress={build} style={styles.actionBtn}>
                            <Text variant="body">Add: Painting, Running, Reading</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 2 && (
                    <View>
                        <Text variant="body">Task: Lay Pavement for Intimacy Avenue</Text>
                        <Text variant="instructions">Schedule 3 tiny connection points.</Text>
                        <SquishyButton onPress={build} style={styles.actionBtn}>
                            <Text variant="body">Add: Coffee Chat, Walk, Rose & Thorn</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 3 && (
                    <View>
                        <Text variant="body">Task: Blueprint The Repair Shop</Text>
                        <Text variant="instructions">Define cool-down signals and return phrases.</Text>
                        <SquishyButton onPress={build} style={styles.actionBtn}>
                            <Text variant="body">Install: 'Anchor' Signal + Validation Wrench</Text>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Connection Constructor',
        description: 'Build Secure Harbor City',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 300,
        currentStep: stage,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, stage]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#33DEA5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    }
});
