
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const actions = [{icon: 'local_florist', text: 'BUY FLOWERS'}, {icon: 'restaurant', text: 'COOK DINNER'}, {icon: 'volunteer_activism', text: 'GIVE MASSAGE'}];
const subjects = [{icon: 'kitchen', text: 'FOR KITCHEN'}, {icon: 'weekend', text: 'FOR THE WEEKEND'}, {icon: 'schedule', text: 'FOR 20 MINUTES'}];
const reasons = ['"Because you tolerate my snoring"', '"Because you are my everything"', '"Because I love you"' ];

const Dice = ({ result }: { result: {icon: string, text: string} }) => (
    <View style={styles.dice}>
        <Text style={styles.diceIcon}>{result.icon}</Text>
        <Text style={styles.diceText}>{result.text}</Text>
    </View>
);

const CommitmentDiceGameScreen = () => {
    const [action, setAction] = useState(actions[0]);
    const [subject, setSubject] = useState(subjects[0]);
    const [reason, setReason] = useState(reasons[0]);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            const newAction = actions[Math.floor(Math.random() * actions.length)];
            const newSubject = subjects[Math.floor(Math.random() * subjects.length)];
            const newReason = reasons[Math.floor(Math.random() * reasons.length)];
            setAction(newAction);
            setSubject(newSubject);
            setReason(newReason);
            setIsRolling(false);
        }, 1000); // Simulate rolling animation
    };

    useEffect(rollDice, []);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0c16', '#1a1e3a']} style={styles.background} />
            <Header title="Commitment Dice" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.diceContainer}>
                    <Dice result={action} />
                    <Text style={styles.plus}>+</Text>
                    <Dice result={subject} />
                </View>

                <View style={styles.reasonCard}>
                    <Text style={styles.reasonLabel}>The Reason</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                    <TouchableOpacity style={styles.rollButton} onPress={rollDice} disabled={isRolling}>
                        <Text style={styles.rollButtonText}>{isRolling ? 'ROLLING...' : 'ROLL AGAIN'}</Text>
                    </TouchableOpacity>
                </View>
                
                 <View style={styles.hostContainer}>
                    <Text style={styles.hostQuote}>"Try to make it look like you mean it, darling!"</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </View>

                <View style={styles.logContainer}>
                     <Text style={styles.logTitle}>Recent Commitments</Text>
                    {/* Log items would be populated from state */}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0c16' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { padding: 20, alignItems: 'center' },
    diceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    dice: { width: 140, height: 140, backgroundColor: '#232948', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, borderWidth: 2, borderColor: 'rgba(212, 17, 157, 0.5)' },
    diceIcon: { fontSize: 40, color: '#d4119d' },
    diceText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 14, color: '#FFF', marginTop: 10, textAlign: 'center', textTransform: 'uppercase' },
    plus: { fontSize: 30, color: 'rgba(255,255,255,0.2)' },
    reasonCard: { backgroundColor: 'rgba(25, 30, 51, 0.7)', padding: 20, borderRadius: 16, width: '100%', alignItems: 'center', marginBottom: 30 },
    reasonLabel: { fontFamily: 'SweetPink-Regular', color: '#d4119d', textTransform: 'uppercase', letterSpacing: 2 },
    reasonText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 22, fontStyle: 'italic', marginVertical: 15, textAlign: 'center' },
    rollButton: { backgroundColor: '#f40b61', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    rollButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16 },
    hostContainer: { alignItems: 'center', marginBottom: 30 },
    hostQuote: { backgroundColor: '#FFF', color: '#221017', padding: 10, borderRadius: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
    hostName: { fontFamily: 'SweetPink-Regular', color: '#d4119d' },
    logContainer: { width: '100%' },
    logTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 10 },
});

export default CommitmentDiceGameScreen;
