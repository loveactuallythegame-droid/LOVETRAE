
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const StatBar = ({ label, value, color, percentage }) => (
    <View style={styles.statBarContainer}>
        <View style={styles.statBarLabelContainer}>
            <Text style={styles.statBarLabel}>{label}</Text>
            <Text style={[styles.statBarValue, { color }]}>{value}</Text>
        </View>
        <View style={styles.statBarBackground}>
            <View style={[styles.statBar, { backgroundColor: color, width: percentage }]} />
        </View>
    </View>
);

const LoveMapGapQuest2Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#121212', '#231a10']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Map Quest: The Future Ambitions Sector</Text>
                
                <View style={styles.mainContainer}>
                    <View style={styles.sidebar}>
                        <View style={styles.marcieCard}>
                            <Text style={styles.marcieTitle}>Marcie the Cartographer</Text>
                            <Text style={styles.marcieQuote}>"Commander, we've hit a 'Here Be Dragons' zone..."</Text>
                        </View>
                        <View style={styles.inputCard}>
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="Craft Discovery Question..."
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                multiline
                            />
                            <TouchableOpacity style={styles.transmitButton}>
                                <Text style={styles.transmitButtonText}>Transmit to Partner</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mapArea}>
                        {/* Placeholder for map content */}
                        <Text style={styles.mapPlaceholderText}>[Interactive Map Area]</Text>
                        <View style={styles.dragonsZone}>
                            <Text style={styles.dragonsZoneText}>HERE BE DRAGONS</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <StatBar label="Synchronicity" value="84%" color="#2dd4bf" percentage="84%" />
                    <StatBar label="Vulnerability" value="Medium" color="#fbbf24" percentage="50%" />
                    <StatBar label="Map Integrity" value="Nominal" color="#f90248" percentage="92%" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f15' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 16, textAlign: 'center' },
    mainContainer: { flexDirection: 'row', gap: 16 },
    sidebar: { flex: 1, gap: 16 },
    marcieCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    marcieTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 8 },
    marcieQuote: { color: '#cbad90', fontStyle: 'italic' },
    inputCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    textInput: { backgroundColor: '#121212', borderRadius: 8, padding: 12, color: '#FFF', minHeight: 100, marginBottom: 12 },
    transmitButton: { backgroundColor: '#f90248', padding: 12, borderRadius: 8, alignItems: 'center' },
    transmitButtonText: { color: '#230f15', fontWeight: 'bold' },
    mapArea: { flex: 2, backgroundColor: '#1e1e1e', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    mapPlaceholderText: { color: 'rgba(255,255,255,0.2)' },
    dragonsZone: { position: 'absolute', top: '35%', right: '25%', padding: 24, borderRadius: 99, borderWidth: 2, borderColor: '#f90248', alignItems: 'center' },
    dragonsZoneText: { color: '#f90248', fontWeight: 'bold' },
    statsContainer: { flexDirection: 'row', gap: 8, marginTop: 16 },
    statBarContainer: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statBarLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    statBarLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' },
    statBarValue: { fontSize: 12, fontWeight: 'bold' },
    statBarBackground: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
    statBar: { height: '100%', borderRadius: 2 },
});

export default LoveMapGapQuest2Screen;
