
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
            <LinearGradient colors={['#191022', '#120b18']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Round 2: Gratitude Graffiti</Text>
                        <Text style={styles.headerSubtitle}>Collaborate to draw metaphors of appreciation.</Text>
                    </View>
                    {/* Timer component would go here */}
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.sidebar}>
                        <Text style={styles.sidebarTitle}>Inspiration Prompts</Text>
                        <GraffitiPrompt text='"You\'re the guac to my toast.''' />
                        <GraffitiPrompt text='"The wifi signal to my heart.''' />
                        <GraffitiPrompt text='"The anchor in my storm.''' />
                    </View>

                    <View style={styles.canvasContainer}>
                        {/* The drawing canvas would be implemented here */}
                        <View style={styles.canvasPlaceholder}>
                            <Text style={styles.graffitiTextPink}>GUAC 🥑</Text>
                            <Text style={styles.graffitiTextTeal}>TOAST 🍞</Text>
                        </View>
                        {/* Drawing tools would be overlaid here */}
                    </View>
                </View>

                <View style={styles.marcieContainer}>
                    <View style={styles.marcieBubble}>
                        <Text style={styles.marcieText}>
                            "I'm loving those neon choices! That <Text style={{color: '#ff007f'}}>guac metaphor</Text> is absolutely brilliant!"
                        </Text>
                    </View>
                    {/* Marcie\'s avatar and title would be here */}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#191022' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    headerSubtitle: { color: 'rgba(255,255,255,0.5)' },
    mainContent: { flexDirection: 'row', gap: 16 },
    sidebar: { width: 150, gap: 8 },
    sidebarTitle: { color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', marginBottom: 8 },
    promptContainer: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    promptText: { color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontSize: 12 },
    canvasContainer: { flex: 1, backgroundColor: '#120b18', borderRadius: 24, minHeight: 400, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    canvasPlaceholder: { alignItems: 'center' },
    graffitiTextPink: { fontSize: 36, fontWeight: 'bold', color: '#ff007f', textShadowColor: '#ff007f', textShadowRadius: 10, fontStyle: 'italic' },
    graffitiTextTeal: { fontSize: 36, fontWeight: 'bold', color: '#00f2ff', textShadowColor: '#00f2ff', textShadowRadius: 10, fontStyle: 'italic' },
    marcieContainer: { position: 'absolute', bottom: 24, right: 24, width: 250 },
    marcieBubble: { backgroundColor: 'rgba(255, 3, 74, 0.2)', padding: 12, borderRadius: 16, borderBottomRightRadius: 0, borderColor: 'rgba(255, 3, 74, 0.3)', borderWidth: 1 },
    marcieText: { color: '#FFF', lineHeight: 20 },
});

export default GratitudeGraffitiScreen;
