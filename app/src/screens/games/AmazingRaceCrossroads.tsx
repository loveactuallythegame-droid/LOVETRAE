import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function AmazingRaceCrossroads({ route, navigation }: any) {
    const { gameId } = route.params;
    const [stage, setStage] = useState(1);
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
        speakMarcie("Welcome to The Amazing Race: Crossroads Leg. The prize is conscious choice.");
    }, [gameId]);

    function advance() {
        HapticFeedbackSystem.selection();
        if (stage < 5) {
            setStage(s => s + 1);
            speakMarcie("Route Info received. Go.");
        } else {
            HapticFeedbackSystem.success();
            speakMarcie("The true victory is not the path, but the choice. Race complete.");
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 600,
                state: JSON.stringify({ xp: 600 })
            });
        }
        Alert.alert("Crossroads Champions", "Sovereignty Earned.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">Stage {stage}</Text>

                {stage === 1 && (
                    <View>
                        <Text variant="instructions">Roadblock: Scar Awareness.</Text>
                        <SquishyButton onPress={advance} style={styles.actionBtn}>
                            <Text variant="body">"When scar touched: Pause + Acknowledge"</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage === 5 && (
                    <View>
                        <Text variant="instructions">Pit Stop: The Crossroads.</Text>
                        <Text variant="body">Choose freely:</Text>
                        <SquishyButton onPress={advance} style={styles.actionBtn}>
                            <Text variant="body">"I choose consciously."</Text>
                        </SquishyButton>
                    </View>
                )}

                {stage !== 1 && stage !== 5 && (
                    <SquishyButton onPress={advance} style={styles.actionBtn}>
                        <Text variant="body">Complete Challenge</Text>
                    </SquishyButton>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Amazing Race: Crossroads',
        description: 'Race to conscious choice',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 600,
        currentStep: stage,
        totalTime: 600,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, stage]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#FFD700',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    }
});
