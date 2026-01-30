
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const WaveformBar = ({ height }) => (
    <View style={[styles.waveformBar, { height }]} />
);

const LeaderboardDetail6Screen = () => {
    const waveformHeights = [48, 80, 128, 192, 96, 160, 224, 128, 256, 176, 208, 112, 192, 80, 144, 64, 32];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0508', '#12080d']} style={styles.background} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Venting Frequencies...</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>Private Session</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>Soundproof Booth</Text>
                <View style={styles.waveformContainer}>
                    {waveformHeights.map((h, i) => <WaveformBar key={i} height={h} />)}
                </View>
                <Text style={styles.quote}>"Speak your truth without filters. Let the nebula absorb the weight of your words."</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>Input Gain: 75%</Text>
                     <TouchableOpacity style={styles.releaseButton}>
                        <Text style={styles.releaseButtonText}>Release to Partner</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#12080d' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    headerTitle: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    headerButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerButtonText: { color: '#FFF', fontSize: 12 },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginBottom: 64 },
    waveformContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 256, gap: 6, marginBottom: 64 },
    waveformBar: {
        width: 4,
        backgroundColor: 'rgba(64, 224, 208, 0.6)',
        borderRadius: 2,
    },
    quote: { color: 'rgba(255,255,255,0.4)', fontSize: 18, fontStyle: 'italic', textAlign: 'center', maxWidth: 300 },
    footer: { padding: 16 },
    footerContent: { backgroundColor: 'rgba(26, 19, 23, 0.6)', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    footerText: { color: '#FFF' },
    releaseButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#40E0D0',
    },
    releaseButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default LeaderboardDetail6Screen;
