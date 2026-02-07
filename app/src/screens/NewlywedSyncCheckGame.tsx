
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PlayerCard = ({ partner, name, answer, color }) => (
    <View style={[styles.playerCard, { borderColor: color }]}>
        <View style={styles.playerHeader}>
            <View style={[styles.avatar, { borderColor: color }]} />
            <View>
                <Text style={[styles.partnerLabel, { color }]}>{`PARTNER ${partner}`}</Text>
                <Text style={styles.playerName}>{name}</Text>
            </View>
        </View>
        <Text style={styles.answerText}>{`"${answer}"`}</Text>
    </View>
);

const NewlywedSyncCheckGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.questionText}>WHERE IS YOUR PARTNER'S 'HAPPY PLACE'?</Text>

                <View style={styles.syncArea}>
                    <PlayerCard partner="A" name="ALEX CHEN" answer="The Beach" color="#FF4081" />
                    <View style={styles.matchIndicator}>
                        <Text style={styles.matchPercent}>94%</Text>
                        <Text style={styles.matchLabel}>MATCH</Text>
                    </View>
                    <PlayerCard partner="B" name="JORDAN SMITH" answer="Under a palm tree" color="#E040FB" />
                </View>

                <View style={styles.critiqueContainer}>
                    <Text style={styles.critiqueTitle}>THE EXPERT'S TAKE</Text>
                    <Text style={styles.critiqueText}>"Technically a match, but let's be real—Alex wants the mojito and Jordan just wants the shade."</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.reviewButton}>
                        <Text style={styles.reviewButtonText}>REVIEW LOGIC</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>NEXT QUESTION</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16, alignItems: 'center' },
    questionText: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 24, textTransform: 'uppercase' },
    syncArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingHorizontal: 8 },
    playerCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 16, borderWidth: 1, minHeight: 180, marginHorizontal: 8 },
    playerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2 },
    partnerLabel: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    playerName: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    answerText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center', textTransform: 'uppercase' },
    matchIndicator: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FF4081' },
    matchPercent: { color: '#FF4081', fontSize: 28, fontWeight: 'bold' },
    matchLabel: { color: '#FF4081', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    critiqueContainer: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16, marginTop: 24, marginHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    critiqueTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
    critiqueText: { color: '#D1C4E9', fontStyle: 'italic' },
    buttonContainer: { flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-around' },
    reviewButton: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    reviewButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    nextButton: { backgroundColor: '#FF4081', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default NewlywedSyncCheckGame;
