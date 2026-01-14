import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function DealOrNoDealAccountability({ route, navigation }: any) {
    const { gameId } = route.params;
    const [round, setRound] = useState(0);
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
        speakMarcie("Welcome to Deal or No Deal: Accountability. The suitcases contain truth.");
    }, [gameId]);

    function chooseDeal(d: boolean) {
        if (d) {
            HapticFeedbackSystem.success();
            speakMarcie("Deal accepted. Full Responsibility Declaration signed.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("No Deal. Protocol terminated. Truth honored.");
            navigation.goBack();
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
        Alert.alert("Accountability Accepted", "Phase 1 Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header">The Banker's Offer</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>
                    "I offer the Full Responsibility Declaration:
                    1. Naming the crime as verbal violence.
                    2. Specificity of harm.
                    3. 100% ownership.
                    4. Commitment to transformation."
                </Text>

                <Text variant="instructions">Will you accept full, unilateral responsibility?</Text>

                <View style={styles.opts}>
                    <SquishyButton onPress={() => chooseDeal(true)} style={[styles.btn, styles.deal]}>
                        <Text variant="header">DEAL</Text>
                    </SquishyButton>
                    <SquishyButton onPress={() => chooseDeal(false)} style={[styles.btn, styles.nodeal]}>
                        <Text variant="header">NO DEAL</Text>
                    </SquishyButton>
                </View>

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Deal or No Deal: Accountability',
        description: 'The suitcases hold truth',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    opts: { flexDirection: 'row', gap: 16, marginTop: 20 },
    btn: { flex: 1, padding: 20, borderRadius: 12, alignItems: 'center' },
    deal: { backgroundColor: '#33DEA5' },
    nodeal: { backgroundColor: '#FA1F63' }
});
