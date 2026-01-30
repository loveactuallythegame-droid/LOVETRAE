
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
        <TouchableOpacity onPressIn={() => onHold(true)} onPressOut={() => onHold(false)} activeOpacity={0.8}>
            <View style={[styles.touchPoint, isHolding && styles.touchPointActive]}>
                 {/* In a real app, Image source would be dynamic */}
                <Image 
                    style={styles.avatar} 
                    source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg'}} 
                />
                <View style={styles.touchIconContainer}>
                    <MaterialIcons name="back_hand" size={40} color="white" />
                </View>
            </View>
            <Text style={styles.playerLabel}>{player} HOLD</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181114', '#230f15']} style={styles.container}>
                <Text style={styles.header}>The 6-Second Kiss</Text>
                <Text style={styles.subHeader}>Challenge Mode Activated</Text>

                <View style={styles.gameArea}>
                    <PlayerTouchPoint player="PLAYER 1" onHold={setPlayer1Hold} isHolding={player1Hold} />
                    
                    <View style={styles.centerSection}>
                        <View style={styles.timerCircle}>
                            <Text style={styles.timerText}>{Math.ceil(countdown)}<Text style={styles.timerSec}>s</Text></Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>Connection Strength</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, {width: `${connection}%`}]} />
                            </View>
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
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textShadowColor: '#ee2b8c', textShadowRadius: 10 },
    subHeader: { color: '#ff0048', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 40 },
    gameArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    touchPoint: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,0,72,0.2)', borderWidth: 4, borderColor: 'rgba(255,0,72,0.4)', justifyContent: 'center', alignItems: 'center' },
    touchPointActive: { transform: [{ scale: 0.95 }], shadowColor: '#ee2b8c', shadowRadius: 20, elevation: 10 },
    avatar: { width: 120, height: 120, borderRadius: 60, opacity: 0.6 },
    touchIconContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    playerLabel: { color: '#fff', fontWeight: 'bold', letterSpacing: 2, textAlign: 'center', marginTop: 16 },
    centerSection: { alignItems: 'center', flex: 1, marginHorizontal: 20 },
    timerCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#230f15', borderWidth: 4, borderColor: '#ff0048', justifyContent: 'center', alignItems: 'center', shadowColor: '#ee2b8c', shadowRadius: 20, elevation: 10, marginBottom: 32 },
    timerText: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
    timerSec: { color: '#ff0048', fontSize: 24 },
    progressContainer: { width: '100%', alignItems: 'center' },
    progressLabel: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
    progressBar: { height: 12, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#ff0048', borderRadius: 6 },
});

export default SixSecondKissChallenge2;
