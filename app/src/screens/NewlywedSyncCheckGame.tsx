
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PlayerCard = ({ partner, name, answer, color }) => (
    <View style={[styles.playerCard, { borderColor: color }]}>
        <View style={styles.playerHeader}>
            <View style={[styles.avatar, { borderColor: color }]} />
            <View>
                <Text style={[styles.partnerLabel, { color }]}>{`Partner ${partner}`}</Text>
                <Text style={styles.playerName}>{name}</Text>
            </View>
        </View>
        <Text style={styles.answerText}>{`"${answer}"`}</Text>
    </View>
);

const NewlywedSyncCheckGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102220', '#230f16']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.questionText}>Where is your partner's 'Happy Place'?</Text>

                <View style={styles.syncArea}>
                    <PlayerCard partner="A" name="Alex Chen" answer="The Beach" color="#ff005e" />
                    <View style={styles.matchIndicator}>
                        <Text style={styles.matchPercent}>94%</Text>
                        <Text style={styles.matchLabel}>Match</Text>
                    </View>
                    <PlayerCard partner="B" name="Jordan Smith" answer="Under a palm tree" color="#a855f7" />
                </View>

                <View style={styles.critiqueContainer}>
                    <Text style={styles.critiqueTitle}>The Expert's Take</Text>
                    <Text style={styles.critiqueText}>"Technically a match, but let's be real—Alex wants the mojito and Jordan just wants the shade."</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.reviewButton}>
                        <Text style={styles.reviewButtonText}>Review Logic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Next Question</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#102220' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16, alignItems: 'center' },
    questionText: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 24 },
    syncArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingHorizontal: 8 },
    playerCard: { flex: 1, backgroundColor: 'rgba(28,39,38,0.8)', padding: 16, borderRadius: 16, borderWidth: 1, minHeight: 180, marginHorizontal: 8 },
    playerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, marginRight: 8 },
    partnerLabel: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    playerName: { color: '#FFF', fontWeight: 'bold' },
    answerText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' },
    matchIndicator: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#230f16', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ff005e' },
    matchPercent: { color: '#ff005e', fontSize: 28, fontWeight: 'bold' },
    matchLabel: { color: '#ff005e', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    critiqueContainer: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16, marginTop: 24, marginHorizontal: 16 },
    critiqueTitle: { color: '#f472b6', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
    critiqueText: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },
    buttonContainer: { flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-around' },
    reviewButton: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12 },
    reviewButtonText: { color: '#FFF', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#ff005e', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
    nextButtonText: { color: '#102220', fontWeight: 'bold' },
});

export default NewlywedSyncCheckGame;
