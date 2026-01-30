
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const DreamDecoderGameScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#191022', '#1a1a1a']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dream Decoder</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Left Panel - Dr. Marcie */}
                    <View style={styles.leftPanel}>
                         <View style={styles.drMarcieImage} />
                         <View style={styles.speechBubble}>
                             <Text style={styles.speechText}>"Not about dishes, darling. It's about feeling seen."</Text>
                         </View>
                    </View>

                    {/* Right Panel - Game */}
                    <View style={styles.rightPanel}>
                        <View style={styles.gameCard}>
                            <Text style={styles.cardSubtitle}>Core Conflict Identification</Text>
                            <Text style={styles.cardTitle}>Surface Conflict: <Text style={styles.cardTitleHighlight}>Dishes in Sink</Text></Text>
                            <Text style={styles.cardBody}>The surface fight is about chores, but what lies beneath? Provide clues to help your partner decode the hidden dream.</Text>
                            <TextInput style={styles.clueInput} placeholder="e.g., 'Validation', 'Balance', 'Time'..." placeholderTextColor="#ffffff40" />
                            <TouchableOpacity style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Submit Clue</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.hintCardsContainer}>
                            <View style={styles.hintCard}>
                                <Text style={styles.hintTitle}>Partner's Last Guess</Text>
                                <Text style={styles.hintText}>"Is it about needing more help?"</Text>
                            </View>
                            <View style={[styles.hintCard, { opacity: 0.5 }]}>
                                <Text style={styles.hintTitle}>Dream Unlock</Text>
                                <Text style={styles.hintText}>Waiting for 3 clues...</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#191022' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 32 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 40, color: '#FFF', textShadowColor: 'rgba(127, 19, 236, 0.5)', textShadowRadius: 15 },
    mainLayout: { flexDirection: 'row', gap: 24 },
    leftPanel: { flex: 1, alignItems: 'center' },
    drMarcieImage: { width: 200, height: 260, borderRadius: 16, backgroundColor: '#333', borderWidth: 1, borderColor: '#7f13ec' },
    speechBubble: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, borderBottomRightRadius: 0, marginTop: -30, marginRight: -50, transform: [{ rotate: '3deg' }] },
    speechText: { color: '#191022', fontWeight: '600', fontStyle: 'italic' },
    rightPanel: { flex: 2, gap: 16 },
    gameCard: {
        backgroundColor: 'rgba(33, 28, 39, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 24,
    },
    cardSubtitle: { color: '#ec4899', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    cardTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: '#FFF', marginBottom: 16 },
    cardTitleHighlight: { fontStyle: 'italic', color: '#facc15' },
    cardBody: { color: '#ffffffcc', fontSize: 16, lineHeight: 24, marginBottom: 24 },
    clueInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 16, marginBottom: 16 },
    submitButton: { backgroundColor: '#7f13ec', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    submitButtonText: { color: '#FFF', fontWeight: '700' },
    hintCardsContainer: { flexDirection: 'row', gap: 16 },
    hintCard: { flex: 1, backgroundColor: 'rgba(33, 28, 39, 0.7)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    hintTitle: { color: '#FFF', fontWeight: '600', fontSize: 14, marginBottom: 4 },
    hintText: { color: '#ffffff90', fontStyle: 'italic' },
});

export default DreamDecoderGameScreen;
