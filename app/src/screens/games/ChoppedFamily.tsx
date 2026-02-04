import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

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
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText} variant="sass">Cook the perfect response! Balance core action with the right tone for harmony.</Text>
                    </View>
                </View>

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
                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text variant="header" style={{ color: '#ffffff' }}>Serve Dish</Text>
                    </LinearGradient>
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
        backgroundColor: '#37cf97',
        borderColor: '#37cf97'
    },
    selectedSeason: {
        backgroundColor: '#ffef1f',
        borderColor: '#ffef1f'
    },
    submitBtn: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 16,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    }
});
