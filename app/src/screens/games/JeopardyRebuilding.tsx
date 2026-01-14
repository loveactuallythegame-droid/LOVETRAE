import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function JeopardyRebuilding({ route, navigation }: any) {
    const { gameId } = route.params;
    const [q, setQ] = useState<any>(null);
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
        speakMarcie("Welcome to Jeopardy: Rebuilding Round. Categories are Potent Promises.");
    }, [gameId]);

    function selectClue(val: number) {
        setQ({ val, text: "This phrase is banned because it weaponizes BPD fear.", ans: "What is 'You're just being dramatic'?" });
    }

    function answer() {
        HapticFeedbackSystem.success();
        speakMarcie("Correct. 'Dramatic' is a war crime in this house.");
        finish();
    }

    async function finish() {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: 2000,
                state: JSON.stringify({ xp: 2000 })
            });
        }
        Alert.alert("Jeopardy Champion", "Relational Integrity Earned.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                {!q ? (
                    <View style={styles.board}>
                        <Text variant="header" style={{ textAlign: 'center', marginBottom: 10 }}>Linguistic Geneva Convention</Text>
                        {[100, 200, 300, 400, 500].map(v => (
                            <SquishyButton key={v} onPress={() => selectClue(v)} style={styles.clue}>
                                <Text variant="header" style={{ color: '#FFD700' }}>${v}</Text>
                            </SquishyButton>
                        ))}
                    </View>
                ) : (
                    <View>
                        <Text variant="header" style={{ color: '#FFD700' }}>${q.val}</Text>
                        <Text variant="body" style={{ marginVertical: 20, fontSize: 18 }}>{q.text}</Text>
                        <SquishyButton onPress={answer} style={styles.buzzBtn}>
                            <Text variant="header">Buzz In: "What is..."</Text>
                        </SquishyButton>
                    </View>
                )}
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Jeopardy: Rebuilding Round',
        description: 'The new social contract',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 2000,
        currentStep: q ? 1 : 0,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, q]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
    board: { gap: 10 },
    clue: {
        backgroundColor: '#00008B',
        padding: 16,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FFD700'
    },
    buzzBtn: {
        backgroundColor: '#FA1F63',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center'
    }
});
