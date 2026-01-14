import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const ROUNDS = [
    {
        statement: "You're going to leave me just like everyone else!",
        options: [
            { id: 'A', text: "That's ridiculous. You know I'm not.", type: 'bad' },
            { id: 'B', text: "I hear you're scared I might leave. I'm not going anywhere.", type: 'good' },
            { id: 'C', text: "Let's talk later.", type: 'neutral' },
            { id: 'D', text: "Ugh, not this again.", type: 'bad' }
        ]
    }
];

export default function ValidationGameShow({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Validation Game Show. Spin the wheel to build a bridge, not a wall.");
    }, [gameId]);

    function submit() {
        if (!choice) return;
        HapticFeedbackSystem.success();
        speakMarcie("Jackpot. 5 stars means your nervous system just whispered 'Safe'.");
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 450,
                state: JSON.stringify({ xp: 450 })
            });
        }
        Alert.alert("Bridge Built", "Validation Virtuosos unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Round {round + 1}</Text>
                <Text variant="sass" style={{ marginBottom: 16 }}>Partner A says: "{current.statement}"</Text>

                <Text variant="instructions">Partner B, choose your response:</Text>
                {current.options.map(o => (
                    <SquishyButton
                        key={o.id}
                        onPress={() => setChoice(o.id)}
                        style={[styles.opt, choice === o.id ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: choice === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Lock In Response</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Validation Game Show',
        description: 'Spin for connection',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 250,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    opt: {
        padding: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    selected: {
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
