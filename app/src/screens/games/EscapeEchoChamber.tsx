import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function EscapeEchoChamber({ route, navigation }: any) {
    const { gameId } = route.params;
    const [code, setCode] = useState('');
    const [stage, setStage] = useState(1);
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
        speakMarcie("Welcome to the Echo Chamber. You're not escaping a room, you're escaping repetition.");
    }, [gameId]);

    function tryUnlock() {
        // Mock logic for demo
        if (stage === 1 && (code.includes('3') || code.toLowerCase().includes('notes'))) {
            HapticFeedbackSystem.success();
            speakMarcie("File 1 Decrypted. It wasn't love, it was administration.");
            setStage(2);
            setCode('');
        } else if (stage === 2) {
            HapticFeedbackSystem.success();
            speakMarcie("Soulmate script deleted. Next.");
            setStage(3);
            setCode('');
        } else if (stage === 3) {
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Access Denied. The echo grows louder.");
        }
    }

    async function finish() {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: 100,
                state: JSON.stringify({ xp: 250 })
            });
        }
        Alert.alert("Echo Chamber Breached", "You broke the script.", [
            { text: "Exit", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <View style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Puzzle {stage}/3</Text>
                <Text variant="body" style={{ marginVertical: 12 }}>
                    {stage === 1 ? "Shared Terminal: SYSTEM_SCALE: [?] locations | MANAGEMENT: [?] app" :
                        stage === 2 ? "Audio Clip: 'You're my soulmate.' (Click the empty box?)" :
                            "Obituary: 'Expired due to...'"}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder={stage === 1 ? "Enter combined code..." : "Enter solution..."}
                    placeholderTextColor="#9ca3af"
                    value={code}
                    onChangeText={setCode}
                />

                <SquishyButton onPress={tryUnlock} style={styles.submitBtn}>
                    <Text variant="header">Decrypt File</Text>
                </SquishyButton>
            </GlassCard>
        </View>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Escape Echo Chamber',
        description: 'Break the love script',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 250,
        currentStep: stage,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, stage]);

    return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
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
        backgroundColor: '#FA1F63',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
});
