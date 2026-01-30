
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
            {/* Icon can go here */}
        </View>
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.progressText}>{progress}% to Next Level</Text>
    </View>
);

const MissionSuccessScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#0a0508', '#1a1317']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.headerContainer}>
                    <Text style={styles.missionStatus}>Mission Status: Success</Text>
                    <Text style={styles.mainTitle}>MISSION ACCOMPLISHED</Text>
                    <Text style={styles.subtitle}>You navigated the asteroid field of emotions together.</Text>
                </View>

                <View style={styles.badgeContainer}>
                    <LinearGradient colors={['#1a1317', '#230f19']} style={styles.badge}>
                        {/* Icon would be here */}
                        <Text style={styles.badgeTitle}>Conflict Neutralized</Text>
                        <Text style={styles.badgeSubtitle}>Core Stabilized</Text>
                    </LinearGradient>
                </View>

                <View style={styles.statsGrid}>
                    <StatBar label="Trust XP Earned" value="+850 XP" progress={75} color="#00f5d4" />
                    <StatBar label="Relationship Level" value="LVL 42" progress={40} color="#9d4edd" />
                </View>

                <TouchableOpacity style={styles.dashboardButton}>
                    <Text style={styles.dashboardButtonText}>Return to Dashboard</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0508' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    headerContainer: { alignItems: 'center', marginBottom: 32 },
    missionStatus: { color: '#00f5d4', backgroundColor: 'rgba(0, 245, 212, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, textTransform: 'uppercase', fontSize: 10, letterSpacing: 2, marginBottom: 16 },
    mainTitle: { color: '#FFF', fontSize: 40, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', letterSpacing: -1 },
    subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 8 },
    badgeContainer: { marginBottom: 32 },
    badge: { width: 250, height: 250, borderRadius: 125, borderWidth: 4, borderColor: '#fc0c84', justifyContent: 'center', alignItems: 'center', shadowColor: '#fc0c84', shadowRadius: 20, shadowOpacity: 0.6 },
    badgeTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', textTransform: 'uppercase' },
    badgeSubtitle: { color: '#fc0c84', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    statsGrid: { width: '100%', flexDirection: 'row', gap: 16, marginBottom: 32 },
    statContainer: { flex: 1, backgroundColor: 'rgba(26, 19, 23, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    statLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
    statValue: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
    progressBarContainer: { height: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: 4 },
    progressBar: { height: '100%', borderRadius: 6 },
    progressText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' },
    dashboardButton: { backgroundColor: '#ff9100', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 99, shadowColor: '#ff9100', shadowRadius: 15, shadowOpacity: 0.4 },
    dashboardButtonText: { color: '#000', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
});

export default MissionSuccessScreen;
