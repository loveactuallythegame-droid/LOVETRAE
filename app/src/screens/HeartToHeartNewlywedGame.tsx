
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
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>STEP 6/8 - ALIGNMENT CHECK</Text>
                    <View style={styles.progressBar}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBarFill} />
                    </View>
                </View>

                <Text style={styles.mainQuestion}>WHAT IS OUR TOP FAMILY VALUE?</Text>

                <View style={styles.gameBoard}>
                    <PartnerAnswerCard partnerName="ALEX" answer="INTEGRITY" status="revealed" />
                    
                    <View style={styles.matchIndicator}>
                        <Text style={{fontSize: 40}}>💖</Text>
                        <View style={styles.matchTextBox}>
                            <Text style={styles.matchText}>SEMANTIC MATCH</Text>
                            <Text style={styles.matchComment}>"Slightly less messy than last week. Progress looks good."</Text>
                        </View>
                    </View>

                    <PartnerAnswerCard partnerName="JORDAN" answer="HONESTY" status="revealed" />
                </View>

                 <View style={styles.footerControls}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>REVIEW LAST ANSWER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footerButton, styles.nextButton]}>
                        <Text style={[styles.footerButtonText, {color: '#FFF'}]}>NEXT QUESTION</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, alignItems: 'center' },
    progressContainer: { width: '100%', marginBottom: 24, padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    progressText: { color: '#D1C4E9', marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    progressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4 },
    progressBarFill: { width: '75%', height: '100%', borderRadius: 4 },
    mainQuestion: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, textTransform: 'uppercase' },
    gameBoard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginBottom: 32 },
    cardContainer: { alignItems: 'center', flex: 1 },
    card: { width: '90%', height: 180, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', justifyContent: 'center', alignItems: 'center' },
    cardHidden: { justifyContent: 'center', alignItems: 'center' },
    cardHiddenText: { fontSize: 48, color: 'rgba(255, 64, 129, 0.4)' },
    cardAnswer: { color: '#FFF', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
    partnerName: { color: '#FFF', fontWeight: 'bold', marginTop: 8, textTransform: 'uppercase' },
    matchIndicator: { alignItems: 'center', marginHorizontal: 16 },
    matchTextBox: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 12, width: 180, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    matchText: { color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, marginBottom: 4 },
    matchComment: { color: '#D1C4E9', fontStyle: 'italic', fontSize: 12, textAlign: 'center' },
    footerControls: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    footerButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
    footerButtonText: { color: '#D1C4E9', fontWeight: 'bold', textTransform: 'uppercase' },
    nextButton: { backgroundColor: '#FF4081', borderColor: '#FF4081' },
});

export default HeartToHeartGameScreen;
