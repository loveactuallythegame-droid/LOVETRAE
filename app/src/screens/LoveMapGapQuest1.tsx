
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoveMapGapQuest1Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#141118', '#230f16']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Discovery Needed: The Pottery Void</Text>
                <Text style={styles.subtitle}>Partner A: Craft a 'Curious Question' to reveal this hidden passion.</Text>

                <View style={styles.mapContainer}>
                    <View style={styles.crater}>
                        <Text style={styles.craterText}>Pottery Crater</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your curious question here..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            multiline
                        />
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Deploy Bridge</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>Map Progress</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar} />
                    </View>
                    <Text style={styles.progressText}>2 of 10 Gap Quest Journey</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24, maxWidth: 300 },
    mapContainer: { width: '100%', minHeight: 400, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', padding: 16 },
    crater: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 10, 100, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(140, 43, 238, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(140, 43, 238, 0.6)',
        shadowRadius: 20,
        shadowOpacity: 1,
        marginBottom: 24
    },
    craterText: { color: '#ff0a64', fontWeight: 'bold', textTransform: 'uppercase' },
    inputContainer: { width: '100%', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 12, padding: 16, borderColor: '#ff0a64', borderWidth: 1 },
    input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 16, color: '#FFF', minHeight: 100, marginBottom: 16 },
    submitButton: { backgroundColor: '#ff0a64', padding: 16, borderRadius: 8, alignItems: 'center' },
    submitButtonText: { color: '#FFF', fontWeight: 'bold' },
    progressContainer: { marginTop: 24, width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 },
    progressTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 8 },
    progressBarContainer: { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' },
    progressBar: { width: '20%', height: '100%', backgroundColor: '#ff0a64', borderRadius: 6 },
    progressText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase', marginTop: 8 }
});

export default LoveMapGapQuest1Screen;
