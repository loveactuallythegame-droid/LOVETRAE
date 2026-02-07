
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const GraffitiPrompt = ({ text }) => (
    <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{text}</Text>
    </View>
);

const GratitudeGraffitiScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>ROUND 2: GRATITUDE GRAFFITI</Text>
                        <Text style={styles.headerSubtitle}>Collaborate to draw metaphors of appreciation.</Text>
                    </View>
                    {/* Timer component would go here */}
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.sidebar}>
                        <Text style={styles.sidebarTitle}>INSPIRATION PROMPTS</Text>
                        <GraffitiPrompt text='"You\'re the guac to my toast.''' />
                        <GraffitiPrompt text='"The wifi signal to my heart.''' />
                        <GraffitiPrompt text='"The anchor in my storm.''' />
                    </View>

                    <View style={styles.canvasContainer}>
                        <View style={styles.canvasPlaceholder}>
                            <Text style={styles.graffitiTextPink}>GUAC 🥑</Text>
                            <Text style={styles.graffitiTextTeal}>TOAST 🍞</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.marcieContainer}>
                     <Text style={styles.marcieAvatar}>😊</Text>
                    <View style={styles.marcieBubble}>
                        <Text style={styles.marcieText}>
                            "I'm loving those neon choices! That <Text style={{color: '#FF4081'}}>guac metaphor</Text> is absolutely brilliant!"
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9' },
    mainContent: { flexDirection: 'row', gap: 16 },
    sidebar: { width: 150, gap: 8 },
    sidebarTitle: { color: '#D1C4E9', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    promptContainer: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    promptText: { color: '#D1C4E9', fontStyle: 'italic', fontSize: 12 },
    canvasContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 24, minHeight: 400, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    canvasPlaceholder: { alignItems: 'center' },
    graffitiTextPink: { fontSize: 36, fontWeight: 'bold', color: '#FF4081', textShadowColor: '#FF4081', textShadowRadius: 10, fontStyle: 'italic', textTransform: 'uppercase' },
    graffitiTextTeal: { fontSize: 36, fontWeight: 'bold', color: '#00FFFF', textShadowColor: '#00FFFF', textShadowRadius: 10, fontStyle: 'italic', textTransform: 'uppercase' },
    marcieContainer: { position: 'absolute', bottom: 24, right: 24, width: 250, alignItems: 'flex-end' },
    marcieAvatar: { fontSize: 40, marginBottom: -10, zIndex: 1 },
    marcieBubble: { backgroundColor: 'rgba(255, 64, 129, 0.2)', padding: 12, borderRadius: 16, borderBottomRightRadius: 0, borderColor: 'rgba(255, 64, 129, 0.3)', borderWidth: 1 },
    marcieText: { color: '#FFF', lineHeight: 20 },
});

export default GratitudeGraffitiScreen;
