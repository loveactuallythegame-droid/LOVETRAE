
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity
            style={[styles.touchZone, isHolding && styles.touchZoneActive]}
            onPressIn={() => onHold(true)}
            onPressOut={() => onHold(false)}
        >
            <MaterialIcons name="touch_app" size={40} color={isHolding ? '#ff006d' : 'rgba(255,255,255,0.4)'} />
            <Text style={styles.touchZoneText}>{player}</Text>
            {isHolding && <Text style={styles.connectedText}>Connected</Text>}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.container}>
                <Text style={styles.title}>6-Second Kiss Challenge</Text>
                <Text style={styles.subtitle}>Hold to ignite the spark</Text>

                <View style={styles.gameArea}>
                    <TouchZone player="Player 1" onHold={setPlayer1Hold} isHolding={player1Hold} />
                    
                    <View style={styles.timerContainer}>
                        <Text style={styles.timer}>{countdown.toFixed(2)}</Text>
                        <Text style={styles.timerLabel}>Seconds</Text>
                    </View>

                    <TouchZone player="Player 2" onHold={setPlayer2Hold} isHolding={player2Hold} />
                </View>

                {countdown === 0 &&
                    <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
                        <Text style={styles.resetButtonText}>Challenge Complete! Play Again?</Text>
                    </TouchableOpacity>
                }

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181116' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    title: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#ff006d', fontSize: 18, marginBottom: 48, opacity: 0.8 },
    gameArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' },
    touchZone: { width: 120, height: 200, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
    touchZoneActive: { borderColor: '#ff006d', backgroundColor: 'rgba(255, 0, 109, 0.1)' },
    touchZoneText: { color: 'rgba(255,255,255,0.6)', marginTop: 8 },
    connectedText: { color: '#ff006d', marginTop: 8, fontSize: 12, fontWeight: 'bold' },
    timerContainer: { alignItems: 'center', marginHorizontal: 24 },
    timer: { color: '#fff', fontSize: 64, fontWeight: 'bold' },
    timerLabel: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2 },
    resetButton: { marginTop: 48, padding: 16, backgroundColor: '#ff006d', borderRadius: 12 },
    resetButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default SixSecondKissChallenge1;
