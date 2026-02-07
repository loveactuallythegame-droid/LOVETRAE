
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
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>VENTING FREQUENCIES...</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>PRIVATE SESSION</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>SOUNDPROOF BOOTH</Text>
                <View style={styles.waveformContainer}>
                    {waveformHeights.map((h, i) => <WaveformBar key={i} height={h} />)}
                </View>
                <Text style={styles.quote}>"Speak your truth without filters. Let the nebula absorb the weight of your words."</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>INPUT GAIN: 75%</Text>
                     <TouchableOpacity style={styles.releaseButton}>
                        <Text style={styles.releaseButtonText}>RELEASE TO PARTNER</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)'},
    headerTitle: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    headerButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    headerButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginBottom: 64, textTransform: 'uppercase' },
    waveformContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 256, gap: 6, marginBottom: 64 },
    waveformBar: {
        width: 4,
        backgroundColor: '#00FFFF',
        borderRadius: 2,
    },
    quote: { color: '#D1C4E9', fontSize: 18, fontStyle: 'italic', textAlign: 'center', maxWidth: 300 },
    footer: { padding: 16 },
    footerContent: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    footerText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    releaseButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: '#00FFFF',
    },
    releaseButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});

export default LeaderboardDetail6Screen;
