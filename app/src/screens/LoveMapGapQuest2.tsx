
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
            <LinearGradient colors={[color, `${color}80`]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.statBar, { width: percentage }]} />
        </View>
    </View>
);

const LoveMapGapQuest2Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>MAP QUEST: THE FUTURE AMBITIONS SECTOR</Text>
                
                <View style={styles.mainContainer}>
                    <View style={styles.sidebar}>
                        <View style={styles.marcieCard}>
                            <Text style={styles.marcieTitle}>MARCIE THE CARTOGRAPHER</Text>
                            <Text style={styles.marcieQuote}>"Commander, we've hit a 'Here Be Dragons' zone..."</Text>
                        </View>
                        <View style={styles.inputCard}>
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="CRAFT DISCOVERY QUESTION..."
                                placeholderTextColor="#D1C4E9"
                                multiline
                            />
                            <TouchableOpacity style={styles.transmitButton}>
                                <Text style={styles.transmitButtonText}>TRANSMIT TO PARTNER</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mapArea}>
                        <Text style={styles.mapPlaceholderText}>[INTERACTIVE MAP AREA]</Text>
                        <View style={styles.dragonsZone}>
                            <Text style={styles.dragonsZoneText}>HERE BE DRAGONS</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <StatBar label="SYNCHRONICITY" value="84%" color="#00FFFF" percentage="84%" />
                    <StatBar label="VULNERABILITY" value="MEDIUM" color="#FFD700" percentage="50%" />
                    <StatBar label="MAP INTEGRITY" value="NOMINAL" color="#FF4081" percentage="92%" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase' },
    mainContainer: { flexDirection: 'row', gap: 16 },
    sidebar: { flex: 1, gap: 16 },
    marcieCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    marcieTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    marcieQuote: { color: '#D1C4E9', fontStyle: 'italic' },
    inputCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    textInput: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, color: '#FFF', minHeight: 100, marginBottom: 12, textAlignVertical: 'top', fontWeight: 'bold', textTransform: 'uppercase' },
    transmitButton: { backgroundColor: '#FF4081', padding: 12, borderRadius: 8, alignItems: 'center' },
    transmitButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    mapArea: { flex: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', alignItems: 'center', justifyContent: 'center' },
    mapPlaceholderText: { color: '#D1C4E9', fontWeight: 'bold', textTransform: 'uppercase' },
    dragonsZone: { position: 'absolute', top: '35%', right: '25%', padding: 24, borderRadius: 99, borderWidth: 2, borderColor: '#FF4081', alignItems: 'center' },
    dragonsZoneText: { color: '#FF4081', fontWeight: 'bold', textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', gap: 8, marginTop: 16 },
    statBarContainer: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    statBarLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    statBarLabel: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    statBarValue: { fontSize: 12, fontWeight: 'bold' },
    statBarBackground: { height: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2 },
    statBar: { height: '100%', borderRadius: 2 },
});

export default LoveMapGapQuest2Screen;
