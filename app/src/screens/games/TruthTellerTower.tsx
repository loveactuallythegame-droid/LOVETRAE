import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import theme from '../../theme';

const { width, height } = Dimensions.get('window');

const QUESTIONS = [
    {
        text: "Before rebuilding, you must name the dragon. What’s the #1 reason couples fail Phase 1?",
        options: [
            { id: 'A', text: 'They call it "a rough patch."' },
            { id: 'B', text: 'They skip naming the betrayal and jump to "fixing."' },
            { id: 'C', text: 'They let the betrayed partner define it alone.' },
            { id: 'D', text: 'They use clinical jargon to sound smart.' }
        ],
        correct: 'B',
        marcieReason: "If you don't name the monster, it lives in your basement rent-free."
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
    const [partnerResponse, setPartnerResponse] = useState<any>(null);
    const coupleId = useRef<string | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const profileRef = doc(db, 'profiles', user.uid);
                const profileSnap = await getDoc(profileRef);
                const couple_code = profileSnap.data()?.couple_code;

                if (couple_code) {
                    coupleId.current = couple_code;
                    
                    // Check for active session first to JOIN
                    const { data: existing } = await supabase.from('game_sessions')
                        .select('id')
                        .eq('game_id', gameId)
                        .eq('couple_id', couple_code)
                        .is('finished_at', null)
                        .maybeSingle();

                    if (existing) {
                        setSessionId(existing.id);
                        speakMarcie("Joining existing session. Don't be late next time.");
                    } else {
                        const sessionRef = await addDoc(collection(db, 'game_sessions'), {
                            gameId,
                            userId: user.uid,
                            couple_id: couple_code,
                            createdAt: new Date(),
                            state: { currentQuestion: qIndex, myAnswer, prediction, score },
                        });
                        setSessionId(sessionRef.id);
                        speakMarcie("Welcome to Truth Teller Tower. Five questions. One shared brain—if you're lucky.");
                    }
                    
                    // Set up real-time sync with partner
                    const q = query(
                        collection(db, 'game_sessions'),
                        where('couple_id', '==', couple_code),
                        where('gameId', '==', gameId),
                        where('userId', '!=', user.uid) // Different user
                    );
                    
                    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === "added" || change.type === "modified") {
                                const data = change.doc.data();
                                if (data.state) {
                                    setPartnerResponse(data.state);
                                }
                            }
                        });
                    });
                    
                    return () => unsubscribeSnapshot();
                }
            }
        });

        return () => unsubscribeAuth && unsubscribeAuth();
    }, [gameId]);

    function submit() {
        if (!myAnswer || !prediction) {
            Alert.alert("Complete Both", "Select your answer and predict your partner's!");
            return;
        }

        const q = QUESTIONS[qIndex];
        let roundPoints = 0;
        if (myAnswer === q.correct) roundPoints += 10;
        // Check if partner's answer matches (mock for demo)
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
            const sessionRef = doc(db, 'game_sessions', sessionId);
            await updateDoc(sessionRef, {
                finished_at: new Date().toISOString(),
                score: finalScore,
                state: JSON.stringify({ xp: finalScore * 2, completed: true })
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
                <LinearGradient
                    colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientContainer}
                >
                    <Text variant="header" style={{ marginBottom: 10, color: theme.COLORS.textPrimary }}>Round {qIndex + 1}/5</Text>
                    <Text variant="body" style={{ marginBottom: 16, color: theme.COLORS.textPrimary }}>{q.text}</Text>

                    <Text variant="sass" style={{ marginBottom: 8, color: theme.COLORS.accentPink }}>Layer 1: What is the Truth?</Text>
                    {q.options.map(opt => (
                        <SquishyButton
                            key={opt.id}
                            onPress={() => setMyAnswer(opt.id)}
                            style={[styles.opt, myAnswer === opt.id ? styles.selected : {}]}
                        >
                            <Text variant="body" style={{ color: myAnswer === opt.id ? theme.COLORS.background : theme.COLORS.textPrimary }}>{opt.text}</Text>
                        </SquishyButton>
                    ))}

                    <Text variant="sass" style={{ marginTop: 16, marginBottom: 8, color: theme.COLORS.accentViolet }}>Layer 2: What will THEY pick?</Text>
                    {q.options.map(opt => (
                        <SquishyButton
                            key={'pred' + opt.id}
                            onPress={() => setPrediction(opt.id)}
                            style={[styles.opt, prediction === opt.id ? styles.selectedPred : {}]}
                        >
                            <Text variant="body" style={{ color: prediction === opt.id ? theme.COLORS.background : theme.COLORS.textPrimary }}>{opt.text}</Text>
                        </SquishyButton>
                    ))}

                    <SquishyButton onPress={submit} style={styles.submitBtn}>
                        <Text variant="header">Lock In Answers</Text>
                    </SquishyButton>
                </LinearGradient>
            </GlassCard>
            
            {partnerResponse && (
                <GlassCard style={styles.partnerCard}>
                    <Text variant="sass" style={{ color: theme.COLORS.accentTeal }}>Partner's Response:</Text>
                    <Text variant="body" style={{ color: theme.COLORS.textSecondary }}>
                        {partnerResponse.myAnswer ? `Selected: ${partnerResponse.myAnswer}` : 'Waiting for partner...'}
                    </Text>
                </GlassCard>
            )}
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
    gradientContainer: {
        padding: theme.SPACING.md,
        borderRadius: theme.SIZES.borderRadius,
    },
    opt: {
        padding: theme.SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.SIZES.borderRadius,
        marginBottom: theme.SPACING.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    selected: {
        backgroundColor: theme.COLORS.success,
        borderColor: theme.COLORS.success
    },
    selectedPred: {
        backgroundColor: theme.COLORS.emotionalConnection,
        borderColor: theme.COLORS.emotionalConnection
    },
    submitBtn: {
        marginTop: theme.SPACING.lg,
        padding: theme.SPACING.lg,
        borderRadius: theme.SIZES.buttonBorderRadius,
        alignItems: 'center',
        marginBottom: theme.SPACING.md,
        backgroundColor: 'transparent',
    },
    partnerCard: {
        marginTop: theme.SPACING.md,
        padding: theme.SPACING.md,
    },
});