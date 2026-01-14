import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function NewlywedHeart({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Newlywed Game: Heart Edition. Guess the soul weather.");
    }, [gameId]);

    function submit() {
        // Demo: Assume correct guess
        if (choice === 'B') {
            HapticFeedbackSystem.success();
            speakMarcie("Correct. She doesn't need 'sorry', she needs validation that her rage is justified.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Missed. Listen closer to the storm.");
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 450,
                state: JSON.stringify({ xp: 450 })
            });
        }
        Alert.alert("Heart Sync Masters", "Empathetic Accuracy: High.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Round 1: Survivor's Fury</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>
                    "When she is feeling her rage about the words, what does she most need from him in that moment?"
                </Text>

                <View style={styles.opts}>
                    <SquishyButton onPress={() => setChoice('A')} style={[styles.btn, choice === 'A' ? styles.sel : {}]}>
                        <Text variant="body">A) Silence</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => setChoice('B')} style={[styles.btn, choice === 'B' ? styles.sel : {}]}>
                        <Text variant="body">B) Validation</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => setChoice('C')} style={[styles.btn, choice === 'C' ? styles.sel : {}]}>
                        <Text variant="body">C) Space</Text>
                    </SquishyButton>
                </View>

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Lock In Prediction</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Newlywed Game: Heart Edition',
        description: 'Guess soul weather',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 450,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    opts: { gap: 10 },
    btn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    sel: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#FA1F63',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
