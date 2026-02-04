import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const SixSecondKissChallenge1 = () => {
    const [player1Hold, setPlayer1Hold] = useState(false);
    const [player2Hold, setPlayer2Hold] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 0.01), 10);
        } else if (countdown <= 0) {
            setIsRunning(false);
            setCountdown(0);
        } else {
            clearTimeout(timer);
        }
        return () => clearTimeout(timer);
    }, [isRunning, countdown]);

    useEffect(() => {
        if (player1Hold && player2Hold) {
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    }, [player1Hold, player2Hold]);

    const resetGame = () => {
        setPlayer1Hold(false);
        setPlayer2Hold(false);
        setIsRunning(false);
        setCountdown(6);
    };

    const TouchZone = ({ player, onHold, isHolding }) => (
        <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.touchZone, isHolding && styles.touchZoneActive]}
        >
            <TouchableOpacity
                style={styles.touchZoneInner}
                onPressIn={() => onHold(true)}
                onPressOut={() => onHold(false)}
            >
                <MaterialIcons name="touch_app" size={40} color={isHolding ? '#ffffff' : 'rgba(255,255,255,0.7)'} />
                <Text style={styles.touchZoneText}>{player}</Text>
                {isHolding && <Text style={styles.connectedText}>Connected</Text>}
            </TouchableOpacity>
        </LinearGradient>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.container}>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>Ready to share some intimate moments? The 6-second kiss challenge helps couples connect deeply through sustained eye contact and physical touch.</Text>
                    </View>
                </View>

                <Text style={styles.title}>6-Second Kiss Challenge</Text>
                <Text style={styles.subtitle}>Hold to ignite the spark</Text>

                <View style={styles.gameArea}>
                    <TouchZone player="Player 1" onHold={setPlayer1Hold} isHolding={player1Hold} />
                    
                    <View style={styles.timerContainer}>
                        <LinearGradient
                            colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.timerRing}
                        >
                            <Text style={styles.timer}>{countdown.toFixed(2)}</Text>
                            <Text style={styles.timerLabel}>Seconds</Text>
                        </LinearGradient>
                    </View>

                    <TouchZone player="Player 2" onHold={setPlayer2Hold} isHolding={player2Hold} />
                </View>

                {countdown === 0 &&
                    <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
                        <LinearGradient
                            colors={['#db147c', '#f05d68']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.resetButtonText}>Challenge Complete! Play Again?</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181116' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        width: '90%',
        alignSelf: 'center'
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
    title: { 
        color: '#fff', 
        fontSize: 36, 
        fontWeight: 'bold', 
        textAlign: 'center',
        textShadowColor: 'rgba(219, 20, 124, 0.7)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    subtitle: { 
        color: '#db147c', 
        fontSize: 18, 
        marginBottom: 48, 
        opacity: 0.8,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    gameArea: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        width: '100%',
        marginBottom: 30
    },
    touchZone: {
        width: 120, 
        height: 200, 
        borderRadius: 16, 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    touchZoneInner: { 
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20
    },
    touchZoneActive: { 
        transform: [{ scale: 1.05 }]
    },
    touchZoneText: { 
        color: 'rgba(255,255,255,0.8)', 
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 16
    },
    connectedText: { 
        color: '#ffffff', 
        marginTop: 8, 
        fontSize: 14, 
        fontWeight: 'bold',
        backgroundColor: 'rgba(219, 20, 124, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timerContainer: { 
        alignItems: 'center', 
        marginHorizontal: 24 
    },
    timerRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    timer: { 
        color: '#fff', 
        fontSize: 36, 
        fontWeight: 'bold' 
    },
    timerLabel: { 
        color: 'rgba(255,255,255,0.6)', 
        textTransform: 'uppercase', 
        letterSpacing: 2,
        fontSize: 12
    },
    resetButton: {
        marginTop: 48,
        width: '80%',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    resetButtonText: { 
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 16
    },
});

export default SixSecondKissChallenge1;