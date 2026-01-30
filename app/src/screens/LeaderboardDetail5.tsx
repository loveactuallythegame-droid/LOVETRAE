
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const StatCard = ({ icon, label, value }) => (
    <View style={styles.statCard}>
        {/* Icon would go here */}
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const LeaderboardDetail5Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0508', '#160d14']} style={styles.background} />
            
            <View style={styles.header}>
                 <TouchableOpacity>
                    <Text style={styles.headerBack}>Abort Repair</Text>
                 </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Phase 04: Emotional Re-entry</Text>
                    {/* Progress dots */}
                </View>
                <Text style={styles.headerStatus}>98.4%</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>Reflective Listening</Text>
                <Text style={styles.subtitle}>Take turns repeating what you heard your partner say before responding.</Text>

                <View style={styles.timerContainer}>
                    <View style={styles.timerRing} />
                    <Text style={styles.timerText}>04:42</Text>
                    <Text style={styles.timerStatus}>Connection in progress...</Text>
                </View>

                {/* Floating panels would be positioned with absolute layout */}
            </View>

            <View style={styles.footer}>
                <View style={styles.speakerListenerContainer}>
                    {/* Speaker and Listener cards */}
                </View>
                 <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next Step</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#160d14' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerBack: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: 10 },
    headerTitleContainer: { alignItems: 'center' },
    headerTitle: { color: '#FFF', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    headerStatus: { color: '#40E0D0', fontWeight: 'bold' },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 300 },
    timerContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 48 },
    timerRing: {
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 15,
        borderColor: '#40E0D0',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        transform: [{rotate: '45deg'}],
        position: 'absolute',
        opacity: 0.8
    },
    timerText: { fontSize: 72, fontWeight: 'bold', color: '#FFF' },
    timerStatus: { color: '#40E0D0', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    speakerListenerContainer: { flexDirection: 'row', gap: 16 },
    nextButton: { backgroundColor: '#fc0c84', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default LeaderboardDetail5Screen;
