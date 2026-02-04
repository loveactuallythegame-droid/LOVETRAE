import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const SixSecondKissChallenge2 = () => {
    const [player1Hold, setPlayer1Hold] = useState(false);
    const [player2Hold, setPlayer2Hold] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const [connection, setConnection] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(c => Math.max(0, c - 0.01));
                setConnection(c => Math.min(100, c + 0.1));
            }, 10);
        } else if (countdown <= 0) {
            setIsRunning(false);
            setCountdown(0);
            setConnection(100);
        }
        return () => clearTimeout(timer);
    }, [isRunning, countdown]);

    useEffect(() => {
        setIsRunning(player1Hold && player2Hold);
    }, [player1Hold, player2Hold]);

    const PlayerTouchPoint = ({ player, onHold, isHolding }) => (
        <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.touchPoint, isHolding && styles.touchPointActive]}
        >
            <TouchableOpacity 
                style={styles.touchPointInner} 
                onPressIn={() => onHold(true)} 
                onPressOut={() => onHold(false)} 
                activeOpacity={0.8}
            >
                <Image 
                    style={styles.avatar} 
                    source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg'}} 
                />
                <View style={styles.touchIconContainer}>
                    <MaterialIcons name="back_hand" size={40} color="white" />
                </View>
            </TouchableOpacity>
            <Text style={styles.playerLabel}>{player} HOLD</Text>
        </LinearGradient>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181114', '#230f15']} style={styles.container}>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatarImg} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>Maintaining physical connection during this challenge helps strengthen emotional bonds. The 6-second rule is scientifically proven to deepen intimacy!</Text>
                    </View>
                </View>

                <Text style={styles.header}>The 6-Second Kiss</Text>
                <Text style={styles.subHeader}>Challenge Mode Activated</Text>

                <View style={styles.gameArea}>
                    <PlayerTouchPoint player="PLAYER 1" onHold={setPlayer1Hold} isHolding={player1Hold} />
                    
                    <View style={styles.centerSection}>
                        <LinearGradient
                            colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.timerCircle}
                        >
                            <Text style={styles.timerText}>{Math.ceil(countdown)}<Text style={styles.timerSec}>s</Text></Text>
                        </LinearGradient>
                        
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>Connection Strength</Text>
                            <LinearGradient
                                colors={['#db147c', '#f05d68']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.progressBarBg}
                            >
                                <View style={[styles.progressFill, {width: `${connection}%`}]}>
                                    <LinearGradient
                                        colors={['#ff7600', '#ffef1f']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.progressFillInner}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>

                    <PlayerTouchPoint player="PLAYER 2" onHold={setPlayer2Hold} isHolding={player2Hold} />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181114' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
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
    avatarImg: {
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
    header: { 
        color: '#fff', 
        fontSize: 36, 
        fontWeight: 'bold', 
        textShadowColor: '#ee2b8c', 
        textShadowRadius: 10,
        textShadowOffset: {width: 0, height: 0},
    },
    subHeader: { 
        color: '#db147c', 
        textTransform: 'uppercase', 
        letterSpacing: 3, 
        marginBottom: 40,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    gameArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    touchPoint: { 
        width: 140, 
        height: 140, 
        borderRadius: 70, 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    touchPointInner: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,72,0.2)'
    },
    touchPointActive: { 
        transform: [{ scale: 0.95 }],
        shadowColor: '#db147c',
        shadowRadius: 20, 
        elevation: 10 
    },
    avatar: { width: 120, height: 120, borderRadius: 60, opacity: 0.6 },
    touchIconContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    playerLabel: { 
        color: '#fff', 
        fontWeight: 'bold', 
        letterSpacing: 2, 
        textAlign: 'center', 
        marginTop: 16,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    centerSection: { alignItems: 'center', flex: 1, marginHorizontal: 20 },
    timerCircle: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        shadowColor: '#db147c', 
        shadowRadius: 20, 
        elevation: 10, 
        marginBottom: 32,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    timerText: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
    timerSec: { color: '#ff7600', fontSize: 24 },
    progressContainer: { width: '100%', alignItems: 'center' },
    progressLabel: { 
        color: 'rgba(255,255,255,0.6)', 
        textTransform: 'uppercase', 
        fontSize: 10, 
        letterSpacing: 2, 
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    progressBarBg: {
        height: 12, 
        width: '100%', 
        borderRadius: 6, 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    progressFill: { 
        height: '100%', 
        borderRadius: 6,
    },
    progressFillInner: {
        height: '100%', 
        borderRadius: 6,
    },
});

export default SixSecondKissChallenge2;