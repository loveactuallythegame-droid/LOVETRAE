
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PartnerAnswerCard = ({ partnerName, answer, status }) => (
    <View style={styles.cardContainer}>
        <View style={[styles.card, status === 'hidden' && styles.cardHidden]}>
            {status === 'hidden' ? (
                <Text style={styles.cardHiddenText}>?</Text>
            ) : (
                <Text style={styles.cardAnswer}>{answer}</Text>
            )}
        </View>
        <Text style={styles.partnerName}>{partnerName}</Text>
    </View>
);

const HeartToHeartGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181114', '#2d1622']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Step 6/8 - Alignment Check</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressBarFill} />
                    </View>
                </View>

                <Text style={styles.mainQuestion}>What is our top family value?</Text>

                <View style={styles.gameBoard}>
                    <PartnerAnswerCard partnerName="Alex" answer="Integrity" status="revealed" />
                    
                    <View style={styles.matchIndicator}>
                        {/* Heart icon and Dr. Marcie\'s avatar would go here */}
                         <View style={styles.matchTextBox}>
                            <Text style={styles.matchText}>Semantic Match</Text>
                            <Text style={styles.matchComment}>"Slightly less messy than last week. Progress looks good."</Text>
                        </View>
                    </View>

                    <PartnerAnswerCard partnerName="Jordan" answer="Honesty" status="revealed" />
                </View>

                 <View style={styles.footerControls}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>Review Last Answer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footerButton, styles.nextButton]}>
                        <Text style={[styles.footerButtonText, {color: '#FFF'}]}>Next Question</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181114' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    progressContainer: { width: '100%', marginBottom: 24, padding: 12, backgroundColor: 'rgba(35, 26, 30, 0.8)', borderRadius: 12 },
    progressText: { color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
    progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
    progressBarFill: { width: '75%', height: '100%', backgroundColor: '#ff0055', borderRadius: 4 },
    mainQuestion: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
    gameBoard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginBottom: 32 },
    cardContainer: { alignItems: 'center', flex: 1 },
    card: { width: '90%', height: 180, backgroundColor: 'rgba(35, 26, 30, 0.8)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 0, 85, 0.2)', justifyContent: 'center', alignItems: 'center' },
    cardHidden: { justifyContent: 'center', alignItems: 'center' },
    cardHiddenText: { fontSize: 48, color: 'rgba(255, 0, 85, 0.4)' },
    cardAnswer: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    partnerName: { color: '#FFF', fontWeight: 'bold', marginTop: 8 },
    matchIndicator: { alignItems: 'center', marginHorizontal: 16 },
    matchTextBox: { backgroundColor: 'rgba(35, 26, 30, 0.8)', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 12, width: 180 },
    matchText: { color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, marginBottom: 4 },
    matchComment: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', fontSize: 12, textAlign: 'center' },
    footerControls: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 16, backgroundColor: 'rgba(35, 26, 30, 0.8)', borderRadius: 12 },
    footerButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    footerButtonText: { color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#ff0055', borderColor: '#ff0055' },
});

export default HeartToHeartGameScreen;
