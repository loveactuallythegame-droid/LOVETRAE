
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PartnerCard = ({ partnerName, revelation, participantLabel }) => (
    <View style={styles.card}>
        <View style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.participantLabel}>{participantLabel}</Text>
            <Text style={styles.partnerName}>{partnerName}</Text>
            <View style={styles.revelationBox}>
                <Text style={styles.revelationLabel}>The Revelation</Text>
                <Text style={styles.revelationText}>"{revelation}"</Text>
            </View>
        </View>
    </View>
);

const HeartOfTheMatterGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181116', '#2b0b1e']} style={styles.background} />
             <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.inquiryTitle}>The Inquiry</Text>
                <Text style={styles.mainQuestion}>What was the deepest <Text style={styles.italicPrimary}>word-wound</Text>?</Text>

                <View style={styles.gameLayout}>
                    <PartnerCard partnerName="Partner A" revelation="The Silence" participantLabel="Participant Alpha"/>

                    <View style={styles.hostModule}>
                        {/* Dr. Marcie\'s Avatar */}
                        <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                        <View style={styles.hostFeedbackContainer}>
                            <Text style={styles.hostFeedback}>"Getting warmer, barely"</Text>
                        </View>
                        <Text style={styles.alignmentStatus}>42%</Text>
                    </View>

                    <PartnerCard partnerName="Partner B" revelation="Lack of Trust" participantLabel="Participant Bravo" />
                </View>

                <View style={styles.alignmentMeterContainer}>
                    <Text style={styles.meterTitle}>Semantic Alignment Meter</Text>
                     <View style={styles.meterTrack}>
                        <LinearGradient colors={['#8a2be2', '#ff005e']} style={styles.meterFill} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
                    </View>
                     <View style={styles.meterLabels}>
                        <Text style={styles.meterLabelText}>Dissonance</Text>
                        <Text style={styles.meterLabelText}>Neutral</Text>
                        <Text style={[styles.meterLabelText, {color: '#ff005e'}]}>Transcendence</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181116' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 24, alignItems: 'center' },
    inquiryTitle: { color: 'rgba(255, 0, 94, 0.8)', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 'bold', marginBottom: 8 },
    mainQuestion: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    italicPrimary: { fontStyle: 'italic', color: '#ff005e' },
    gameLayout: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' },
    card: {
        flex: 1,
        backgroundColor: 'rgba(39, 28, 35, 0.8)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(236, 19, 164, 0.1)',
        overflow: 'hidden',
    },
    cardImage: { height: 120, backgroundColor: '#271c23' },
    cardContent: { padding: 16 },
    participantLabel: { color: '#ff005e', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    partnerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
    revelationBox: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 8, marginTop: 8 },
    revelationLabel: { color: '#b99db0', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
    revelationText: { color: '#FFF', fontSize: 18, fontStyle: 'italic' },
    hostModule: { alignItems: 'center', gap: 12, marginHorizontal: 16 },
    hostName: { color: '#FFF', fontWeight: 'bold' },
    hostFeedbackContainer: { backgroundColor: '#271c23', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    hostFeedback: { color: '#ff005e', fontStyle: 'italic' },
    alignmentStatus: { color: '#FFF', fontSize: 24, fontWeight: '900' },
    alignmentMeterContainer: { width: '100%', maxWidth: 600, marginTop: 32, backgroundColor: 'rgba(39, 28, 35, 0.8)', borderRadius: 16, padding: 16 },
    meterTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
    meterTrack: { height: 24, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, overflow: 'hidden' },
    meterFill: { height: '100%', width: '42%' },
    meterLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    meterLabelText: { color: '#b99db0', fontSize: 10, textTransform: 'uppercase' },
});

export default HeartOfTheMatterGameScreen;
