import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function LayersOfHurt({ route, navigation }: any) {
    const { gameId } = route.params;
    const [box, setBox] = useState(1);
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
        speakMarcie("Welcome to The Layers of Hurt Escape Room. You're not escaping a room, you're escaping repetition.");
    }, [gameId]);

    function unlock() {
        HapticFeedbackSystem.success();
        if (box === 1) {
            speakMarcie("Social Betrayal Unlocked. Key found: 'United Front'.");
            setBox(2);
        } else if (box === 2) {
            speakMarcie("Digital Deception Unlocked. Key found: 'Radical Transparency'.");
            setBox(3);
        } else {
            speakMarcie("Grief Unlocked. Final Key: 'Honest Grief'.");
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Freedom", "Escape Artists Status: Granted.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Layer {box}: {box === 1 ? 'Social Betrayal' : box === 2 ? 'Digital Deception' : 'The Grieving'}</Text>

                {box === 1 && (
                    <View>
                        <Text variant="instructions">Identity the Breach Point & Choose Coping Statement.</Text>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Text variant="body">Select: "Coworker's Partner" + "We are a team"</Text>
                        </SquishyButton>
                    </View>
                )}

                {box === 2 && (
                    <View>
                        <Text variant="instructions">Unscramble the Digital Rule.</Text>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Text variant="body">Code: TRANSPARENCY</Text>
                        </SquishyButton>
                    </View>
                )}

                {box === 3 && (
                    <View>
                        <Text variant="instructions">Burn the blurred memories.</Text>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Text variant="body">Action: Admit Loss + Hope for Earned Safety</Text>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Layers of Hurt Escape Room',
        description: 'Escape the debris field',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: box,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, box]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#33DEA5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    }
});
