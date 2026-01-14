import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

const QUESTIONS = [
    {
        text: "Before rebuilding, you must name the dragon. What’s the #1 reason couples fail Phase 1?",
        options: [
            { id: 'A', text: 'They call it “a rough patch.”' },
            { id: 'B', text: 'They skip naming the betrayal and jump to “fixing.”' },
            { id: 'C', text: 'They let the betrayed partner define it alone.' },
            { id: 'D', text: 'They use clinical jargon to sound smart.' }
        ],
        correct: 'B',
        marcieReason: "If you don’t name the monster, it lives in your basement rent-free."
    },
    // Add other questions here similarly
];

export default function TruthTellerTower({ route, navigation }: any) {
    const { gameId } = route.params;
    const [qIndex, setQIndex] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);
    const [score, setScore] = useState(0);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }: any) => {
            const user = data.session?.user;
            if (user) {
                const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
                if (couple.data?.couple_code) {
                    // Check for active session first to JOIN
                    const { data: existing } = await supabase.from('game_sessions')
                        .select('id')
                        .eq('game_id', gameId)
                        .eq('couple_id', couple.data.couple_code)
                        .is('finished_at', null)
                        .maybeSingle();

                    if (existing) {
                        setSessionId(existing.id);
                        speakMarcie("Joining existing session. Don't be late next time.");
                    } else {
                        const session = await createGameSession(gameId, user.id, couple.data.couple_code);
                        setSessionId(session.id);
                        speakMarcie("Welcome to Truth Teller Tower. Five questions. One shared brain—if you're lucky.");
                    }
                }
            }
        });
    }, [gameId]);

    function submit() {
        if (!myAnswer || !prediction) {
            Alert.alert("Complete Both", "Select your answer and predict your partner's!");
            return;
        }

        const q = QUESTIONS[qIndex];
        let roundPoints = 0;
        if (myAnswer === q.correct) roundPoints += 10;
        // Mock prediction logic: assume partner is correct for demo
        if (prediction === q.correct) roundPoints += 5;

        setScore(s => s + roundPoints);
        HapticFeedbackSystem.success();

        if (qIndex < QUESTIONS.length - 1) {
            speakMarcie(roundPoints >= 15 ? "Double Match! psychic." : "Not bad, but watch the vagueness.");
            setQIndex(i => i + 1);
            setMyAnswer(null);
            setPrediction(null);
        } else {
            finish(score + roundPoints);
        }
    }

    async function finish(finalScore: number) {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: finalScore,
                state: JSON.stringify({ xp: finalScore * 2 })
            });
        }
        Alert.alert("Tower Scaled", `Final Score: ${finalScore}/100. Badge: ${finalScore > 90 ? 'The Unfiltered Signal' : 'Truth Adjacent'}`, [
            { text: "Done", onPress: () => navigation.goBack() }
        ]);
    }

    const q = QUESTIONS[qIndex] || QUESTIONS[0];

    const inputArea = (
        <ScrollView style={{ gap: 12 }}>
            <GlassCard>
                <Text variant="header" style={{ marginBottom: 10 }}>Round {qIndex + 1}/5</Text>
                <Text variant="body" style={{ marginBottom: 16 }}>{q.text}</Text>

                <Text variant="sass" style={{ marginBottom: 8 }}>Layer 1: What is the Truth?</Text>
                {q.options.map(opt => (
                    <SquishyButton
                        key={opt.id}
                        onPress={() => setMyAnswer(opt.id)}
                        style={[styles.opt, myAnswer === opt.id ? styles.selected : {}]}
                    >
                        <Text variant="body" style={{ color: myAnswer === opt.id ? '#120016' : '#fff' }}>{opt.text}</Text>
                    </SquishyButton>
                ))}

                <Text variant="sass" style={{ marginTop: 16, marginBottom: 8 }}>Layer 2: What will THEY pick?</Text>
                {q.options.map(opt => (
                    <SquishyButton
                        key={'pred' + opt.id}
                        onPress={() => setPrediction(opt.id)}
                        style={[styles.opt, prediction === opt.id ? styles.selectedPred : {}]}
                    >
                        <Text variant="body" style={{ color: prediction === opt.id ? '#120016' : '#fff' }}>{opt.text}</Text>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Text variant="header">Lock In Answers</Text>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Truth Teller Tower',
        description: 'Scale the lie-avalanche',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: qIndex,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, qIndex]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={() => finish(score)} sessionId={sessionId} />;
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
