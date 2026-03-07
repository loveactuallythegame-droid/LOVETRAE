import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ScreenLayout } from '../../components/ui';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function TriggerTriage({ route, navigation }: any) {
    const { gameId } = route.params || { gameId: 'trigger-triage' };
    const [painLevel, setPainLevel] = useState(5);
    const [trigger, setTrigger] = useState('');
    const [script, setScript] = useState('');
    const sessionId = useRef<string | null>(null);
    const coupleId = useRef<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }: any) => {
            const user = data.session?.user;
            const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
            if (user && couple_id) {
                coupleId.current = couple_id;
                const session = await createGameSession(gameId, user.id, couple_id);
                sessionId.current = session.id;
            }
        });
    }, [gameId]);

    useEffect(() => {
        if (painLevel >= 8 && script.length < 10) {
            speakMarcie("Your pain scale is at 8, but your communication is at 2. Let's fix that ratio.");
        }
    }, [painLevel, script]);

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Trigger Triage',
        description: 'Pain scale assessment and de-escalation',
        category: 'healing' as const,
        difficulty: 'hard' as const,
        xpReward: 85,
        currentStep: 0,
        totalTime: 120,
        playerData: { vulnerabilityScore: painLevel * 10, honestyScore: 80, completionTime: 0, partnerSync: 0 },
    }), [gameId, painLevel]);

    function onComplete(res: { score: number; xpEarned: number }) {
        const bonus = Math.min(35, script.length > 50 ? 35 : script.length * 0.5);
        const xp = Math.min(120, 85 + bonus);
        if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ painLevel, trigger, script, xp }) });
        navigation.goBack();
    }

    const inputArea = (
        <View>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" center style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <Typography variant="body">Rate your current pain/trigger level (1-10)</Typography>
                <View style={styles.sliderContainer}>
                    <Typography 
                        variant="h3" 
                        style={[styles.painLevelText, { color: painLevel > 7 ? COLORS.error : COLORS.success }]}
                    >
                        {painLevel}
                    </Typography>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={painLevel}
                        onValueChange={setPainLevel}
                        minimumTrackTintColor={painLevel > 7 ? COLORS.error : COLORS.success}
                        maximumTrackTintColor={COLORS.textPrimary}
                    />
                </View>
                <TextInput 
                    placeholder="What triggered this?" 
                    placeholderTextColor={COLORS.textHint}
                    style={styles.input} 
                    value={trigger} 
                    onChangeText={setTrigger} 
                />
                <Typography variant="body" style={styles.deescalationLabel}>
                    De-escalation Script / Coping Strategy:
                </Typography>
                <TextInput 
                    placeholder="I feel triggered because... I need..." 
                    placeholderTextColor={COLORS.textHint}
                    style={[styles.input, styles.multilineInput]} 
                    multiline 
                    value={script} 
                    onChangeText={setScript} 
                />
                {painLevel > 6 && (
                    <View style={styles.suggestionContainer}>
                        <Typography variant="keyword">
                            Suggested: "I am feeling a level {painLevel} trigger. Can we pause for 20 mins?"
                        </Typography>
                    </View>
                )}
            </GlassCard>
        </View>
    );

    return <GameContainer state={baseState} inputs={["slider", "text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
    gameTitle: {
        marginBottom: SPACING.small
    },
    subtitle: {
        marginBottom: SPACING.xlarge
    },
    sliderContainer: { 
        alignItems: 'center', 
        marginVertical: SPACING.regular 
    },
    painLevelText: {
        // color is dynamic based on painLevel
    },
    slider: {
        width: '100%',
        height: 40,
    },
    input: { 
        backgroundColor: COLORS.backgroundSecondary, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle, 
        borderRadius: BORDER_RADIUS.input, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        marginTop: SPACING.small 
    },
    deescalationLabel: {
        marginTop: SPACING.regular,
    },
    multilineInput: {
        height: 80,
    },
    suggestionContainer: {
        marginTop: SPACING.regular,
    },
});
