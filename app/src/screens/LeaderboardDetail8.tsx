
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
        {/* Icon would go here */}
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const LeaderboardDetail8Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#12080d', '#1a1317']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Structured Reflection</Text>
                <Text style={styles.subtitle}>Use these guided sentences to navigate your feelings.</Text>

                <View style={styles.glassPanel}>
                    <View style={styles.madLibRow}>
                        <Text style={styles.madLibText}>I felt</Text>
                        <MadLibInput label="Emotion" color="#fc0c84" options={['Cherished', 'Heard']}/>
                        <Text style={styles.madLibText}>when you</Text>
                        <MadLibInput label="Action" color="#9d4edd" options={['listened', 'held my hand']}/>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Add any extra thoughts to your reflection..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                    />

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit Reflection</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.statsContainer}>
                    <StatCard label="Reflections Shared" value="24 Sessions"/>
                    <StatCard label="Bond Strength" value="+150 HP"/>
                    <StatCard label="Current Streak" value="5 Days"/>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1317' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24, maxWidth: 300, alignSelf: 'center' },
    glassPanel: { backgroundColor: 'rgba(26, 19, 23, 0.85)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    madLibRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    madLibText: { color: '#FFF', fontSize: 18, marginHorizontal: 8 },
    madLibContainer: { borderBottomWidth: 2, borderBottomColor: '#fc0c84', margin: 8 },
    madLibLabel: { fontSize: 18, paddingVertical: 4 },
    textInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, color: '#FFF', minHeight: 100, marginVertical: 16 },
    submitButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 24, backgroundColor: '#FFD700', alignSelf: 'center', marginTop: 16 },
    submitButtonText: { color: '#000', fontWeight: 'bold', textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
    statCard: { backgroundColor: 'rgba(26, 19, 23, 0.85)', borderRadius: 16, padding: 16, alignItems: 'center', flex: 1, marginHorizontal: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
    statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default LeaderboardDetail8Screen;
