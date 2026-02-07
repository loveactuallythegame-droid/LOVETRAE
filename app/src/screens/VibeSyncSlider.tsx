
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const PARTNER_A_VALUE = 60;
const TOLERANCE = 10;

const VibeSyncSlider = () => {
    const [userValue, setUserValue] = useState(50);
    const [showResult, setShowResult] = useState(false);

    const isInSync = Math.abs(userValue - PARTNER_A_VALUE) <= TOLERANCE;

    const handleLockIn = () => {
        setShowResult(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>VIBE SYNC</Text>
                    <Text style={styles.headerSubtitle}>ALIGN YOUR ENERGY WITH YOUR PARTNER.</Text>
                </View>

                <View style={styles.gameArea}>
                    {/* Partner A (Hidden) */}
                    <View style={styles.playerColumn}>
                        <Text style={styles.playerName}>PARTNER A</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.shroud}>
                                <Text style={{fontSize: 40}}>🔒</Text>
                                <Text style={styles.shroudText}>VALUE HIDDEN</Text>
                            </View>
                        </View>
                        <Text style={styles.valueText}>??</Text>
                    </View>

                    {/* Sync Indicator */}
                    <View style={styles.syncIndicatorColumn}>
                         <View style={[styles.syncIndicator, showResult && { backgroundColor: isInSync ? '#00FFFF' : '#FF4081'}]}>
                            <Text style={{fontSize: 30}}>⚡️</Text>
                        </View>
                        {showResult && <Text style={{color: isInSync? '#00FFFF': '#FF4081', fontWeight: 'bold'}}>{isInSync ? 'IN SYNC' : 'MISALIGNED'}</Text>}
                    </View>

                    {/* User (Active) */}
                    <View style={styles.playerColumn}>
                        <Text style={[styles.playerName, { color: '#FF4081' }]}>YOUR VIBE</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{ height: 250, width: 50 }}
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                value={userValue}
                                onValueChange={setUserValue}
                                minimumTrackTintColor="#FF4081"
                                maximumTrackTintColor="rgba(0,0,0,0.3)"
                                thumbTintColor="#FF4081"
                                inverted
                            />
                        </View>
                        <Text style={styles.valueText}>{Math.round(userValue)}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.lockButton} onPress={handleLockIn}>
                    <Text style={{fontSize: 24}}>🔄</Text>
                    <Text style={styles.lockButtonText}>LOCK IN SYNC</Text>
                </TouchableOpacity>
                {showResult && <Text style={styles.resultDetailText}>PARTNER A'S VALUE WAS {PARTNER_A_VALUE}</Text>}

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    header: { alignItems: 'center', paddingVertical: 20 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
    gameArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', height: 400 },
    playerColumn: { alignItems: 'center', height: '100%', justifyContent: 'space-between' },
    playerName: { color: '#D1C4E9', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1.5 },
    sliderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: 80 },
    shroud: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    shroudText: { color: '#D1C4E9', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    valueText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    syncIndicatorColumn: { alignItems: 'center', justifyContent: 'center' },
    syncIndicator: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255, 64, 129, 0.5)' },
    lockButton: { flexDirection: 'row', backgroundColor: '#FF4081', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 20, alignItems: 'center', shadowColor: '#FF4081', shadowRadius: 10, shadowOpacity: 0.5 },
    lockButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8, textTransform: 'uppercase' },
    resultDetailText: { color: '#D1C4E9', marginTop: 10, fontWeight: 'bold', textTransform: 'uppercase' }
});

export default VibeSyncSlider;
