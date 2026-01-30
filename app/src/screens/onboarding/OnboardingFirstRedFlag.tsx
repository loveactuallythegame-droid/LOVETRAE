
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const flags = [
    { text: 'Bad with money', icon: 'payments', color: '#fbbf24' },
    { text: 'Late for everything', icon: 'schedule', color: '#f97316' },
    { text: 'Always on their phone', icon: 'smartphone', color: '#2dd4bf' },
    { text: 'Workaholic', icon: 'work', color: '#0d9488' },
    { text: 'Love bombing', icon: 'favorite', color: '#ec4899' },
    { text: 'Hot & Cold', icon: 'thermostat', color: '#a855f7' },
];

const RedFlagTile = ({ text, icon, color, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.tile, isSelected && styles.selectedTile]}>
        {/* Icon goes here, color would be applied */}
        <Text style={styles.tileText}>{text}</Text>
        {isSelected && <View style={styles.checkIcon} /> /* Checkmark icon */}
    </TouchableOpacity>
);

const OnboardingRedFlagScreen = () => {
    const [selectedFlags, setSelectedFlags] = useState(['Late for everything', 'Love bombing']);

    const toggleFlag = (flagText) => {
        setSelectedFlags(prev => 
            prev.includes(flagText) ? prev.filter(f => f !== flagText) : [...prev, flagText]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0a0c', 'rgba(109, 40, 217, 0.25)', 'rgba(238, 43, 141, 0.2)', '#0a0a0c']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.progressHeader}>
                    <Text style={styles.progressSubtitle}>Assessment Phase</Text>
                    <Text style={styles.progressStep}>Step 2 / 5</Text>
                </View>
                <View style={styles.progressBar}>
                    <LinearGradient colors={['#2dd4bf', '#a855f7']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBarFill} />
                </View>

                <View style={styles.mainPanel}>
                    <Text style={styles.title}>What was the first "red flag" you ignored?</Text>
                    <Text style={styles.subtitle}>Self-awareness is the first step toward healing. Select all that apply.</Text>

                    <View style={styles.tilesContainer}>
                        {flags.map(flag => (
                            <RedFlagTile 
                                key={flag.text} 
                                {...flag} 
                                isSelected={selectedFlags.includes(flag.text)}
                                onPress={() => toggleFlag(flag.text)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.submitButton}>
                         <LinearGradient colors={['#fbbf24', '#f97316']} start={{x:0, y:0}} end={{x:1, y:0}} style={StyleSheet.absoluteFill} />
                        <Text style={styles.submitButtonText}>Submit Selection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.skipButton}>None of these apply to me</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0c' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, paddingVertical: 48 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    progressSubtitle: { color: '#2dd4bf', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    progressStep: { color: 'rgba(255,255,255,0.6)' },
    progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, marginBottom: 24 },
    progressBarFill: { width: '40%', height: '100%', borderRadius: 3 },
    mainPanel: { backgroundColor: 'rgba(18, 18, 22, 0.9)', borderRadius: 40, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 },
    tilesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
    tile: { width: '48%', aspectRatio: 1.2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 16, marginBottom: 16, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    selectedTile: { borderColor: '#f97316' },
    tileText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    checkIcon: { alignSelf: 'flex-end', width: 20, height: 20, borderRadius: 10, backgroundColor: '#f97316' }, // Placeholder
    submitButton: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', overflow: 'hidden', marginBottom: 12 },
    submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    skipButton: { color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});

export default OnboardingRedFlagScreen;
