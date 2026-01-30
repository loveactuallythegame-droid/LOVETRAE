
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const StatCard = ({ icon, label, value, subValue, barPercentage }) => (
    <View style={styles.statCard}>
        <View style={styles.statHeader}>
            <MaterialIcons name={icon} size={20} color="#ff034a" />
            <Text style={styles.statLabel}>{label}</Text>
        </View>
        <View style={styles.statContent}>
            <Text style={styles.statValue}>{value}</Text>
            {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
            {barPercentage && (
                <View style={styles.statBarContainer}>
                    <View style={[styles.statBar, { width: `${barPercentage}%` }]} />
                </View>
            )}
        </View>
    </View>
);

const MicroBetrayalMiniGolfGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#191022', '#2a1b3d']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.statsRow}>
                    <StatCard icon="favorite" label="Trust Points" value="1,850" subValue="+15%" />
                    <StatCard icon="hub" label="Connection Level" value="Lvl 4" barPercentage={40} />
                    <StatCard icon="golf-course" label="Current Stroke" value="02" subValue="Par 3" />
                </View>

                <View style={styles.gameContainer}>
                    <View style={styles.golfCourse}>
                        {/* Game Elements: Ball, Hole, Hazards */}
                        <View style={styles.tee} />
                        <View style={styles.ball} />
                        <View style={styles.hazard}><Text style={styles.hazardText}>HAZARD</Text></View>
                        <View style={styles.ramp}><Text style={styles.rampText}>RAMP</Text></View>
                        <View style={styles.hole} />
                    </View>
                    <View style={styles.controlsSidebar}>
                        <View style={styles.powerMeterContainer}>
                            <Text style={styles.powerMeterLabel}>POWER</Text>
                            <View style={styles.powerMeterTrack}>
                                <View style={styles.powerMeterFill} />
                            </View>
                            <Text style={styles.powerMeterValue}>65%</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>TAKE SHOT</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f15' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
    statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginHorizontal: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statHeader: { flexDirection: 'row', alignItems: 'center', opacity: 0.8 },
    statLabel: { color: '#FFF', marginLeft: 8, textTransform: 'uppercase', fontSize: 10 },
    statContent: { marginTop: 8 },
    statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    statSubValue: { color: '#4ade80', fontSize: 12 },
    statBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 },
    statBar: { height: '100%', backgroundColor: '#ff034a' },
    gameContainer: { flexDirection: 'row', height: 350 },
    golfCourse: { flex: 3, backgroundColor: 'black', borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)', position: 'relative' },
    tee: { position: 'absolute', left: 20, top: '45%', width: 60, height: 40, borderTopWidth:1, borderBottomWidth: 1, borderColor: 'rgba(255,3,74,0.4)' },
    ball: { position: 'absolute', left: '25%', top: '50%', width: 20, height: 20, backgroundColor: '#FFF', borderRadius: 10, shadowColor: '#FFF', shadowRadius: 8, shadowOpacity: 1 },
    hazard: { position: 'absolute', right: '30%', top: '20%', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(236,19,127,0.3)', borderWidth: 1, borderColor: '#ec4899', justifyContent: 'center', alignItems: 'center' },
    hazardText: { color: '#ec4899', fontSize: 10, fontWeight: 'bold' },
    ramp: { position: 'absolute', right: '40%', bottom: '15%', width: 80, height: 30, backgroundColor: 'rgba(74,222,128,0.2)', justifyContent: 'center', alignItems: 'center', transform: [{rotate: '-15deg'}] },
    rampText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold' },
    hole: { position: 'absolute', right: 20, top: '48%', width: 24, height: 24, borderRadius: 12, backgroundColor: 'black', borderWidth: 2, borderColor: '#ff034a' },
    controlsSidebar: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
    powerMeterContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    powerMeterLabel: { color: '#FFF', textTransform: 'uppercase', fontSize: 10, opacity: 0.5 },
    powerMeterTrack: { width: 30, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, justifyContent: 'flex-end' },
    powerMeterFill: { height: '65%', backgroundColor: '#ff034a', borderRadius: 15 },
    powerMeterValue: { color: '#ff034a', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
    actionButton: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { color: '#000', fontWeight: 'bold' },
});

export default MicroBetrayalMiniGolfGame;
