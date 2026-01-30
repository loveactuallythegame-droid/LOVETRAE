
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// Using a simple slider for demonstration. A custom vertical slider would be needed for the exact visual.
import Slider from '@react-native-community/slider';

const ForeplaySliderGame1Screen = () => {
    const [sliderValue, setSliderValue] = useState(75);

    const intensityLevels = ['Subtle', 'Playful', 'Warming', 'Passion', 'Intense'];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#31152c', '#181114']} style={styles.background} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Foreplay Slider</Text>
                <Text style={styles.headerSubtitle}>Variant 4 of 10</Text>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.sliderSection}>
                    <View style={styles.intensityMarkers}>
                        {intensityLevels.map(level => <Text key={level} style={styles.markerText}>{level}</Text>)}
                    </View>

                    <View style={styles.sliderContainer}>
                        <Slider
                            style={{ height: 400, width: 200, transform: [{ rotate: '-90deg' }] }} // Basic horizontal slider rotated
                            minimumValue={0}
                            maximumValue={100}
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            minimumTrackTintColor="#f4257b"
                            maximumTrackTintColor="#39282f"
                            thumbTintColor="#40e0d0"
                        />
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Arousal Meter</Text>
                            <Text style={styles.statValue}>{Math.round(sliderValue)}%</Text>
                        </View>
                        <View style={styles.syncBox}>
                            <Text style={styles.syncStatus}>Harmony achieved</Text>
                        </View>
                    </View>
                </View>

                 <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirm Setting</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.marcieContainer}>
                 <Text style={styles.marcieText}>"Sparks are flying! Partner A, I can feel the tension rising..."</Text>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181114' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { alignItems: 'center', padding: 16 },
    headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { color: 'rgba(255,0,72,0.6)', textTransform: 'uppercase', letterSpacing: 4 },
    mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    sliderSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    intensityMarkers: { height: 380, justifyContent: 'space-between', alignItems: 'flex-end' },
    markerText: { color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
    sliderContainer: { justifyContent: 'center', alignItems: 'center', height: 450, width: 50 },
    statsContainer: { gap: 16, width: 200 },
    statBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statLabel: { color: 'rgba(255,255,255,0.6)' },
    statValue: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
    syncBox: { backgroundColor: 'rgba(255,0,72,0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,0,72,0.2)' },
    syncStatus: { color: '#FFF', fontStyle: 'italic' },
    confirmButton: { marginTop: 24, backgroundColor: '#FFF', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 99 },
    confirmButtonText: { color: '#230f15', fontWeight: 'bold' },
    marcieContainer: { position: 'absolute', bottom: 20, left: 20, width: 300 },
    marcieText: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, color: '#FFF', fontStyle: 'italic', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
});

export default ForeplaySliderGame1Screen;
