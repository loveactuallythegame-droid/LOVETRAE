
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LeaderboardDetail5Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            
            <View style={styles.header}>
                 <TouchableOpacity>
                    <Text style={styles.headerBack}>ABORT REPAIR</Text>
                 </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>PHASE 04: EMOTIONAL RE-ENTRY</Text>
                    {/* Progress dots */}
                </View>
                <Text style={styles.headerStatus}>98.4%</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>REFLECTIVE LISTENING</Text>
                <Text style={styles.subtitle}>Take turns repeating what you heard your partner say before responding.</Text>

                <View style={styles.timerContainer}>
                    <View style={styles.timerRing} />
                    <Text style={styles.timerText}>04:42</Text>
                    <Text style={styles.timerStatus}>CONNECTION IN PROGRESS...</Text>
                </View>

                {/* Floating panels would be positioned with absolute layout */}
            </View>

            <View style={styles.footer}>
                <View style={styles.speakerListenerContainer}>
                    {/* Speaker and Listener cards */}
                </View>
                 <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>NEXT STEP</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
    headerBack: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    headerTitleContainer: { alignItems: 'center' },
    headerTitle: { color: '#FFF', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    headerStatus: { color: '#00FFFF', fontWeight: 'bold' },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', maxWidth: 300 },
    timerContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 48 },
    timerRing: {
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 15,
        borderColor: '#00FFFF',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        transform: [{rotate: '45deg'}],
        position: 'absolute',
        opacity: 0.8
    },
    timerText: { fontSize: 72, fontWeight: 'bold', color: '#FFF' },
    timerStatus: { color: '#00FFFF', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
    speakerListenerContainer: { flexDirection: 'row', gap: 16 },
    nextButton: { backgroundColor: '#FF4081', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' }
});

export default LeaderboardDetail5Screen;
