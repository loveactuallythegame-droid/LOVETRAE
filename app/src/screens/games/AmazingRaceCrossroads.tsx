
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; // Assuming a generic header

const AmazingRaceCrossroadsScreen = () => {
    const [detour, setDetour] = useState<string | null>(null);
    const [roadblock, setRoadblock] = useState<string | null>(null);

    const handleDetourSelect = (option: string) => {
        setDetour(option);
        // In a real app, this would trigger a backend update
    }

    const handleRoadblockSelect = (partner: string) => {
        setRoadblock(partner);
        // In a real app, this would trigger a backend update
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#1a2a2a']} style={styles.background} />
            <Header title="Amazing Race: Crossroads" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.decisionHub}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>WORD-WOUND PROTOCOL</Text>
                        <Text style={styles.cardSubtitle}>PHASE 04: ACTIVE</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.hubTitle}>DETOUR</Text>
                        <Text style={styles.hubDescription}>Choose your communication style for the next 500 miles:</Text>
                        <TouchableOpacity 
                            style={[styles.optionButton, detour === 'candor' && styles.selectedOption]}
                            onPress={() => handleDetourSelect('candor')}
                        >
                            <Text style={styles.optionTitle}>Radical Candor</Text>
                            <Text style={styles.optionDescription}>High intensity, direct feedback, zero filters.</Text>
                        </TouchableOpacity>
                        <Text style={styles.orText}>-- OR --</Text>
                        <TouchableOpacity 
                            style={[styles.optionButton, detour === 'soft' && styles.selectedOption]}
                             onPress={() => handleDetourSelect('soft')}
                        >
                            <Text style={styles.optionTitle}>Softened Start-up</Text>
                            <Text style={styles.optionDescription}>Low impact, high empathy, gradual entry.</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.card}>
                        <Text style={[styles.hubTitle, {color: '#ef4444'}]}>ROADBLOCK</Text>
                        <Text style={styles.hubDescription}>A personal growth task for ONE partner only:</Text>
                         <View style={styles.roadblockTask}>
                            <Text style={styles.optionTitle}>Mirror Meditation</Text>
                            <Text style={styles.optionDescription}>Facing self-criticism without projection. Takes approx 20 mins.</Text>
                        </View>
                        <TouchableOpacity style={styles.roadblockButton} onPress={() => handleRoadblockSelect('user')}>
                            <Text style={styles.roadblockButtonText}>I'll Take This Task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                 {/* Simplified representation of the map and moderator for mobile */}
                 <View style={styles.moderatorCard}>
                    <Text style={styles.moderatorName}>Dr. Marcie Liss</Text>
                    <Text style={styles.moderatorTitle}>Race Moderator</Text>
                    <Text style={styles.moderatorQuote}>"Phase 4 Word-Wound Protocol is active. Choose your path wisely, the rift is closing!"</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a2a2a' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollViewContent: { padding: 20 },
    decisionHub: { marginBottom: 20 },
    card: {
        backgroundColor: 'rgba(28, 39, 39, 0.6)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 24, color: '#FFF', textTransform: 'uppercase' },
    cardSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#ff005e', textTransform: 'uppercase' },
    hubTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#ff005e', textTransform: 'uppercase', marginBottom: 10 },
    hubDescription: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#9db9b9', marginBottom: 15 },
    optionButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    selectedOption: { borderColor: '#ff005e', backgroundColor: 'rgba(255, 0, 94, 0.05)' },
    optionTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 16, color: '#FFF' },
    optionDescription: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: '#9db9b9', marginTop: 5 },
    orText: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', marginVertical: 10, fontFamily: 'HolidayChristmas-Regular' },
    roadblockTask: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)', marginBottom: 15 },
    roadblockButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, alignItems: 'center' },
    roadblockButtonText: { fontFamily: 'BarbieDream-Regular', fontSize: 14, color: '#FFF', textTransform: 'uppercase' },
    moderatorCard: { alignItems: 'center', padding: 20, backgroundColor: 'rgba(28, 39, 39, 0.6)', borderRadius: 16 },
    moderatorName: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF' },
    moderatorTitle: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: '#ff005e', textTransform: 'uppercase', marginBottom: 10 },
    moderatorQuote: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#9db9b9', textAlign: 'center', fontStyle: 'italic' },
});

export default AmazingRaceCrossroadsScreen;
