import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout } from '../../components/ui';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const TRUTH_OR_TRUST_QUESTIONS = [
    {
        id: '1',
        question: 'What is the most meaningful compliment your partner has ever given you?',
        category: 'connection',
        type: 'truth',
        difficulty: 'medium'
    },
    {
        id: '2',
        question: 'Share a moment when you felt truly seen by your partner.',
        category: 'connection',
        type: 'truth',
        difficulty: 'medium'
    },
    {
        id: '3',
        challenge: 'Tell your partner one thing you appreciate about them right now.',
        category: 'affection',
        type: 'trust',
        difficulty: 'easy'
    },
    {
        id: '4',
        question: 'What is something you have been hesitant to share with your partner?',
        category: 'vulnerability',
        type: 'truth',
        difficulty: 'hard'
    },
    {
        id: '5',
        challenge: 'Look into your partner\'s eyes for 30 seconds without speaking.',
        category: 'intimacy',
        type: 'trust',
        difficulty: 'medium'
    }
];

export default function TruthOrTrust({ route, navigation }: any) {
    const { gameId } = route.params || { gameId: 'truth-or-trust' };
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [currentResponse, setCurrentResponse] = useState('');
    const [gameCompleted, setGameCompleted] = useState(false);
    const coupleId = useRef<string | null>(null);
    const [partnerResponse, setPartnerResponse] = useState<string | null>(null);
    const userId = useRef<string | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                userId.current = user.uid;
                const profileRef = doc(db, 'profiles', user.uid);
                const profileSnap = await getDoc(profileRef);
                const couple_code = profileSnap.data()?.couple_code;

                if (couple_code) {
                    coupleId.current = couple_code;
                    
                    const sessionRef = await addDoc(collection(db, 'game_sessions'), {
                        gameId,
                        userId: user.uid,
                        couple_id: couple_code,
                        createdAt: new Date(),
                        state: { currentQuestionIndex, responses, completed: false },
                    });
                    setSessionId(sessionRef.id);
                    
                    // Set up real-time sync with partner
                    const q = query(
                        collection(db, 'game_sessions'),
                        where('couple_id', '==', couple_code),
                        where('gameId', '==', gameId),
                        where('userId', '!=', user.uid)
                    );
                    
                    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === "added" || change.type === "modified") {
                                const data = change.doc.data();
                                if (data.state?.responses) {
                                    // Get the latest response from partner
                                    const partnerResponses = data.state.responses;
                                    const currentQId = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex]?.id;
                                    if (currentQId && partnerResponses[currentQId]) {
                                        setPartnerResponse(partnerResponses[currentQId]);
                                    }
                                }
                            }
                        });
                    });
                    
                    return () => unsubscribeSnapshot();
                }
            }
        });

        return () => unsubscribeAuth && unsubscribeAuth();
    }, [gameId, currentQuestionIndex]);

    const handleResponseChange = (text: string) => {
        setCurrentResponse(text);
    };

    const submitResponse = () => {
        const currentQ = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
        if (currentQ) {
            const newResponses = { ...responses, [currentQ.id]: currentResponse };
            setResponses(newResponses);
            
            // Update in Firebase
            if (sessionId) {
                const sessionRef = doc(db, 'game_sessions', sessionId);
                updateDoc(sessionRef, {
                    state: { 
                        currentQuestionIndex, 
                        responses: newResponses,
                        completed: currentQuestionIndex === TRUTH_OR_TRUST_QUESTIONS.length - 1
                    }
                });
            }
            
            if (currentQuestionIndex < TRUTH_OR_TRUST_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setCurrentResponse('');
                setPartnerResponse(null);
            } else {
                setGameCompleted(true);
            }
        }
    };

    const currentQuestion = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
    const responseType = currentQuestion?.type === 'truth' ? 'Truth Question' : 'Trust Challenge';
    const responseColor = currentQuestion?.type === 'truth' ? COLORS.emotionalConnection : COLORS.romanceHub;

    const inputArea = (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.xxlarge }}>
            {!gameCompleted ? (
                <>
                    <GlassCard>
                        <Typography variant="h1" center style={styles.gameTitle}>
                            The Love Arcade
                        </Typography>
                        <Typography variant="h2" center style={styles.subtitle}>
                            +100 Games to Deepen Connection
                        </Typography>

                        <LinearGradient
                            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientContainer}
                        >
                            <View style={styles.headerContainer}>
                                <Typography 
                                    variant="h3" 
                                    style={{ 
                                        marginBottom: SPACING.regular, 
                                        color: responseColor,
                                        textTransform: 'uppercase',
                                        letterSpacing: TYPOGRAPHY.letterSpacing.wide
                                    }}
                                >
                                    {responseType}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    style={{ 
                                        position: 'absolute', 
                                        right: SPACING.regular, 
                                        top: SPACING.regular,
                                        color: COLORS.textHint 
                                    }}
                                >
                                    {currentQuestionIndex + 1}/{TRUTH_OR_TRUST_QUESTIONS.length}
                                </Typography>
                            </View>
                            
                            <Typography 
                                variant="body" 
                                style={{ 
                                    marginBottom: SPACING.xlarge, 
                                    color: COLORS.textPrimary,
                                    fontSize: TYPOGRAPHY.fontSize.headerMedium
                                }}
                            >
                                {currentQuestion?.question || currentQuestion?.challenge}
                            </Typography>

                            <Typography 
                                variant="caption" 
                                style={{ 
                                    color: COLORS.textHint, 
                                    marginBottom: SPACING.small 
                                }}
                            >
                                Your response:
                            </Typography>
                            
                            <View style={styles.responseContainer}>
                                <TouchableOpacity 
                                    style={styles.responseBox} 
                                    onPress={() => {}}
                                >
                                    <Typography 
                                        variant="body" 
                                        style={{ 
                                            color: currentResponse ? COLORS.textPrimary : COLORS.textHint,
                                            fontStyle: currentResponse ? 'normal' : 'italic'
                                        }}
                                    >
                                        {currentResponse || 'Tap to share your response...'}
                                    </Typography>
                                </TouchableOpacity>
                            </View>
                            
                            <SquishyButton
                                onPress={submitResponse}
                                disabled={!currentResponse.trim()}
                                size="large"
                            >
                                <Typography variant="button">
                                    {currentQuestionIndex === TRUTH_OR_TRUST_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                                </Typography>
                            </SquishyButton>
                        </LinearGradient>
                    </GlassCard>
                    
                    {partnerResponse && (
                        <GlassCard style={styles.partnerCard}>
                            <Typography 
                                variant="sass" 
                                style={{ 
                                    color: COLORS.aquaTeal, 
                                    marginBottom: SPACING.small 
                                }}
                            >
                                Partner Responded:
                            </Typography>
                            <Typography 
                                variant="body" 
                                style={{ 
                                    color: COLORS.textSecondary 
                                }}
                            >
                                {partnerResponse}
                            </Typography>
                        </GlassCard>
                    )}
                </>
            ) : (
                <GlassCard>
                    <LinearGradient
                        colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientContainer}
                    >
                        <Typography variant="h3" style={{ marginBottom: SPACING.regular, color: COLORS.success }}>
                            Game Completed!
                        </Typography>
                        <Typography variant="body" style={{ marginBottom: SPACING.xlarge, color: COLORS.textPrimary }}>
                            You and your partner have shared {TRUTH_OR_TRUST_QUESTIONS.length} meaningful moments together.
                        </Typography>
                        <SquishyButton 
                            onPress={() => {
                                if (sessionId) {
                                    const sessionRef = doc(db, 'game_sessions', sessionId);
                                    updateDoc(sessionRef, {
                                        finished_at: new Date().toISOString(),
                                        score: TRUTH_OR_TRUST_QUESTIONS.length * 20,
                                        state: JSON.stringify({ completed: true, responses })
                                    });
                                }
                                navigation.goBack();
                            }}
                            size="large"
                        >
                            <Typography variant="button">Return to Menu</Typography>
                        </SquishyButton>
                    </LinearGradient>
                </GlassCard>
            )}
        </ScrollView>
    );

    const baseState = {
        id: gameId,
        title: 'Truth or Trust',
        description: 'Choose between revealing truths or completing trust challenges',
        category: 'emotional-connection' as const,
        difficulty: 'medium' as const,
        xpReward: 60,
        currentStep: currentQuestionIndex,
        totalTime: 900,
        playerData: { 
            vulnerabilityScore: Object.keys(responses).length > 3 ? 90 : Object.keys(responses).length > 1 ? 70 : 50, 
            honestyScore: Object.keys(responses).length > 3 ? 85 : Object.keys(responses).length > 1 ? 65 : 45, 
            completionTime: 0, 
            partnerSync: partnerResponse ? 80 : 20 
        },
    };

    return (
        <GameContainer 
            state={baseState} 
            inputs={["text"]} 
            inputArea={inputArea} 
            onComplete={() => {
                if (sessionId) {
                    const sessionRef = doc(db, 'game_sessions', sessionId);
                    updateDoc(sessionRef, {
                        finished_at: new Date().toISOString(),
                        score: Object.keys(responses).length * 20,
                        state: JSON.stringify({ completed: true, responses })
                    });
                }
                navigation.goBack();
            }} 
            sessionId={sessionId} 
        />
    );
}

const styles = StyleSheet.create({
    gameTitle: {
        marginBottom: SPACING.small
    },
    subtitle: {
        marginBottom: SPACING.xlarge
    },
    gradientContainer: {
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.regular,
    },
    responseContainer: {
        marginBottom: SPACING.xlarge,
    },
    responseBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        minHeight: 100,
    },
    partnerCard: {
        marginTop: SPACING.regular,
        padding: SPACING.regular,
    },
});
