
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ManeuverButton = ({ icon, text, isActive }) => (
    <TouchableOpacity style={[styles.maneuver, isActive && styles.maneuverActive]}>
        {/* Icon would go here */}
        <Text style={styles.maneuverText}>{text}</Text>
    </TouchableOpacity>
);

const HarborMastersChallengeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#111817', '#1a1a1a']} style={styles.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Harbor Master's Challenge</Text>
            </View>

            <ScrollView contentContainerStyle={styles.mainContent}>
                <View style={styles.stormBanner}>
                    <Text style={styles.stormTitle}>Storm Level: High Intensity</Text>
                    <Text style={styles.stormSubtitle}>Emotional turbulence detected.</Text>
                    <View style={styles.stormMeter}>
                        <View style={styles.stormMeterFill} />
                    </View>
                </View>

                <View style={styles.dashboard}>
                    <View style={styles.stormVisualizer}>
                        <Text style={styles.visualizerText}>Maneuver Required</Text>
                    </View>

                    <View style={styles.maneuverWheel}>
                        <Text style={styles.wheelTitle}>Maneuver Wheel</Text>
                        <View style={styles.wheelGrid}>
                            <ManeuverButton icon="air" text="Deep Breathing" isActive={true} />
                            <ManeuverButton icon="vibration" text="Grounding" />
                            <ManeuverButton icon="favorite" text="Affirmation" />
                            <ManeuverButton icon="visibility" text="Sensing" />
                            <ManeuverButton icon="music_note" text="Auditory Calm" />
                            <ManeuverButton icon="self_improvement" text="Muscle Focus" />
                        </View>
                    </View>
                </View>

                 <View style={styles.footerBar}>
                    <Text style={styles.footerText}>Co-regulation Active</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111817' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, borderBottomWidth: 1, borderColor: '#283938', backgroundColor: 'rgba(26, 35, 34, 0.8)' },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    mainContent: { padding: 16 },
    stormBanner: { backgroundColor: 'rgba(26, 35, 34, 0.8)', padding: 16, borderRadius: 12, marginBottom: 16 },
    stormTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    stormSubtitle: { color: '#9cbab7', marginTop: 4 },
    stormMeter: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginTop: 8 },
    stormMeterFill: { height: '100%', width: '85%', backgroundColor: '#ff005e', borderRadius: 4 },
    dashboard: { flexDirection: 'row', gap: 16, flex: 1 },
    stormVisualizer: { flex: 2, backgroundColor: 'rgba(26, 35, 34, 0.8)', borderRadius: 12, justifyContent: 'flex-end', padding: 16 },
    visualizerText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    maneuverWheel: { flex: 1, backgroundColor: 'rgba(26, 35, 34, 0.8)', borderRadius: 12, padding: 16 },
    wheelTitle: { color: '#ff005e', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
    wheelGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    maneuver: { width: '48%', aspectRatio: 1, backgroundColor: 'rgba(26, 35, 34, 0.8)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(13, 242, 223, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    maneuverActive: { borderColor: '#ff005e', shadowColor: '#ff005e', shadowRadius: 10, shadowOpacity: 0.4 },
    maneuverText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
    footerBar: { backgroundColor: 'rgba(26, 35, 34, 0.8)', padding: 12, borderRadius: 12, marginTop: 16 },
    footerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default HarborMastersChallengeScreen;
