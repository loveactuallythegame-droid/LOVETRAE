
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const topics = [{icon: 'rebase_edit', text: 'The Dishwasher'}, {icon: 'schedule', text: 'Being Late'}, {icon: 'phone_android', text: 'Screen Time'}];
const constraints = [{icon: 'record_voice_over', text: 'Whispering Only'}, {icon: 'edit_note', text: 'Use "I feel" statements'}, {icon: 'timer', text: '5-Minute Limit'}];

const Dice = ({ result, color }: { result: {icon: string, text: string}, color: string }) => (
    <View style={[styles.dice, {borderColor: color}]}>
        <Text style={styles.diceIcon}>{result.icon}</Text>
        <Text style={styles.diceText}>{result.text}</Text>
    </View>
);

const ConflictDiceGameScreen = () => {
    const [topic, setTopic] = useState(topics[0]);
    const [constraint, setConstraint] = useState(constraints[0]);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            const newTopic = topics[Math.floor(Math.random() * topics.length)];
            const newConstraint = constraints[Math.floor(Math.random() * constraints.length)];
            setTopic(newTopic);
            setConstraint(newConstraint);
            setIsRolling(false);
        }, 1000); // Simulate rolling animation
    };

    useEffect(rollDice, []);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0118', '#0a0118']} style={styles.background} />
            <Header title="Conflict Dice Arena" />
            <View style={styles.gameLayout}>
                <View style={styles.refereeSidebar}>
                    <Text style={styles.sidebarTitle}>Referee</Text>
                    <Text style={styles.refereeName}>Dr. Marcie Liss</Text>
                     <Text style={styles.refereeQuote}>"Use 'I feel' instead of 'You always' to avoid a yellow card."</Text>
                </View>

                <ScrollView contentContainerStyle={styles.arena}>
                    <View style={styles.diceContainer}>
                        <Dice result={topic} color="#7f13ec" />
                        <Text style={styles.vs}>VS</Text>
                        <Dice result={constraint} color="#ec139e" />
                    </View>

                    <TouchableOpacity style={styles.rollButton} onPress={rollDice} disabled={isRolling}>
                        <Text style={styles.rollButtonText}>{isRolling ? 'ROLLING...' : 'ROLL DICE'}</Text>
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.hallOfFameSidebar}>
                    <Text style={styles.sidebarTitle}>Hall of Fame</Text>
                    {/* Fame items would be populated from state */}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0118' },
    background: { ...StyleSheet.absoluteFillObject },
    gameLayout: { flexDirection: 'row', flex: 1 },
    refereeSidebar: { width: 180, backgroundColor: 'rgba(10,1,24,0.6)', padding: 15 },
    hallOfFameSidebar: { width: 180, backgroundColor: 'rgba(10,1,24,0.6)', padding: 15 },
    sidebarTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF', textAlign: 'center', marginBottom: 15 },
    refereeName: { fontFamily: 'SweetPink-Regular', color: '#7f13ec', textAlign: 'center', fontSize: 16 },
    refereeQuote: { fontFamily: 'SweetPink-Regular', color: '#FFF', fontStyle: 'italic', textAlign: 'center', marginTop: 10, fontSize: 12 },
    arena: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    diceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
    dice: { width: 160, height: 160, borderRadius: 32, borderWidth: 4, justifyContent: 'center', alignItems: 'center', padding: 10 },
    diceIcon: { fontSize: 40, color: 'rgba(255,255,255,0.5)' },
    diceText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 20, color: '#FFF', marginTop: 10, textAlign: 'center', textTransform: 'uppercase' },
    vs: { fontFamily: 'BarbieDream-Regular', fontSize: 40, color: 'rgba(255,255,255,0.2)' },
    rollButton: { backgroundColor: '#7f13ec', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 16 },
    rollButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 18, textTransform: 'uppercase' },
});

export default ConflictDiceGameScreen;
