
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const StatCard = ({ icon, label, value, subValue, barPercentage }) => (
    <View style={styles.statCard}>
        <View style={styles.statHeader}>
            <Text style={{fontSize: 20}}>{icon}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
        <View style={styles.statContent}>
            <Text style={styles.statValue}>{value}</Text>
            {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
            {barPercentage && (
                <View style={styles.statBarContainer}>
                    <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.statBar, { width: `${barPercentage}%` }]} />
                </View>
            )}
        </View>
    </View>
);

const MicroBetrayalMiniGolfGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.statsRow}>
                    <StatCard icon="❤️" label="TRUST POINTS" value="1,850" subValue="+15%" />
                    <StatCard icon="🔗" label="CONNECTION LEVEL" value="LVL 4" barPercentage={40} />
                    <StatCard icon="⛳" label="CURRENT STROKE" value="02" subValue="PAR 3" />
                </View>

                <View style={styles.gameContainer}>
                    <View style={styles.golfCourse}>
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
                                <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.powerMeterFill} />
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
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16, gap: 8 },
    statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    statHeader: { flexDirection: 'row', alignItems: 'center', opacity: 0.8 },
    statLabel: { color: '#D1C4E9', marginLeft: 8, textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    statContent: { marginTop: 8 },
    statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    statSubValue: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
    statBarContainer: { height: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2, marginTop: 4 },
    statBar: { height: '100%' },
    gameContainer: { flexDirection: 'row', height: 350 },
    golfCourse: { flex: 3, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255, 64, 129, 0.5)', position: 'relative' },
    tee: { position: 'absolute', left: 20, top: '45%', width: 60, height: 40, borderTopWidth:1, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.4)' },
    ball: { position: 'absolute', left: '25%', top: '50%', width: 20, height: 20, backgroundColor: '#FFF', borderRadius: 10, shadowColor: '#FFF', shadowRadius: 8, shadowOpacity: 1 },
    hazard: { position: 'absolute', right: '30%', top: '20%', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255, 64, 129, 0.3)', borderWidth: 1, borderColor: '#FF4081', justifyContent: 'center', alignItems: 'center' },
    hazardText: { color: '#FF4081', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    ramp: { position: 'absolute', right: '40%', bottom: '15%', width: 80, height: 30, backgroundColor: 'rgba(0, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', transform: [{rotate: '-15deg'}] },
    rampText: { color: '#00FFFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    hole: { position: 'absolute', right: 20, top: '48%', width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', borderWidth: 2, borderColor: '#FF4081' },
    controlsSidebar: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
    powerMeterContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    powerMeterLabel: { color: '#FFF', textTransform: 'uppercase', fontSize: 10, opacity: 0.5, fontWeight: 'bold' },
    powerMeterTrack: { width: 30, height: 150, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, justifyContent: 'flex-end' },
    powerMeterFill: { height: '65%', borderRadius: 15 },
    powerMeterValue: { color: '#FF4081', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
    actionButton: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { color: '#000', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default MicroBetrayalMiniGolfGame;
