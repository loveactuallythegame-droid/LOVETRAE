
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// A single slider component - in a real app, this would use a slider library
const IntimacySlider = ({ label, description, value, color, onValueChange }) => (
    <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
            <View>
                <Text style={styles.sliderLabel}>{label}</Text>
                <Text style={styles.sliderDescription}>{description}</Text>
            </View>
            <Text style={[styles.sliderValue, { color }]}>{value}/10</Text>
        </View>
        <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${value * 10}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const IntimacyLevelSettingsScreen = () => {
    // State for each intimacy level
    const [emotional, setEmotional] = useState(8);
    const [physical, setPhysical] = useState(4);
    const [intellectual, setIntellectual] = useState(7);
    const [spiritual, setSpiritual] = useState(5);
    const [social, setSocial] = useState(9);
    const [adventurous, setAdventurous] = useState(6);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#1a3a3a']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Intimacy Level Settings</Text>
                <Text style={styles.pageSubtitle}>Set your cosmic boundaries to tailor the game to your comfort zone.</Text>

                <View style={styles.mainContent}>
                    <View style={styles.slidersPanel}>
                        <IntimacySlider label="Emotional Intimacy" description="Vulnerability and sharing" value={emotional} color="#fc0c84" onValueChange={setEmotional} />
                        <IntimacySlider label="Physical Boundaries" description="Touch and personal space" value={physical} color="#f472b6" onValueChange={setPhysical} />
                        <IntimacySlider label="Intellectual Connection" description="Deep debates and challenges" value={intellectual} color="#c084fc" onValueChange={setIntellectual} />
                        <IntimacySlider label="Spiritual Alignment" description="Shared values and beliefs" value={spiritual} color="#fbbf24" onValueChange={setSpiritual} />
                        <IntimacySlider label="Social Comfort" description="Public displays and interactions" value={social} color="#34d399" onValueChange={setSocial} />
                        <IntimacySlider label="Adventurousness" description="Willingness for cosmic surprises" value={adventurous} color="#fb923c" onValueChange={setAdventurous} />
                    </View>

                    <View style={styles.summaryPanel}>
                       <Text style={styles.summaryTitle}>Sync Summary</Text>
                       {/* Bar chart would be implemented here */}
                        <View style={styles.partnerMatchContainer}>
                            <Text style={styles.partnerMatchLabel}>Partner Match</Text>
                            <Text style={styles.partnerMatchValue}>94%</Text>
                            <Text style={styles.partnerMatchDescription}>Your zones are highly compatible with your partner's current settings.</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#102222' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24 },
    pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    pageSubtitle: { color: '#9db9b9', marginBottom: 24, fontSize: 16 },
    mainContent: { flexDirection: 'row', gap: 16 },
    slidersPanel: { flex: 2, gap: 16 },
    sliderContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sliderLabel: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    sliderDescription: { color: '#9db9b9', fontSize: 12 },
    sliderValue: { fontSize: 24, fontWeight: 'bold' },
    sliderTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4 },
    sliderFill: { height: '100%', borderRadius: 4 },
    summaryPanel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)' },
    summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
    partnerMatchContainer: { marginTop: 'auto', backgroundColor: 'rgba(252, 12, 132, 0.1)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)' },
    partnerMatchLabel: { color: '#fc0c84', fontWeight: 'bold', textTransform: 'uppercase' },
    partnerMatchValue: { fontSize: 36, fontWeight: 'bold', color: '#FFF', marginVertical: 4 },
    partnerMatchDescription: { color: '#9db9b9', fontSize: 12 },
});

export default IntimacyLevelSettingsScreen;
