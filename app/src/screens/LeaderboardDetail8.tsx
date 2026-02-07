
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const MadLibInput = ({ options, color, label }) => (
    <View style={styles.madLibContainer}>
        <Text style={[styles.madLibLabel, { color }]}>{label}</Text>
        {/* In a real app, this would be a dropdown picker */}
    </View>
);

const StatCard = ({ icon, label, value }) => (
    <View style={styles.statCard}>
        <Text style={{fontSize: 30}}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const LeaderboardDetail8Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>STRUCTURED REFLECTION</Text>
                <Text style={styles.subtitle}>Use these guided sentences to navigate your feelings.</Text>

                <View style={styles.glassPanel}>
                    <View style={styles.madLibRow}>
                        <Text style={styles.madLibText}>I FELT</Text>
                        <MadLibInput label="EMOTION" color="#FF4081" options={['Cherished', 'Heard']}/>
                        <Text style={styles.madLibText}>WHEN YOU</Text>
                        <MadLibInput label="ACTION" color="#E040FB" options={['listened', 'held my hand']}/>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        placeholder="ADD ANY EXTRA THOUGHTS TO YOUR REFLECTION..."
                        placeholderTextColor="#D1C4E9"
                        multiline
                    />

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>SUBMIT REFLECTION</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.statsContainer}>
                    <StatCard label="REFLECTIONS SHARED" value="24 SESSIONS" icon="📝"/>
                    <StatCard label="BOND STRENGTH" value="+150 HP" icon="💪"/>
                    <StatCard label="CURRENT STREAK" value="5 DAYS" icon="🔥"/>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 24, maxWidth: 300, alignSelf: 'center' },
    glassPanel: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    madLibRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    madLibText: { color: '#FFF', fontSize: 18, marginHorizontal: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    madLibContainer: { borderBottomWidth: 2, borderBottomColor: '#FF4081', margin: 8 },
    madLibLabel: { fontSize: 18, paddingVertical: 4, fontWeight: 'bold', textTransform: 'uppercase' },
    textInput: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, color: '#FFF', minHeight: 100, marginVertical: 16, textAlignVertical: 'top', fontWeight: 'bold', textTransform: 'uppercase' },
    submitButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 24, backgroundColor: '#FFD700', alignSelf: 'center', marginTop: 16 },
    submitButtonText: { color: '#000', fontWeight: 'bold', textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, gap: 8 },
    statCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 16, alignItems: 'center', flex: 1, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    statLabel: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold', textAlign: 'center' },
    statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default LeaderboardDetail8Screen;
