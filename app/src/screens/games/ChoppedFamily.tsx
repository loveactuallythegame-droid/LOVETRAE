import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const BASKETS = [
    {
        name: "Disagreement on sleep training + Resentment + Exhaustion",
        base: [
            { id: 'A', text: "Let's research together tonight." },
            { id: 'B', text: "I'll take tonight. You decide tomorrow." },
            { id: 'C', text: "Can we table this and just hold each other?" }
        ],
        seasoning: [
            { id: 'A', text: "Hand on arm: 'I trust your instinct.'" },
            { id: 'B', text: "Let's ask pediatrician — no blame." },
            { id: 'C', text: "Laugh: 'Remember when we thought this would be hard?'" }
        ]
    }
];

export default function ChoppedFamily({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
    const [baseChoice, setBaseChoice] = useState<string | null>(null);
    const [seasoningChoice, setSeasoningChoice] = useState<string | null>(null);
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
        speakMarcie("Welcome to Chopped: Family Kitchen. 90 seconds to cook a response that's nourishing, not toxic.");
    }, [gameId]);

    function submit() {
        if (!baseChoice || !seasoningChoice) {
            Alert.alert("Incomplete Dish", "Select a Base and a Seasoning!");
            return;
        }

        HapticFeedbackSystem.success();
        // Simple demo logic: just giving points
        speakMarcie("Synergistic! You're not avoiding truth, you're protecting the container where truth can grow.");

        if (round < BASKETS.length - 1) {
            setRound(r => r + 1);
            setBaseChoice(null);
            setSeasoningChoice(null);
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
        Alert.alert("Kitchen Closed", "Five-Star Forgers. Standing ovation from your future selves.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = BASKETS[round];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Basket {round + 1}</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.name}</Text>

                <Text variant="sass">Base (Core Action):</Text>
                {current.base.map(o => (
                    <SquishyButton
                        key={'b' + o.id}
                        onPress={() => setBaseChoice(o.id)}
                        style={[styles.opt, baseChoice === o.id ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: baseChoice === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <Text variant="sass" style={{ marginTop: 10 }}>Seasoning (Tone):</Text>
                {current.seasoning.map(o => (
                    <SquishyButton
                        key={'s' + o.id}
                        onPress={() => setSeasoningChoice(o.id)}
                        style={[styles.opt, seasoningChoice === o.id ? styles.selectedSeason : {}]}
                    >
                        <Text variant="body" style={{ color: seasoningChoice === o.id ? '#120016' : '#fff' }}>{o.text}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Serve Dish</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Chopped: Family Kitchen',
        description: 'Cook a response to chaos',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 300,
        currentStep: round,
        totalTime: 90,
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
    selectedSeason: {
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
