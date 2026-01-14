import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function LegacyDash({ route, navigation }: any) {
    const { gameId } = route.params;
    const [stage, setStage] = useState(1);
    const [puzzle, setPuzzle] = useState<string[]>([]);
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
        speakMarcie("Welcome to Legacy Dash. Build a legacy that outlasts the lie. Ready? GO!");
    }, [gameId]);

    function completeTask() {
        HapticFeedbackSystem.success();
        if (stage === 1) {
            speakMarcie("Clue Unlocked: FAMILY = ________ + LOVE");
            setStage(2);
        } else if (stage === 2) {
            speakMarcie("Emblem designed. Next: The Origin Story.");
            setStage(3);
            setPuzzle(['[Our family story has unique beginnings]', '[but]', '[our love for you]', '[is the simplest, truest thing.]']);
        } else if (stage === 3) {
            speakMarcie("Sentence assembled like poets. Final Stop.");
            setStage(4);
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 400,
                state: JSON.stringify({ xp: 400 })
            });
        }
        Alert.alert("Legacy Secured", "You looked at the wreckage and said: 'We're building here.'", [
            { text: "Finish", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Leg {stage}/4</Text>

                {stage === 1 && (
                    <View>
                        <Text variant="body">Task: Match accountability actions to goals.</Text>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Text variant="body">Match: Annual Check-in → Team Feeling</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 2 && (
                    <View>
                        <Text variant="body">Task: Design Family Emblem.</Text>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Text variant="body">Assemble: Shield + Sprout + Spark</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 3 && (
                    <View>
                        <Text variant="body">Task: Order the Origin Story Sentence.</Text>
                        {puzzle.map((p, i) => (
                            <View key={i} style={styles.puzzlePiece}><Text variant="body" style={{ fontSize: 12 }}>{p}</Text></View>
                        ))}
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Text variant="body">Confirm Order</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 4 && (
                    <View>
                        <Text variant="body">Final Task: Record Legacy Message.</Text>
                        <Text variant="instructions">"To our child: You are ours. We chose you."</Text>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Text variant="body">Record Together</Text>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Legacy Dash',
        description: 'The Amazing Race for Family Legacy',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 400,
        currentStep: stage,
        totalTime: 600,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, stage]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
    puzzlePiece: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        marginVertical: 4,
        borderRadius: 4
    }
});
