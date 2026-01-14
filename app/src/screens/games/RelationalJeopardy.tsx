import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function RelationalJeopardy({ route, navigation }: any) {
    const { gameId } = route.params;
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [qIndex, setQIndex] = useState(0); // For demo, just go linearly through a few
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
        speakMarcie("Welcome to Relational Jeopardy! Categories are Potent Promises.");
    }, [gameId]);

    function submit() {
        if (!answer.trim()) return;

        // Demo logic: accept anything
        setScore(s => s + 400);
        HapticFeedbackSystem.success();
        speakMarcie("Correct. 'Redefinition'—not reconciliation. You're building a spaceship, not patching a leaky boat.");

        setTimeout(() => {
            finish(score + 400);
        }, 2000);
    }

    async function finish(finalScore: number) {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: finalScore,
                state: JSON.stringify({ xp: 300 })
            });
        }
        Alert.alert("Jeopardy Complete", `Final Score: ${finalScore}. Rank: Sovereign Pact.`, [
            { text: "Finish", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <View style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Category: REDEFINITION for 400</Text>
                <Text variant="body" style={{ marginVertical: 16 }}>
                    "This is the conscious choice to build NEW instead of repair OLD."
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="What is..."
                    placeholderTextColor="#9ca3af"
                    value={answer}
                    onChangeText={setAnswer}
                />

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Buzz In & Answer</Text>
                </SquishyButton>
            </GlassCard>
        </View>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Relational Jeopardy!',
        description: 'Categories by rebuilt couples',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 300,
        currentStep: qIndex,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, qIndex]);

    return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => finish(score)} />;
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
});
