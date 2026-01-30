
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const DefensivenessDetoxGameScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102220', '#1a1a1a']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Identify the Trigger</Text>
                    <Text style={styles.headerSubtitle}>Express your frustration. Let's find a softer way to say it.</Text>
                </View>

                <View style={styles.gameGrid}>
                    {/* Left Panel */}
                    <View style={styles.glassPanel}>
                        <Text style={styles.panelTitle}>The Complaint: Speak Your Mind</Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="e.g., You always forget to do the dishes..."
                            placeholderTextColor="#9db9b760"
                            defaultValue="You always forget to do the dishes when it's your turn. It makes me feel like I have to do everything around here."
                        />
                    </View>

                    {/* Right Panel */}
                    <View style={styles.glassPanel}>
                        <Text style={styles.panelTitle}>The Analysis: The Heart View</Text>
                        <View style={styles.analysisBox}>
                            <Text style={styles.analysisText}>
                                <Text style={styles.highlightedText}>"You always"</Text>
                                <Text> forget to do the dishes...</Text>
                            </Text>
                        </View>
                        <View style={styles.drMarcieContainer}>
                             {/* Image Placeholder */}
                            <View style={styles.drMarcieAvatar} />
                            <View style={styles.speechBubble}>
                                <Text style={styles.speechText}>"Honey, <Text style={styles.speechHighlight}>"you always"</Text> is a brick wall. Try focusing on the specific event."</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.ctaButton}>
                     <LinearGradient colors={['#13ecda', '#40fdf0', '#13ecda']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                        <Text style={styles.ctaButtonText}>CHECK FOR DEFENSIVENESS</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#102220' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: '#FFF', textAlign: 'center' },
    headerSubtitle: { fontFamily: 'SpaceGrotesk-Regular', color: '#9db9b7', fontSize: 16, textAlign: 'center', marginTop: 8 },
    gameGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    glassPanel: { flex: 1, backgroundColor: 'rgba(28, 39, 38, 0.7)', borderColor: 'rgba(59, 84, 82, 0.5)', borderWidth: 1, borderRadius: 16, padding: 16 },
    panelTitle: { fontFamily: 'SpaceGrotesk-Bold', color: '#FFF', fontSize: 18, marginBottom: 12 },
    textInput: { flex: 1, backgroundColor: 'rgba(28, 39, 38, 0.5)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 16, minHeight: 150 },
    analysisBox: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 16 },
    analysisText: { fontSize: 16, color: '#FFFFFFd0' },
    highlightedText: { color: '#ff4b4b', fontWeight: 'bold', textDecorationLine: 'underline' },
    drMarcieContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    drMarcieAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#8a2be2' /* Placeholder */ },
    speechBubble: { flex: 1, backgroundColor: '#FFF', padding: 12, borderRadius: 12, borderTopLeftRadius: 0 },
    speechText: { color: '#102220', fontStyle: 'italic' },
    speechHighlight: { color: '#ff2d95', fontWeight: 'bold' },
    ctaButton: { height: 50, borderRadius: 25, shadowColor: '#13ecda', shadowRadius: 15, shadowOpacity: 0.5, marginTop: 16 },
    ctaGradient: { height: '100%', width: '100%', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    ctaButtonText: { color: '#102220', fontSize: 16, fontWeight: '700' },
});

export default DefensivenessDetoxGameScreen;
