
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const tones = [
    { name: 'Sarcastic', icon: 'sentiment_dissatisfied' },
    { name: 'Anxious', icon: 'psychology' },
    { name: 'Warm', icon: 'favorite' },
    { name: 'Playful', icon: 'celebration' },
];

const ToneButton = ({ tone, selected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.toneButton, selected && styles.selectedToneButton]}>
        <MaterialIcons name={tone.icon} size={30} color={selected ? '#fff' : '#ab9db9'} />
        <Text style={[styles.toneText, selected && styles.selectedToneText]}>{tone.name}</Text>
    </TouchableOpacity>
);

const ToneShiftChallengeGame = () => {
    const [selectedTone, setSelectedTone] = useState('Anxious');
    const vocalWarmth = 65;

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#141118', '#191022']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>"We need to talk"</Text>
                        <Text style={styles.headerSubtitle}>Select a tone and say it like you mean it!</Text>
                    </View>

                    <View style={styles.mainContent}>
                        {/* Right Sidebar Content */}
                        <View style={styles.rightSidebar}>
                            <Text style={styles.sidebarTitle}>Vocal Warmth</Text>
                            <View style={styles.thermometerContainer}>
                                <View style={styles.thermometer}>
                                    <LinearGradient 
                                        colors={['#00f5d4', '#ff2d85', '#7f13ec']}
                                        style={[styles.thermometerFill, { height: `${vocalWarmth}%` }]}
                                    />
                                </View>
                            </View>
                            <Text style={styles.scoreText}>{vocalWarmth}%</Text>
                        </View>
                        
                        <View style={styles.challengeArea}>
                            <View style={styles.toneGrid}>
                                {tones.map((tone) => (
                                    <ToneButton
                                        key={tone.name}
                                        tone={tone}
                                        selected={selectedTone === tone.name}
                                        onPress={() => setSelectedTone(tone.name)}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity style={styles.recordButton}>
                                <MaterialIcons name="mic" size={24} color="#fff" />
                                <Text style={styles.recordButtonText}>START RECORDING</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                     <View style={styles.verdictCard}>
                        <Text style={styles.verdictTitle}>MARCIE'S VERDICT</Text>
                        <Text style={styles.verdictText}>"You sound like a microwave, honey. Add some soul to that sentence!"</Text>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#141118' },
    container: { flex: 1 },
    scrollView: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { color: '#ab9db9', fontSize: 16, textAlign: 'center', marginTop: 8 },
    mainContent: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    challengeArea: { flex: 1, justifyContent: 'space-between', backgroundColor: '#1e1629', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#302839' },
    rightSidebar: { width: 80, alignItems: 'center', backgroundColor: '#1e1629', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#302839' },
    sidebarTitle: { color: '#ab9db9', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', writingDirection: 'ltr', transform: [{ rotate: '-90deg'}], position: 'absolute', left: -25, top: 120 },
    thermometerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    thermometer: { width: 30, height: '80%', backgroundColor: '#302839', borderRadius: 15, justifyContent: 'flex-end', overflow: 'hidden' },
    thermometerFill: { width: '100%', borderRadius: 15 },
    scoreText: { color: '#ff2d85', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
    toneGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
    toneButton: { width: '47%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(25,16,34,0.7)', borderRadius: 16, borderWidth: 1, borderColor: '#302839', gap: 8 },
    selectedToneButton: { backgroundColor: 'rgba(127,19,236,0.2)', borderColor: '#7f13ec' },
    toneText: { color: '#ab9db9', fontWeight: 'bold' },
    selectedToneText: { color: '#fff' },
    recordButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff2d85', paddingVertical: 16, borderRadius: 99, gap: 10 },
    recordButtonText: { color: '#fff', fontWeight: 'bold' },
    verdictCard: { backgroundColor: 'rgba(255, 45, 133, 0.1)', borderColor: 'rgba(255, 45, 133, 0.3)', borderWidth: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
    verdictTitle: { color: '#ff2d85', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    verdictText: { color: '#fff', fontStyle: 'italic', textAlign: 'center' }
});

export default ToneShiftChallengeGame;
