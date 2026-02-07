
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const verdictData = {
    alex: {
        lens: 'DEFENSIVE SHIELD',
        quote: "I feel like I'm constantly being audited for every small mistake, which makes me want to withdraw entirely to avoid more criticism.",
        emotions: ['SUFFOCATED', 'UNDERVALUED']
    },
    jordan: {
        lens: 'THE NEED FOR ORDER',
        quote: "If I don't point things out, they just don't get done. It feels like I'm a manager, not a partner.",
        emotions: ['ISOLATED', 'OVERBURDENED']
    },
    reality: {
        title: "YOU'RE BOTH ARGUING ABOUT THE DISHES BECAUSE NEITHER OF YOU FEELS SEEN.",
        points: ['OVERLAP: FEAR OF ABANDONMENT', 'CORE ISSUE: RESPECT VS. AUTONOMY']
    },
    marciesRoast: "Alex, your 'withdrawal' isn't peace, it's a strategic ghosting. And Jordan, your 'reminders' are just corporate emails with more attitude. You're both acting like roommates who met on a bad Craigslist ad.",
    stingMeter: '9.8/10'
};

const PerspectiveCard = ({ person, data, color }) => (
    <View style={[styles.panelGlass, { borderColor: color, borderLeftWidth: 4 }]}>
        <Text style={styles.personName}>{person}'S LENS</Text>
        <Text style={[styles.personLens, { color }]}>{data.lens}</Text>
        <Text style={styles.personQuote}>{data.quote}</Text>
        <Text style={styles.primaryEmotion}>PRIMARY EMOTION</Text>
        <View style={styles.emotionsContainer}>
            {data.emotions.map(e => <Text key={e} style={styles.emotionTag}>{e}</Text>)}
        </View>
    </View>
);

const RelationshipDiagnosisCard2 = () => {

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>THE <Text style={styles.headerHighlight}>"TOUGH LOVE"</Text> VERDICT</Text>
                    <Text style={styles.subHeader}>I'VE CRUNCHED THE FEELINGS. HERE'S THE DEAL.</Text>

                    <View style={styles.cardsContainer}>
                        <PerspectiveCard person="ALEX" data={verdictData.alex} color="#00FFFF" />
                        
                        <View style={styles.realityCard}>
                            <Text style={styles.realityTitle}>THE REALITY</Text>
                            <Text style={styles.realityText}>{verdictData.reality.title}</Text>
                             {verdictData.reality.points.map(p => (
                                <View key={p} style={styles.realityPoint}>
                                    <Text>✅</Text>
                                    <Text style={styles.realityPointText}>{p}</Text>
                                </View>
                            ))}
                        </View>

                        <PerspectiveCard person="JORDAN" data={verdictData.jordan} color="#E040FB" />
                    </View>

                    <View style={[styles.panelGlass, styles.roastContainer]}>
                        <Text style={styles.roastTitle}>MARCIE'S ROAST</Text>
                        <Text style={styles.roastText}>{verdictData.marciesRoast}</Text>
                        <View style={styles.stingMeter}>
                           <Text style={styles.stingMeterLabel}>STING METER</Text>
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

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    headerHighlight: { color: '#FF4081', fontStyle: 'italic' },
    subHeader: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    cardsContainer: { marginBottom: 24, gap: 16 },
    panelGlass: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    personName: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    personLens: { textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    personQuote: { color: '#D1C4E9', fontStyle: 'italic', marginBottom: 12 },
    primaryEmotion: { textTransform: 'uppercase', fontSize: 10, color: '#D1C4E9', marginBottom: 8, fontWeight: 'bold' },
    emotionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    emotionTag: { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    realityCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginVertical: 16, transform: [{ scale: 1.05 }], borderWidth: 2, borderColor: '#FF4081' },
    realityTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    realityText: { color: '#121212', fontSize: 20, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
    realityPoint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    realityPointText: { color: '#121212', fontSize: 14, fontWeight: 'bold' },
    roastContainer: { borderColor: '#FF4081', borderWidth: 1, padding: 20, alignItems: 'center' },
    roastTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12, alignSelf: 'flex-start' },
    roastText: { color: '#FF4081', fontSize: 24, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(252, 12, 132, 0.4)', textShadowRadius: 15, marginBottom: 16 },
    stingMeter: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 8, borderRadius: 12, alignItems: 'center' },
    stingMeterLabel: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    stingMeterValue: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
    buttonContainer: { marginTop: 32, gap: 16 },
    mainButton: { backgroundColor: '#FF4081', padding: 16, borderRadius: 20, alignItems: 'center' },
    mainButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    secondaryButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    secondaryButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default RelationshipDiagnosisCard2;
