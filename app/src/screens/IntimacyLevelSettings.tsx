
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// A single slider component - in a real app, this would use a slider library and icons
const IntimacySlider = ({ icon, label, description, value, color, onValueChange }) => (
    <View style={styles.sliderContainer}>
        <Text style={styles.sliderIcon}>{icon}</Text>
        <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderLabel}>{label}</Text>
            <Text style={styles.sliderDescription}>{description}</Text>
        </View>
        <Text style={[styles.sliderValue, { color }]}>{value}/10</Text>
    </View>
);

const IntimacyLevelSettingsScreen = () => {
    // State for each intimacy level
    const [physical, setPhysical] = useState(8);
    const [emotional, setEmotional] = useState(6);
    const [intellectual, setIntellectual] = useState(5);
    const [social, setSocial] = useState(9);
    const [spiritual, setSpiritual] = useState(7);
    const [adventurous, setAdventurous] = useState(6); // This was not in the original image, but I'm keeping it

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Intimacy LEVEL Settings</Text>
                <Text style={styles.pageSubtitle}>Set your cosmic boundaries. These values help the game tailor dialogue and activities to your comfort zone.</Text>

                <View style={styles.slidersPanel}>
                    <IntimacySlider icon="✋" label="PHYSICAL BOUNDARIES" description="Physical touch and personal space levels" value={physical} color="#FF4081" onValueChange={setPhysical} />
                    <IntimacySlider icon="❤️" label="EMOTIONAL INTIMACY" description="Vulnerability and heart-to-heart sharing" value={emotional} color="#FFD700" onValueChange={setEmotional} />
                    <IntimacySlider icon="🧠" label="INTELLECTUAL CONNECTION" description="Deep debates and conceptual challenges" value={intellectual} color="#FFFF00" onValueChange={setIntellectual} />
                    <IntimacySlider icon="👥" label="SOCIAL COMFORT" description="Public displays and social interactions" value={social} color="#00FFFF" onValueChange={setSocial} />
                    <IntimacySlider icon="✨" label="SPIRITUAL ALIGNMENT" description="Shared values and cosmic beliefs" value={spiritual} color="#00FF00" onValueChange={setSpiritual} />
                    <IntimacySlider icon="🚀" label="ADVENTUROUSNESS" description="Willingness to try cosmic surprises" value={adventurous} color="#E040FB" onValueChange={setAdventurous} />
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.partnerMatchContainer}>
                        <Text style={styles.partnerMatchLabel}>PARTNER MATCH</Text>
                        <Text style={styles.partnerMatchValue}>94%</Text>
                    </View>
                    <View style={styles.syncSummary}>
                        <Text style={styles.syncSummaryTitle}>SYNC SUMMARY</Text>
                        <Text style={styles.syncSummaryDescription}>Your zones are highly compatible with your partner's current settings.</Text>
                        {/* Placeholder for the summary letters */}
                        <Text style={styles.syncSummaryLetters}>Phb Emi Inc Soc Spi Adv</Text>
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
    pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    pageSubtitle: { color: '#D1C4E9', marginBottom: 24, fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
    slidersPanel: { gap: 16, marginBottom: 24 },
    sliderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sliderIcon: { fontSize: 24, color: '#FFF', marginRight: 16 },
    sliderTextContainer: { flex: 1 },
    sliderLabel: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
    sliderDescription: { color: '#D1C4E9', fontSize: 12 },
    sliderValue: { fontSize: 24, fontWeight: 'bold' },
    summaryContainer: { flexDirection: 'row', gap: 16, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
    partnerMatchContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    partnerMatchLabel: { color: '#FF4081', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 16 },
    partnerMatchValue: { fontSize: 48, fontWeight: 'bold', color: '#FF4081' },
    syncSummary: { flex: 1 },
    syncSummaryTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 20, textTransform: 'uppercase' },
    syncSummaryDescription: { color: '#D1C4E9', fontSize: 14, marginVertical: 8 },
    syncSummaryLetters: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 4 },
});

export default IntimacyLevelSettingsScreen;
