
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';

const PARTNER_A_VALUE = 60; // Hidden value
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
            <LinearGradient colors={['#0d0812', '#1a1122']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Vibe Sync</Text>
                    <Text style={styles.headerSubtitle}>Align your energy with your partner.</Text>
                </View>

                <View style={styles.gameArea}>
                    {/* Partner A (Hidden) */}
                    <View style={styles.playerColumn}>
                        <Text style={styles.playerName}>Partner A</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.shroud}>
                                <MaterialIcons name="lock" size={40} color="rgba(255,255,255,0.4)" />
                                <Text style={styles.shroudText}>Value Hidden</Text>
                            </View>
                        </View>
                        <Text style={styles.valueText}>??</Text>
                    </View>

                    {/* Sync Indicator */}
                    <View style={styles.syncIndicatorColumn}>
                         <View style={[styles.syncIndicator, showResult && { backgroundColor: isInSync ? '#40e0d0' : '#f80b5a'}]}>
                            <MaterialIcons name="flare" size={30} color="#fff" />
                        </View>
                        {showResult && <Text style={{color: isInSync? '#40e0d0': '#f80b5a', fontWeight: 'bold'}}>{isInSync ? 'IN SYNC' : 'MISALIGNED'}</Text>}
                    </View>

                    {/* User (Active) */}
                    <View style={styles.playerColumn}>
                        <Text style={[styles.playerName, { color: '#f80b5a' }]}>Your Vibe</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{ height: 250, width: 50 }}
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                value={userValue}
                                onValueChange={setUserValue}
                                minimumTrackTintColor="#f80b5a"
                                maximumTrackTintColor="#362348"
                                thumbTintColor="#f80b5a"
                                inverted
                            />
                        </View>
                        <Text style={styles.valueText}>{Math.round(userValue)}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.lockButton} onPress={handleLockIn}>
                    <MaterialIcons name="sync" size={24} color="#fff" />
                    <Text style={styles.lockButtonText}>LOCK IN SYNC</Text>
                </TouchableOpacity>
                {showResult && <Text style={styles.resultDetailText}>Partner A's value was {PARTNER_A_VALUE}</Text>}

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0d0812' },
    container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    header: { alignItems: 'center', paddingVertical: 20 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { color: '#ad92c9', fontSize: 16 },
    gameArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', height: 400 },
    playerColumn: { alignItems: 'center', height: '100%', justifyContent: 'space-between' },
    playerName: { color: '#ad92c9', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1.5 },
    sliderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: 80 },
    shroud: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(127, 19, 236, 0.4)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    shroudText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
    valueText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    syncIndicatorColumn: { alignItems: 'center', justifyContent: 'center' },
    syncIndicator: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
    lockButton: { flexDirection: 'row', backgroundColor: '#f80b5a', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#f80b5a', shadowRadius: 10, shadowOpacity: 0.5 },
    lockButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    resultDetailText: { color: '#ad92c9', marginTop: 10 }
});

export default VibeSyncSlider;
