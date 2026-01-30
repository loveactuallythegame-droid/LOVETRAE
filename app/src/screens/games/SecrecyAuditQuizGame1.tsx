
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const SecrecyAuditQuizGame1 = () => {
    const [timer, setTimer] = useState(3);
    const [hesitation, setHesitation] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleAnswer = () => {
        // Handle answer logic
        if (timer < 2) { // Example hesitation logic
            setHesitation(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#16213e', '#0f3460']} style={styles.container}>
                <View style={styles.sideBar}>
                    <Text style={styles.sideBarTitle}>Dr. Marcie Liss</Text>
                     <View style={styles.truthDetector}>
                        <Text style={styles.truthDetectorLabel}>Truth Detector</Text>
                         <Text style={styles.truthDetectorStatus}>Watching...</Text>
                    </View>
                </View>
                <View style={styles.mainContent}>
                    <Text style={styles.header}>SECRECY AUDIT</Text>
                    <View style={[styles.questionCard, hesitation && styles.hesitationFlash]}>
                        <View style={styles.timerCircle}>
                            <Text style={styles.timerText}>{`0${timer}`}</Text>
                        </View>
                        <Text style={styles.questionText}>Have you ever kept a significant financial purchase hidden from your partner to avoid conflict?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.trueButton} onPress={handleAnswer}>
                                <MaterialIcons name="check-circle" size={32} color="#fff" />
                                <Text style={styles.buttonText}>TRUE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.falseButton} onPress={handleAnswer}>
                                <MaterialIcons name="cancel" size={32} color="#fff" />
                                <Text style={styles.buttonText}>FALSE</Text>
                            </TouchableOpacity>
                        </View>
                        {hesitation && <Text style={styles.hesitationText}>Hesitation Detected</Text>}
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f3460' },
    container: { flex: 1, flexDirection: 'row' },
    sideBar: { width: 100, backgroundColor: 'rgba(40, 46, 57, 0.6)', padding: 12, justifyContent: 'space-between', alignItems: 'center' },
    sideBarTitle: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
    truthDetector: { alignItems: 'center' },
    truthDetectorLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase' },
    truthDetectorStatus: { color: '#ffbf00', fontSize: 12 },
    mainContent: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    questionCard: { backgroundColor: 'rgba(40, 46, 57, 0.6)', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    hesitationFlash: { borderColor: '#ffbf00', borderWidth: 2, shadowColor: '#ffbf00', shadowRadius: 10 },
    timerCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 4, borderColor: '#ff0048', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 16, right: 16 },
    timerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    questionText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 40 },
    buttonContainer: { flexDirection: 'row', gap: 16 },
    trueButton: { flex: 1, height: 100, backgroundColor: '#ff0048', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
    falseButton: { flex: 1, height: 100, backgroundColor: '#d4145a', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
    buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    hesitationText: { color: '#ffbf00', marginTop: 16, textTransform: 'uppercase', fontSize: 12 },
});

export default SecrecyAuditQuizGame1;
