
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LieDetectorLiteScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>LIE DETECTOR: LITE™</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.analysisTitle}>VOICE ANALYSIS PROTOCOL</Text>
                
                <View style={styles.panel}>
                    <View style={styles.meterContainer}>
                        <Text style={styles.meterTitle}>PROSODY METER</Text>
                        <Text style={styles.meterValue}>65%</Text>
                    </View>
                    <View style={styles.meterBarContainer}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.meterBar, {width: '65%'}]} />
                    </View>
                    <Text style={styles.meterStatus}>HIGH PITCH VARIANCE DETECTED</Text>

                    <TouchableOpacity style={styles.recordButton}>
                        <Text style={styles.recordButtonText}>RECORD</Text>
                    </TouchableOpacity>
                    <Text style={styles.recordSubtext}>HOLD TO ANALYZE VERBAL TRANSPARENCY</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    analysisTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 24, textTransform: 'uppercase' },
    panel: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    meterContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
    meterTitle: { color: '#00FFFF', textTransform: 'uppercase', fontWeight: 'bold' },
    meterValue: { color: '#00FFFF', fontSize: 24, fontWeight: 'bold' },
    meterBarContainer: { width: '100%', height: 40, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    meterBar: { height: '100%', borderRadius: 8 },
    meterStatus: { color: '#00FFFF', fontStyle: 'italic', marginTop: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    recordButton: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#FF4081', justifyContent: 'center', alignItems: 'center', marginVertical: 48, shadowColor: '#FF4081', shadowRadius: 25, shadowOpacity: 0.4 },
    recordButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', letterSpacing: 4, textTransform: 'uppercase' },
    recordSubtext: { color: '#D1C4E9', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', fontWeight: 'bold' }
});

export default LieDetectorLiteScreen;
