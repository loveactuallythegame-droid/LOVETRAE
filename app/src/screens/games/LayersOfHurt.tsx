import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

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
        <ScrollView style={{ gap: SPACING.small }}>
            <GlassCard>
                <Typography variant="h2">
                    Layer {box}: {box === 1 ? 'Social Betrayal' : box === 2 ? 'Digital Deception' : 'The Grieving'}
                </Typography>

                {box === 1 && (
                    <View>
                        <Typography variant="body" style={styles.instruction}>
                            Identity the Breach Point & Choose Coping Statement.
                        </Typography>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Typography variant="body">Select: "Coworker's Partner" + "We are a team"</Typography>
                        </SquishyButton>
                    </View>
                )}

                {box === 2 && (
                    <View>
                        <Typography variant="body" style={styles.instruction}>
                            Unscramble the Digital Rule.
                        </Typography>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Typography variant="body">Code: TRANSPARENCY</Typography>
                        </SquishyButton>
                    </View>
                )}

                {box === 3 && (
                    <View>
                        <Typography variant="body" style={styles.instruction}>
                            Burn the blurred memories.
                        </Typography>
                        <SquishyButton onPress={unlock} style={styles.actionBtn}>
                            <Typography variant="body">Action: Admit Loss + Hope for Earned Safety</Typography>
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
    instruction: {
        marginTop: SPACING.medium,
        marginBottom: SPACING.medium,
    },
    actionBtn: {
        marginTop: SPACING.large,
        backgroundColor: COLORS.success,
        padding: SPACING.large,
        borderRadius: BORDER_RADIUS.large,
        alignItems: 'center',
        marginBottom: SPACING.large,
    },
});
