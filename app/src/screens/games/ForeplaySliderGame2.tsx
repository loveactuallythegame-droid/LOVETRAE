
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ForeplaySliderGame2Screen = () => {
    const intensity = 75;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181114', '#230f18']} style={styles.background} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Foreplay Slider</Text>
                <Text style={styles.headerSubtitle}>Partner A: Find the sweet spot. Partner B: Feel the heat.</Text>
            </View>

            <View style={styles.mainGrid}>
                {/* Left Panel: Controller */}
                <View style={styles.glassPanel}>
                    <Text style={styles.panelTitle}>PARTNER A</Text>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTrack}>
                            <LinearGradient colors={['#ff6eb4', '#ff006d']} style={[styles.sliderFill, { height: `${intensity}%` }]} />
                            <View style={[styles.sliderHandle, { bottom: `${intensity}%` }]} />
                        </View>
                    </View>
                    <Text style={styles.sliderValueText}>{intensity}%</Text>
                </View>

                {/* Right Panel: Visualizer */}
                <View style={styles.rightColumn}>
                    <View style={styles.visualizerPanel}>
                        <Text style={styles.visualizerTitle}>AROUSAL LEVEL</Text>
                        <View style={styles.orbContainer}>
                             <LinearGradient colors={['#7b1fa2', '#ff0080', '#ff006d']} style={styles.orb}>
                                <Text style={styles.orbText}>{intensity}%</Text>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={styles.marciePanel}>
                         <View style={styles.marcieAvatar} />
                         <Text style={styles.marcieText}>"Oh, the tension is palpable! We're reaching the climax of this round..."</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181114' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { alignItems: 'center', padding: 16 },
    headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { color: '#b99dab', fontSize: 16 },
    mainGrid: { flex: 1, flexDirection: 'row', padding: 24, gap: 24 },
    glassPanel: {
        flex: 1,
        backgroundColor: 'rgba(57, 40, 48, 0.4)',
        backdropFilter: 'blur(12px)',
        borderWidth: 1,
        borderColor: 'rgba(238, 43, 140, 0.1)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center'
    },
    panelTitle: { color: '#ff006d', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', letterSpacing: 2 },
    sliderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
    sliderTrack: { width: 80, height: '100%', backgroundColor: '#392830', borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    sliderFill: { position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 40 },
    sliderHandle: { position: 'absolute', left: '50%', marginLeft: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'white', shadowColor: '#FFF', shadowRadius: 15, shadowOpacity: 1 },
    sliderValueText: { color: '#FFF', fontSize: 40, fontWeight: '900' },
    rightColumn: { flex: 2, gap: 24 },
    visualizerPanel: { flex: 3, backgroundColor: 'rgba(57, 40, 48, 0.4)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    visualizerTitle: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, position: 'absolute', top: 32 },
    orbContainer: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center' },
    orb: { width: '80%', height: '80%', borderRadius: 999, justifyContent: 'center', alignItems: 'center', shadowColor: '#ee2b8c', shadowRadius: 50, shadowOpacity: 0.8 },
    orbText: { color: '#FFF', fontSize: 64, fontWeight: '900' },
    marciePanel: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(57, 40, 48, 0.4)', borderRadius: 16, padding: 20, gap: 16, alignItems: 'center' },
    marcieAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff006d', borderWidth: 2, borderColor: '#ff006d' },
    marcieText: { flex: 1, color: '#FFFFFFe0', fontStyle: 'italic' },
});

export default ForeplaySliderGame2Screen;
