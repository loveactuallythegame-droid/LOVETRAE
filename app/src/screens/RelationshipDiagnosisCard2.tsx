
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Dummy data, to be replaced with session data
const verdictData = {
    alex: {
        lens: 'Defensive Shield',
        quote: "I feel like I'm constantly being audited for every small mistake, which makes me want to withdraw entirely to avoid more criticism.",
        emotions: ['Suffocated', 'Undervalued']
    },
    jordan: {
        lens: 'The Need for Order',
        quote: "If I don't point things out, they just don't get done. It feels like I'm a manager, not a partner.",
        emotions: ['Isolated', 'Overburdened']
    },
    reality: {
        title: "You're both arguing about the dishes because neither of you feels seen.",
        points: ['Overlap: Fear of abandonment', 'Core Issue: Respect vs. Autonomy']
    },
    marciesRoast: "Alex, your 'withdrawal' isn't peace, it's a strategic ghosting. And Jordan, your 'reminders' are just corporate emails with more attitude. You're both acting like roommates who met on a bad Craigslist ad.",
    stingMeter: '9.8/10'
};

const PerspectiveCard = ({ person, data, color }) => (
    <View style={[styles.panelGlass, { borderColor: color, borderLeftWidth: 4 }]}>
        <Text style={styles.personName}>{person}'s Lens</Text>
        <Text style={[styles.personLens, { color }]}>{data.lens}</Text>
        <Text style={styles.personQuote}>{data.quote}</Text>
        <Text style={styles.primaryEmotion}>Primary Emotion</Text>
        <View style={styles.emotionsContainer}>
            {data.emotions.map(e => <Text key={e} style={styles.emotionTag}>{e}</Text>)}
        </View>
    </View>
);

const RelationshipDiagnosisCard2 = () => {

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#080808', '#230f19']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>The <Text style={styles.headerHighlight}>"Tough Love"</Text> Verdict</Text>
                    <Text style={styles.subHeader}>I've crunched the feelings. Here's the deal.</Text>

                    <View style={styles.cardsContainer}>
                        <PerspectiveCard person="Alex" data={verdictData.alex} color="#2dd4bf" />
                        
                        <View style={styles.realityCard}>
                            <Text style={styles.realityTitle}>The Reality</Text>
                            <Text style={styles.realityText}>{verdictData.reality.title}</Text>
                             {verdictData.reality.points.map(p => (
                                <View key={p} style={styles.realityPoint}>
                                    <MaterialIcons name="check-circle" size={16} color="#14b8a6" />
                                    <Text style={styles.realityPointText}>{p}</Text>
                                </View>
                            ))}
                        </View>

                        <PerspectiveCard person="Jordan" data={verdictData.jordan} color="#8b5cf6" />
                    </View>

                    <View style={[styles.panelGlass, styles.roastContainer]}>
                        <Text style={styles.roastTitle}>Marcie's Roast</Text>
                        {/* Use custom font for Marcie's commentary */}
                        <Text style={styles.roastText}>{verdictData.marciesRoast}</Text>
                        <View style={styles.stingMeter}>
                           <Text style={styles.stingMeterLabel}>Sting Meter</Text>
                           <Text style={styles.stingMeterValue}>{verdictData.stingMeter}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.mainButton}>
                            <Text style={styles.mainButtonText}>START HEALING EXERCISE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>RE-EXAMINE PERSPECTIVES</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

// Note: 'SweetPink-Regular' must be loaded in your project for the custom font to apply
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#080808' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    headerHighlight: { color: '#fc0c84', fontStyle: 'italic' },
    subHeader: { color: 'rgba(255,255,255,0.5)', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    cardsContainer: { marginBottom: 24, gap: 16 },
    panelGlass: { backgroundColor: 'rgba(26, 26, 26, 0.8)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    personName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    personLens: { textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    personQuote: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginBottom: 12 },
    primaryEmotion: { textTransform: 'uppercase', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
    emotionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    emotionTag: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12 },
    realityCard: { backgroundColor: '#fff', color: '#121212', borderRadius: 24, padding: 20, marginVertical: 16, transform: [{ scale: 1.05 }] },
    realityTitle: { color: '#fc0c84', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    realityText: { color: '#121212', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    realityPoint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    realityPointText: { color: '#121212', fontSize: 14 },
    roastContainer: { borderColor: '#fc0c84', borderWidth: 1, padding: 20, alignItems: 'center' },
    roastTitle: { color: '#fc0c84', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12, alignSelf: 'flex-start' },
    roastText: { fontFamily: 'SweetPink-Regular', color: '#fc0c84', fontSize: 24, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(252, 12, 132, 0.4)', textShadowRadius: 15, marginBottom: 16 },
    stingMeter: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12, alignItems: 'center' },
    stingMeterLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' },
    stingMeterValue: { color: '#fbbf24', fontSize: 24, fontWeight: 'bold' },
    buttonContainer: { marginTop: 32, gap: 16 },
    mainButton: { backgroundColor: '#fc0c84', padding: 16, borderRadius: 16, alignItems: 'center' },
    mainButtonText: { color: '#fff', fontWeight: 'bold' },
    secondaryButton: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    secondaryButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default RelationshipDiagnosisCard2;
