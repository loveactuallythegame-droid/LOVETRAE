import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function ApologyWorkshop({ route, navigation }: any) {
    const { gameId } = route.params;
    const [station, setStation] = useState<'forge' | 'altar'>('forge');
    const [pillar, setPillar] = useState(1);
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
        speakMarcie("Welcome to The Apology & Release Workshop. No groveling. Structural integrity only.");
    }, [gameId]);

    function buildPillar() {
        HapticFeedbackSystem.success();
        if (pillar < 4) {
            setPillar(p => p + 1);
            speakMarcie(pillar === 1 ? "Regret placed." : pillar === 2 ? "Responsibility acknowledged." : "Empathy validated.");
        } else {
            setStation('altar');
            speakMarcie("Apology forged. Proceed to the Release Altar.");
        }
    }

    function release() {
        HapticFeedbackSystem.success();
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 250,
                state: JSON.stringify({ xp: 250 })
            });
        }
        Alert.alert("Workshop Closed", "Master Crafters Status Earned.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">{station === 'forge' ? `The Forge: Pillar ${pillar}/4` : 'The Release Altar'}</Text>

                {station === 'forge' && (
                    <View>
                        <Text variant="instructions">Assemble the phrase block:</Text>
                        <SquishyButton onPress={buildPillar} style={styles.actionBtn}>
                            <Text variant="body">
                                {pillar === 1 ? "I am deeply sorry for..." :
                                    pillar === 2 ? "This was my choice..." :
                                        pillar === 3 ? "I understand it made you feel..." :
                                            "To ensure this never happens again..."}
                            </Text>
                        </SquishyButton>
                    </View>
                )}

                {station === 'altar' && (
                    <View>
                        <Text variant="instructions">Release 'The Victim' identity.</Text>
                        <SquishyButton onPress={release} style={styles.actionBtn}>
                            <Text variant="body">Say: "I survived. Now I build."</Text>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Apology & Release Workshop',
        description: 'Build apologies, release weight',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 250,
        currentStep: pillar,
        totalTime: 500,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, pillar, station]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#FA1F63',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20
    }
});
