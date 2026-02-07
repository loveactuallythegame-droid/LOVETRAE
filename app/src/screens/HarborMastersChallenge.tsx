
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ManeuverButton = ({ icon, text, isActive }) => (
    <TouchableOpacity style={[styles.maneuver, isActive && styles.maneuverActive]}>
        <Text style={styles.maneuverIcon}>{icon}</Text>
        <Text style={styles.maneuverText}>{text}</Text>
    </TouchableOpacity>
);

const HarborMastersChallengeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>HARBOR MASTER'S CHALLENGE</Text>
            </View>

            <ScrollView contentContainerStyle={styles.mainContent}>
                <View style={styles.stormBanner}>
                    <Text style={styles.stormTitle}>STORM LEVEL: HIGH INTENSITY</Text>
                    <Text style={styles.stormSubtitle}>Emotional turbulence detected.</Text>
                    <View style={styles.stormMeter}>
                        <LinearGradient
                            colors={['#FF4081', '#E040FB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.stormMeterFill} />
                    </View>
                </View>

                <View style={styles.dashboard}>
                    <View style={styles.stormVisualizer}>
                        <Text style={styles.visualizerText}>MANEUVER REQUIRED</Text>
                    </View>

                    <View style={styles.maneuverWheel}>
                        <Text style={styles.wheelTitle}>MANEUVER WHEEL</Text>
                        <View style={styles.wheelGrid}>
                            <ManeuverButton icon="💨" text="DEEP BREATHING" isActive={true} />
                            <ManeuverButton icon="👣" text="GROUNDING" />
                            <ManeuverButton icon="💖" text="AFFIRMATION" />
                            <ManeuverButton icon="👁️" text="SENSING" />
                            <ManeuverButton icon="🎶" text="AUDITORY CALM" />
                            <ManeuverButton icon="💪" text="MUSCLE FOCUS" />
                        </View>
                    </View>
                </View>

                 <View style={styles.footerBar}>
                    <Text style={styles.footerText}>CO-REGULATION ACTIVE</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
    mainContent: { padding: 16 },
    stormBanner: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    stormTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    stormSubtitle: { color: '#D1C4E9', marginTop: 4 },
    stormMeter: { height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4, marginTop: 8 },
    stormMeterFill: { height: '100%', width: '85%', borderRadius: 4 },
    dashboard: { flexDirection: 'row', gap: 16, flex: 1 },
    stormVisualizer: { flex: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, justifyContent: 'flex-end', padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    visualizerText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    maneuverWheel: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    wheelTitle: { color: '#FF4081', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
    wheelGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    maneuver: { width: '48%', aspectRatio: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    maneuverActive: { borderColor: '#FF4081', shadowColor: '#FF4081', shadowRadius: 10, shadowOpacity: 0.4 },
    maneuverIcon: { fontSize: 24 },
    maneuverText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 4, textTransform: 'uppercase' },
    footerBar: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 12, borderRadius: 20, marginTop: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    footerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
});

export default HarborMastersChallengeScreen;
