import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const topics = [{icon: 'rebase_edit', text: 'The Dishwasher'}, {icon: 'schedule', text: 'Being Late'}, {icon: 'phone_android', text: 'Screen Time'}];
const constraints = [{icon: 'record_voice_over', text: 'Whispering Only'}, {icon: 'edit_note', text: 'Use "I feel" statements'}, {icon: 'timer', text: '5-Minute Limit'}];

const Dice = ({ result, color }: { result: {icon: string, text: string}, color: string }) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.dice, {borderColor: color}]}
    >
        <Text style={styles.diceIcon}>{result.icon}</Text>
        <Text style={styles.diceText}>{result.text}</Text>
    </LinearGradient>
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Practice conflict resolution with random scenarios! Constraints make communication more creative.</Text>
                </View>
            </View>
            
            <Header title="Conflict Dice Arena" />
            <View style={styles.gameLayout}>
                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.refereeSidebar}
                >
                    <Text style={styles.sidebarTitle}>Referee</Text>
                    <Text style={styles.refereeName}>Dr. Marcie Liss</Text>
                     <Text style={styles.refereeQuote}>"Use 'I feel' instead of 'You always' to avoid a yellow card."</Text>
                </LinearGradient>

                <ScrollView contentContainerStyle={styles.arena}>
                    <View style={styles.diceContainer}>
                        <Dice result={topic} color="#7f13ec" />
                        <Text style={styles.vs}>VS</Text>
                        <Dice result={constraint} color="#ec139e" />
                    </View>

                    <TouchableOpacity style={styles.rollButton} onPress={rollDice} disabled={isRolling}>
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.rollButtonText}>{isRolling ? 'ROLLING...' : 'ROLL DICE'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hallOfFameSidebar}
                >
                    <Text style={styles.sidebarTitle}>Hall of Fame</Text>
                    {/* Fame items would be populated from state */}
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0118' },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    gameLayout: { flexDirection: 'row', flex: 1 },
    refereeSidebar: { 
        width: 180, 
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hallOfFameSidebar: { 
        width: 180, 
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 18, 
        color: '#ffffff', 
        textAlign: 'center', 
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    refereeName: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textAlign: 'center', 
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    refereeQuote: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontStyle: 'italic', 
        textAlign: 'center', 
        marginTop: 10, 
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    arena: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    diceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
    dice: { 
        width: 160, 
        height: 160, 
        borderRadius: 32, 
        borderWidth: 4, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 10,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    diceIcon: { fontSize: 40, color: 'rgba(255,255,255,0.5)' },
    diceText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 20, 
        color: '#ffffff', 
        marginTop: 10, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    vs: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 40, 
        color: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    rollButton: { 
        paddingVertical: 15, 
        paddingHorizontal: 40, 
        borderRadius: 16,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 15,
    },
    rollButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 18, 
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});

export default ConflictDiceGameScreen;