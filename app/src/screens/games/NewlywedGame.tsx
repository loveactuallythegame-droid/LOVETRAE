import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const ROUNDS = [
    {
        q: "When your partner thinks about the 'two wounds' (betrayal & parenthood), which causes more loneliness right now?",
        options: [
            { id: 'A', text: "The Betrayal Wound" },
            { id: 'B', text: "The Parenthood Wound" },
            { id: 'C', text: "They feel equal" },
            { id: 'D', text: "Neither — I feel connected" }
        ]
    },
    {
        q: "Finish this sentence from your partner’s perspective: 'What makes me feel most like a real father is…'",
        options: [
            { id: 'A', text: "When baby smiles at me" },
            { id: 'B', text: "When I soothe their cries" },
            { id: 'C', text: "Making decisions for wellbeing" },
            { id: 'D', text: "Feeling connected as a team" }
        ]
    }
];

export default function NewlywedGame({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
    const [myAns, setMyAns] = useState<string | null>(null);
    const [pred, setPred] = useState<string | null>(null);
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
        speakMarcie("Welcome to Heart-to-Heart. You're not guessing snacks, you're guessing soul weather.");
    }, [gameId]);

    function submit() {
        if (!myAns || !pred) {
            Alert.alert("Required", "Please answer for yourself and predict for your partner.");
            return;
        }

        HapticFeedbackSystem.success();
        const isMatch = myAns === pred; // Simplified logic, assuming we play against self or mock partner
        speakMarcie(isMatch ? "Exact Match! +100. That's love in progress." : "Good guess, but dig deeper.");

        if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setMyAns(null);
            setPred(null);
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 250,
                state: JSON.stringify({ xp: 250 })
            });
        }
        Alert.alert("Heart Sync", "You're tuning in correctly.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Round {round + 1}</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.q}</Text>

                <Text variant="sass">Your Answer:</Text>
                {current.options.map(o => (
                    <SquishyButton
                        key={'my' + o.id}
                        onPress={() => setMyAns(o.id)}
                        style={[styles.opt, myAns === o.id ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: myAns === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <Text variant="sass" style={{ marginTop: 10 }}>Predict Partner's:</Text>
                {current.options.map(o => (
                    <SquishyButton
                        key={'pred' + o.id}
                        onPress={() => setPred(o.id)}
                        style={[styles.opt, pred === o.id ? styles.selectedPred : {}]}
                    >
                        <Text variant="body" style={{ color: pred === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Lock In</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'The Newlywed Game: Heart-to-Heart',
        description: 'Guess emotional needs',
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
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    selected: {
        backgroundColor: '#33DEA5',
        borderColor: '#33DEA5'
    },
    selectedPred: {
        backgroundColor: '#FA1F63',
        borderColor: '#FA1F63'
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#FFD700',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
