
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PartnerCard = ({ partnerName, revelation, participantLabel }) => (
    <View style={styles.card}>
        <View style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.participantLabel}>{participantLabel}</Text>
            <Text style={styles.partnerName}>{partnerName}</Text>
            <View style={styles.revelationBox}>
                <Text style={styles.revelationLabel}>THE REVELATION</Text>
                <Text style={styles.revelationText}>"{revelation}"</Text>
            </View>
        </View>
    </View>
);

const HeartOfTheMatterGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
             <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.inquiryTitle}>THE INQUIRY</Text>
                <Text style={styles.mainQuestion}>WHAT WAS THE DEEPEST <Text style={styles.italicPrimary}>WORD-WOUND</Text>?</Text>

                <View style={styles.gameLayout}>
                    <PartnerCard partnerName="PARTNER A" revelation="The Silence" participantLabel="PARTICIPANT ALPHA"/>

                    <View style={styles.hostModule}>
                        <Text style={{fontSize: 40}}>👩‍🏫</Text>
                        <Text style={styles.hostName}>DR. MARCIE LISS</Text>
                        <View style={styles.hostFeedbackContainer}>
                            <Text style={styles.hostFeedback}>"Getting warmer, barely"</Text>
                        </View>
                        <Text style={styles.alignmentStatus}>42%</Text>
                    </View>

                    <PartnerCard partnerName="PARTNER B" revelation="Lack of Trust" participantLabel="PARTICIPANT BRAVO" />
                </View>

                <View style={styles.alignmentMeterContainer}>
                    <Text style={styles.meterTitle}>SEMANTIC ALIGNMENT METER</Text>
                     <View style={styles.meterTrack}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} style={styles.meterFill} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
                    </View>
                     <View style={styles.meterLabels}>
                        <Text style={styles.meterLabelText}>DISSONANCE</Text>
                        <Text style={styles.meterLabelText}>NEUTRAL</Text>
                        <Text style={[styles.meterLabelText, {color: '#FF4081'}]}>TRANSCENDENCE</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 24, alignItems: 'center' },
    inquiryTitle: { color: '#FF4081', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold', marginBottom: 8 },
    mainQuestion: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase' },
    italicPrimary: { fontStyle: 'italic', color: '#FF4081' },
    gameLayout: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' },
    card: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        overflow: 'hidden',
    },
    cardImage: { height: 120, backgroundColor: 'rgba(0,0,0,0.3)' },
    cardContent: { padding: 16 },
    participantLabel: { color: '#FF4081', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    partnerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginVertical: 4, textTransform: 'uppercase' },
    revelationBox: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 12, marginTop: 8 },
    revelationLabel: { color: '#D1C4E9', fontSize: 12, textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
    revelationText: { color: '#FFF', fontSize: 18, fontStyle: 'italic' },
    hostModule: { alignItems: 'center', gap: 12, marginHorizontal: 16 },
    hostName: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    hostFeedbackContainer: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    hostFeedback: { color: '#FF4081', fontStyle: 'italic' },
    alignmentStatus: { color: '#FFF', fontSize: 24, fontWeight: '900' },
    alignmentMeterContainer: { width: '100%', maxWidth: 600, marginTop: 32, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    meterTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textTransform: 'uppercase' },
    meterTrack: { height: 24, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, overflow: 'hidden' },
    meterFill: { height: '100%', width: '42%' },
    meterLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    meterLabelText: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
});

export default HeartOfTheMatterGameScreen;
