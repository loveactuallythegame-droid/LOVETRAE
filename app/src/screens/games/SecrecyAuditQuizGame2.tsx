
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SecrecyAuditQuizGame2 = () => {
    const [countdown, setCountdown] = useState(5);
    const [latency, setLatency] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        const latencyTimer = setInterval(() => {
            setLatency(prev => prev + 50);
        }, 50);

        return () => {
            clearInterval(timer);
            clearInterval(latencyTimer);
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0a1413', '#230f18']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>SECRECY AUDIT</Text>
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{`0${countdown}`}</Text>
                    </View>
                    <Text style={styles.headerText}>SYNC SCORE: 1,240</Text>
                </View>

                <View style={styles.gameArea}>
                    <View style={styles.hostSection}>
                         <View style={styles.speechBubble}>
                            <Text style={styles.speechText}>"Hmm, that delay is speaking volumes..."</Text>
                        </View>
                    </View>

                    <View style={styles.quizSection}>
                        <View style={styles.questionCard}>
                            <Text style={styles.questionLabel}>Question 10 of 10</Text>
                            <Text style={styles.questionText}>Have you ever kept a financial secret from your partner?</Text>
                        </View>

                        <View style={styles.hesitationMeter}>
                            <Text style={styles.hesitationLabel}>Response Latency: {latency}ms</Text>
                            <View style={styles.meterBar}>
                                <View style={[styles.meterFill, { width: `${(latency / 1000) * 100}%` }]} />
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.trueButton}>
                                <Text style={styles.buttonMainText}>TRUE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.falseButton}>
                                <Text style={styles.buttonMainText}>FALSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0a1413' },
    container: { flex: 1, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    headerText: { color: '#fff', fontWeight: 'bold' },
    timerContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: '#ff006d', justifyContent: 'center', alignItems: 'center' },
    timerText: { color: '#ff006d', fontSize: 24, fontWeight: 'bold' },
    gameArea: { flexDirection: 'row', flex: 1, gap: 16 },
    hostSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    speechBubble: { backgroundColor: 'rgba(28, 39, 38, 0.7)', padding: 12, borderRadius: 12 },
    speechText: { color: '#fff', fontStyle: 'italic' },
    quizSection: { flex: 2, justifyContent: 'center' },
    questionCard: { backgroundColor: 'rgba(28, 39, 38, 0.7)', padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24 },
    questionLabel: { color: '#ff006d', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 },
    questionText: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    hesitationMeter: { marginBottom: 24, backgroundColor: 'rgba(28, 39, 38, 0.7)', padding: 12, borderRadius: 12 },
    hesitationLabel: { color: '#ff8c00', marginBottom: 8 },
    meterBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5 },
    meterFill: { height: '100%', backgroundColor: '#ff8c00', borderRadius: 5 },
    buttonRow: { flexDirection: 'row', gap: 16 },
    trueButton: { flex: 1, height: 80, backgroundColor: '#ff006d', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    falseButton: { flex: 1, height: 80, backgroundColor: '#ff007a', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    buttonMainText: { color: '#fff', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' },
});

export default SecrecyAuditQuizGame2;
