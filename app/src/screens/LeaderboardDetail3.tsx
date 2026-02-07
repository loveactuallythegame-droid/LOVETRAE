
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const StatBar = ({ label, value, progress, color, icon }) => (
    <View style={styles.statContainer}>
        <View style={styles.statHeader}>
            <View>
                <Text style={[styles.statLabel, { color }]}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
            <Text style={{fontSize: 30}}>{icon}</Text>
        </View>
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.progressText}>{progress}% TO NEXT LEVEL</Text>
    </View>
);

const MissionSuccessScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.headerContainer}>
                    <Text style={styles.missionStatus}>MISSION STATUS: SUCCESS</Text>
                    <Text style={styles.mainTitle}>MISSION ACCOMPLISHED</Text>
                    <Text style={styles.subtitle}>You navigated the asteroid field of emotions together.</Text>
                </View>

                <View style={styles.badgeContainer}>
                    <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.badge}>
                        <Text style={{fontSize: 80}}>🏆</Text>
                        <Text style={styles.badgeTitle}>CONFLICT NEUTRALIZED</Text>
                        <Text style={styles.badgeSubtitle}>CORE STABILIZED</Text>
                    </LinearGradient>
                </View>

                <View style={styles.statsGrid}>
                    <StatBar label="TRUST XP EARNED" value="+850 XP" progress={75} color="#00FFFF" icon="🤝"/>
                    <StatBar label="RELATIONSHIP LEVEL" value="LVL 42" progress={40} color="#FFD700" icon="❤️"/>
                </View>

                <TouchableOpacity style={styles.dashboardButton}>
                    <Text style={styles.dashboardButtonText}>RETURN TO DASHBOARD</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    headerContainer: { alignItems: 'center', marginBottom: 32 },
    missionStatus: { color: '#00FFFF', backgroundColor: 'rgba(0, 255, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, textTransform: 'uppercase', fontSize: 10, letterSpacing: 2, marginBottom: 16, fontWeight: 'bold' },
    mainTitle: { color: '#FFF', fontSize: 40, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', letterSpacing: -1, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', fontSize: 16, marginTop: 8 },
    badgeContainer: { marginBottom: 32 },
    badge: { width: 250, height: 250, borderRadius: 125, borderWidth: 4, borderColor: '#FF4081', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF4081', shadowRadius: 20, shadowOpacity: 0.6 },
    badgeTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', textTransform: 'uppercase', marginTop: 8 },
    badgeSubtitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    statsGrid: { width: '100%', flexDirection: 'row', gap: 16, marginBottom: 32 },
    statContainer: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    statLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' },
    statValue: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
    progressBarContainer: { height: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6, marginBottom: 4 },
    progressBar: { height: '100%', borderRadius: 6 },
    progressText: { color: '#D1C4E9', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    dashboardButton: { backgroundColor: '#FF4081', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 99, shadowColor: '#FF4081', shadowRadius: 15, shadowOpacity: 0.4 },
    dashboardButtonText: { color: '#FFF', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
});

export default MissionSuccessScreen;
