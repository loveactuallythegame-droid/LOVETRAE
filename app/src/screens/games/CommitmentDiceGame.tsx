import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const actions = [{icon: 'local_florist', text: 'BUY FLOWERS'}, {icon: 'restaurant', text: 'COOK DINNER'}, {icon: 'volunteer_activism', text: 'GIVE MASSAGE'}];
const subjects = [{icon: 'kitchen', text: 'FOR KITCHEN'}, {icon: 'weekend', text: 'FOR THE WEEKEND'}, {icon: 'schedule', text: 'FOR 20 MINUTES'}];
const reasons = ['"Because you tolerate my snoring"', '"Because you are my everything"', '"Because I love you"' ];

const Dice = ({ result }: { result: {icon: string, text: string} }) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dice}
    >
        <Text style={styles.diceIcon}>{result.icon}</Text>
        <Text style={styles.diceText}>{result.text}</Text>
    </LinearGradient>
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Roll the dice for random acts of commitment! Small gestures build lasting bonds.</Text>
                </View>
            </View>
            
            <Header title="Commitment Dice" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.diceContainer}>
                    <Dice result={action} />
                    <Text style={styles.plus}>+</Text>
                    <Dice result={subject} />
                </View>

                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.reasonCard}
                >
                    <Text style={styles.reasonLabel}>The Reason</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                    <TouchableOpacity style={styles.rollButton} onPress={rollDice} disabled={isRolling}>
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.rollButtonText}>{isRolling ? 'ROLLING...' : 'ROLL AGAIN'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
                
                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hostContainer}
                >
                    <Text style={styles.hostQuote}>"Try to make it look like you mean it, darling!"</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </LinearGradient>

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
    content: { padding: 20, alignItems: 'center' },
    diceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    dice: { 
        width: 140, 
        height: 140, 
        borderRadius: 24, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal: 15, 
        borderWidth: 2, 
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    diceIcon: { fontSize: 40, color: '#ffffff' },
    diceText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 14, 
        color: '#ffffff', 
        marginTop: 10, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    plus: { fontSize: 30, color: 'rgba(255,255,255,0.2)' },
    reasonCard: { 
        padding: 20, 
        borderRadius: 16, 
        width: '100%', 
        alignItems: 'center', 
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    reasonLabel: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        letterSpacing: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    reasonText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 22, 
        fontStyle: 'italic', 
        marginVertical: 15, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
    },
    rollButton: { 
        paddingVertical: 12, 
        paddingHorizontal: 30, 
        borderRadius: 12,
        marginTop: 10,
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
        borderRadius: 12,
        paddingVertical: 12,
    },
    rollButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    hostContainer: { 
        alignItems: 'center', 
        marginBottom: 30,
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hostQuote: { 
        color: '#ffffff', 
        padding: 10, 
        borderRadius: 10, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    hostName: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    logContainer: { width: '100%' },
    logTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#ffffff', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
});

export default CommitmentDiceGameScreen;