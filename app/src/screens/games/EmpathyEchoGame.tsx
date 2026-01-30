
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const WaveformBar = ({ height, color }: { height: number, color: string }) => (
    <View style={{ height, width: 4, backgroundColor: color, borderRadius: 2, marginHorizontal: 2 }} />
);

const EmpathyEchoGameScreen = () => {
    const partnerAWave = [8, 12, 20, 32, 24, 40, 28, 16, 36, 20, 12, 8];
    const partnerBWave = [10, 24, 48, 32, 20, 40, 16];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#101322', '#221017']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Empathy Echo</Text>
                    <Text style={styles.headerSubtitle}>Phase: Validation</Text>
                </View>

                <View style={styles.gameLayout}>
                    {/* Partner A Panel */}
                    <View style={styles.partnerPanel}>
                        <Text style={styles.panelTitle}>Partner A's Heart</Text>
                        <View style={styles.waveformContainer}>
                            {partnerAWave.map((h, i) => <WaveformBar key={i} height={h * 2} color="#2dd4bf" />)}
                        </View>
                        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#2dd4bf' }]}>
                             {/* Play Icon */}
                        </TouchableOpacity>
                    </View>

                    {/* Partner B Panel */}
                    <View style={[styles.partnerPanel, { borderColor: '#a855f7' }]}>
                        <Text style={styles.panelTitle}>Your Echo</Text>
                        <View style={styles.waveformContainer}>
                            {partnerBWave.map((h, i) => <WaveformBar key={i} height={h * 1.5} color="#a855f7" />)}
                        </View>
                        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#a855f7' }]}>
                            {/* Stop Icon */}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.gaugeContainer}>
                    <Text style={styles.gaugeScore}>Empathy Score: 72</Text>
                    <Text style={styles.gaugeFeedback}>"You're drifting toward 'fixing'. Try acknowledging the feeling without offering a solution yet."</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.actionButton}><Text style={styles.buttonText}>Try Again</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}><Text style={styles.buttonText}>Submit Echo</Text></TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101322' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { fontFamily: 'WorkSans-Bold', fontSize: 36, color: '#FFF', fontStyle: 'italic' },
    headerSubtitle: { color: '#a855f7', fontWeight: '700', textTransform: 'uppercase' },
    gameLayout: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    partnerPanel: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2dd4bf50' },
    panelTitle: { color: '#FFF', fontWeight: '700', fontSize: 18, marginBottom: 12 },
    waveformContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 150, marginBottom: 16 },
    controlButton: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
    gaugeContainer: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 24, padding: 24, alignItems: 'center' },
    gaugeScore: { fontFamily: 'WorkSans-Black', fontSize: 32, color: '#FFF', fontStyle: 'italic' },
    gaugeFeedback: { color: '#ffffffb0', textAlign: 'center', fontStyle: 'italic', marginVertical: 12 },
    buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
    actionButton: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ffffff20' },
    primaryButton: { backgroundColor: '#f40b61' },
    buttonText: { color: '#FFF', fontWeight: '700', textAlign: 'center' },
});

export default EmpathyEchoGameScreen;
