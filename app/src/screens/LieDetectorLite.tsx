
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LieDetectorLiteScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120812', '#2d102d']} style={styles.background} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lie Detector: Lite™</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.analysisTitle}>Voice Analysis Protocol</Text>
                
                <View style={styles.panel}>
                    <View style={styles.meterContainer}>
                        <Text style={styles.meterTitle}>Prosody Meter</Text>
                        <Text style={styles.meterValue}>65%</Text>
                    </View>
                    <View style={styles.meterBarContainer}>
                        <View style={[styles.meterBar, {width: '65%'}]} />
                    </View>
                    <Text style={styles.meterStatus}>High Pitch Variance Detected</Text>

                    <TouchableOpacity style={styles.recordButton}>
                        <Text style={styles.recordButtonText}>RECORD</Text>
                    </TouchableOpacity>
                    <Text style={styles.recordSubtext}>Hold to analyze verbal transparency</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    analysisTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
    panel: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    meterContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
    meterTitle: { color: '#2dd4bf', textTransform: 'uppercase' },
    meterValue: { color: '#2dd4bf', fontSize: 24, fontWeight: 'bold' },
    meterBarContainer: { width: '100%', height: 40, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    meterBar: { height: '100%', backgroundColor: '#2dd4bf', borderRadius: 8 },
    meterStatus: { color: '#2dd4bf', fontStyle: 'italic', marginTop: 8 },
    recordButton: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#f80b5a', justifyContent: 'center', alignItems: 'center', marginVertical: 48, shadowColor: '#f80b5a', shadowRadius: 25, shadowOpacity: 0.4 },
    recordButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
    recordSubtext: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }
});

export default LieDetectorLiteScreen;
