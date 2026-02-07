
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoveMapGapQuest1Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>DISCOVERY NEEDED: THE POTTERY VOID</Text>
                <Text style={styles.subtitle}>PARTNER A: CRAFT A 'CURIOUS QUESTION' TO REVEAL THIS HIDDEN PASSION.</Text>

                <View style={styles.mapContainer}>
                    <View style={styles.crater}>
                        <Text style={styles.craterText}>POTTERY CRATER</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="TYPE YOUR CURIOUS QUESTION HERE..."
                            placeholderTextColor="#D1C4E9"
                            multiline
                        />
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>DEPLOY BRIDGE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>MAP PROGRESS</Text>
                    <View style={styles.progressBarContainer}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBar} />
                    </View>
                    <Text style={styles.progressText}>2 OF 10 GAP QUEST JOURNEY</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 24, maxWidth: 300, textTransform: 'uppercase', fontWeight: 'bold' },
    mapContainer: { width: '100%', minHeight: 400, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', alignItems: 'center', justifyContent: 'center', padding: 16 },
    crater: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 64, 129, 0.2)',
        borderWidth: 2,
        borderColor: '#E040FB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E040FB',
        shadowRadius: 20,
        shadowOpacity: 1,
        marginBottom: 24
    },
    craterText: { color: '#FF4081', fontWeight: 'bold', textTransform: 'uppercase' },
    inputContainer: { width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, borderColor: '#FF4081', borderWidth: 1 },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 16, color: '#FFF', minHeight: 100, marginBottom: 16, textAlignVertical: 'top', fontWeight: 'bold', textTransform: 'uppercase' },
    submitButton: { backgroundColor: '#FF4081', padding: 16, borderRadius: 8, alignItems: 'center' },
    submitButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    progressContainer: { marginTop: 24, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    progressTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    progressBarContainer: { height: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden' },
    progressBar: { width: '20%', height: '100%', borderRadius: 6 },
    progressText: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', marginTop: 8, fontWeight: 'bold' }
});

export default LoveMapGapQuest1Screen;
