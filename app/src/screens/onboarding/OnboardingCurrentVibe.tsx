
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingVibeScreen = () => {
    const [sliderValue, setSliderValue] = useState(0.65);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0d0d0d', 'rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.15)', '#0d0d0d']} style={styles.background} />

            <View style={styles.contentContainer}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Onboarding</Text>
                    <Text style={styles.progressStep}>Step 3 of 10</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={styles.progressBarFill} />
                </View>

                <View style={styles.mainPanel}>
                    <Text style={styles.title}>What’s your current vibe?</Text>
                    <Text style={styles.subtitle}>How are things feeling between you two right now? This helps us tailor the game's intensity.</Text>

                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabel}>Icy</Text>
                            <Text style={styles.sliderLabel}>Flaming</Text>
                        </View>
                        <LinearGradient
                            colors={['#ec4899', '#a855f7', '#d946ef', '#7c3aed']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.sliderTrack}
                        />
                        {/* A real slider component would be used here, this is a visual representation */}
                        <View style={[styles.sliderHandle, { left: `${sliderValue * 100}%` }]}>
                             <LinearGradient colors={['#ec4899', '#a855f7']} style={styles.handleGradient} />
                        </View>
                    </View>
                    <Text style={styles.sliderInstruction}>Drag the glow to set the mood</Text>
                </View>

                <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next Step</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0d0d0d' },
    background: { ...StyleSheet.absoluteFillObject },
    contentContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    progressLabel: { color: '#ec4899', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    progressStep: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 24 },
    progressBarFill: { width: '30%', height: '100%', backgroundColor: '#ec4899', borderRadius: 3 },
    mainPanel: { backgroundColor: 'rgba(26, 26, 26, 0.6)', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    title: { color: '#FFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: 16, marginBottom: 32 },
    sliderContainer: { marginBottom: 16, alignItems: 'center' },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
    sliderLabel: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    sliderTrack: { height: 12, width: '100%', borderRadius: 6 },
    sliderHandle: { position: 'absolute', top: -4, width: 20, height: 20, borderRadius: 10, shadowColor: '#ec4899', shadowRadius: 10, shadowOpacity: 0.8 },
    handleGradient: {flex: 1, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)'},
    sliderInstruction: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 12 },
    nextButton: { alignSelf: 'center', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 16, marginTop: 32, backgroundColor: '#14b8a6' }, // Placeholder, would use LinearGradient component
    nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default OnboardingVibeScreen;
