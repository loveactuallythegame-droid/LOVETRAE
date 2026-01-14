import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const CASES = [
    {
        scenario: "Partner A texts 'Are you mad?' after a one-word reply. Silence follows.",
        clues: [
            { text: "Trigger: Perceived cold tone", type: "trigger" },
            { text: "Thought: 'They're pulling away'", type: "thought" },
            { text: "Reaction: Rapid texting → Silence", type: "reaction" },
            { text: "Aftermath: Shame spiral", type: "aftermath" }
        ]
    }
];

export default function BPDPatternDetective({ route, navigation }: any) {
    const { gameId } = route.params;
    const [step, setStep] = useState(0);
    const [mapped, setMapped] = useState<any>({});
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
        speakMarcie("Welcome to Pattern Detective. Love isn't blind, it's forensic.");
    }, [gameId]);

    function mapClue(clue: any) {
        HapticFeedbackSystem.selection();
        setMapped((m: any) => ({ ...m, [clue.type]: clue }));
    }

    function checkCase() {
        // Demo: auto-win if they clicked anything
        HapticFeedbackSystem.success();
        speakMarcie("One hundred points. You didn't just solve the case, you disarmed the bomb.");
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
        Alert.alert("Case Closed", "Master Meteorologists status unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = CASES[step];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Case File 1</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{current.scenario}</Text>

                <Text variant="instructions">Map the clues to the cycle:</Text>
                <View style={styles.grid}>
                    {current.clues.map((c, i) => (
                        <SquishyButton
                            key={i}
                            onPress={() => mapClue(c)}
                            style={[styles.clue, mapped[c.type] ? styles.mapped : {}]}
                        >
                            <Text variant="body" style={{ fontSize: 12 }}>{c.text}</Text>
                        </SquishyButton>
                    ))}
                </View>

                <SquishyButton onPress={checkCase} style={styles.submitBtn}>
                    <Text variant="header">Submit Analysis</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'BPD Pattern Detective',
        description: 'Decode the storm cycle',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: step,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, step]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    clue: {
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        width: '48%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    mapped: {
        backgroundColor: '#33DEA5',
        borderColor: '#33DEA5'
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    },
});
