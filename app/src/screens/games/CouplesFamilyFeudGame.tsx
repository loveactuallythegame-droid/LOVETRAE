
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const FamilyFeudAnswer = ({ rank, answer, points, revealed }: { rank: number, answer?: string, points?: number, revealed: boolean }) => (
    <View style={styles.answerRow}>
        <Text style={styles.answerRank}>{rank}</Text>
        {revealed ? (
            <>
                <Text style={styles.answerText}>{answer}</Text>
                <Text style={styles.answerPoints}>{points}</Text>
            </>
        ) : (
            <View style={styles.hiddenAnswer}><Text style={styles.hiddenText}>???</Text></View>
        )}
    </View>
);

const CouplesFamilyFeudGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120a12', '#2d1b2e']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                     <Text style={styles.headerTitle}>Couples Family Feud</Text>
                </View>

                <View style={styles.gameLayout}>
                    {/* Left Column */}
                     <View style={styles.leftColumn}>
                         <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWcKlRF_sXHoJ0XK21Jo6OTAEFtCet0bA8Sxtc5CAltmza6R46xHtMDoMlaFmPPuVSh3axAKHej7mVy5C3DJ3fXKfgBmPQ4h29VeF3SqxTIk5cNP_0ARmTX7kCLdZGVOUhNO0zEeV8JjMn9jygdv22kgT17eLytPw5N4N9yNkER-8dmh_Rp2zM7tm19pKXzcyj2KTS5nLNRUDo9JlYFVOnF3zzfYwgZu5iXAIqj4X2UY5nGSf5eZRhRQnOG0lezxPIlYDHxzFCoJ32' }} style={styles.hostImage} />
                        <View style={styles.speechBubble}>
                            <Text style={styles.speechText}>"Honey, we all knew that was coming. Survey says...?"</Text>
                        </View>
                        <View style={styles.teamScores}>
                            <View style={styles.scoreBox}><Text style={styles.teamName}>Team Love</Text><Text style={styles.teamScore}>420</Text></View>
                            <View style={styles.scoreBox}><Text style={styles.teamName}>Team Actually</Text><Text style={styles.teamScore}>385</Text></View>
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.rightColumn}>
                        <Text style={styles.question}>Most annoying partner habit?</Text>
                        <Text style={styles.round}>Round 3: The Truth Hurts</Text>
                        
                        <View style={styles.board}>
                            <FamilyFeudAnswer rank={1} answer="Leaving towels on floor" points={42} revealed={true} />
                            <FamilyFeudAnswer rank={2} answer="Snoring like a beast" points={28} revealed={true} />
                            <FamilyFeudAnswer rank={3} revealed={false} />
                            <FamilyFeudAnswer rank={4} revealed={false} />
                            <FamilyFeudAnswer rank={5} revealed={false} />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="Your Guess..." placeholderTextColor="#777" />
                             <TouchableOpacity style={styles.submitButton}><Text style={{ color: 'white' }}>SEND</Text></TouchableOpacity>
                        </View>

                         <View style={styles.strikesContainer}>
                           <View style={styles.strikeBox}><Text style={styles.strikeX}>X</Text></View>
                           <View style={[styles.strikeBox, { opacity: 0.3 }]}><Text style={styles.strikeX}>X</Text></View>
                           <View style={[styles.strikeBox, { opacity: 0.3 }]}><Text style={styles.strikeX}>X</Text></View>
                        </View>

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 10 },
    header: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 28, color: '#ff005e', textAlign: 'center' },
    gameLayout: { flexDirection: 'row', marginTop: 20 },
    leftColumn: { flex: 1, alignItems: 'center', padding: 10 },
    rightColumn: { flex: 2, padding: 10 },
    hostImage: { width: 150, height: 220, borderRadius: 16, marginBottom: 15 },
    speechBubble: { backgroundColor: '#FFF', padding: 15, borderRadius: 20, borderBottomRightRadius: 0, marginBottom: 15 },
    speechText: { fontFamily: 'SweetPink-Regular', color: '#230f16', fontStyle: 'italic', fontSize: 16 },
    teamScores: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    scoreBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    teamName: { fontFamily: 'WonderfulSometimes-Regular', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontSize: 12 },
    teamScore: { fontFamily: 'BarbieDream-Regular', fontSize: 30, color: '#FFF' },
    question: { fontFamily: 'BarbieDream-Regular', fontSize: 32, color: '#FFF', textAlign: 'center', marginBottom: 5 },
    round: { fontFamily: 'SweetPink-Regular', color: '#ff005e', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 },
    board: { backgroundColor: 'rgba(35, 15, 22, 0.4)', borderRadius: 24, padding: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)' },
    answerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    answerRank: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#ff005e', fontStyle: 'italic', width: 30 },
    answerText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 18, color: '#FFF', flex: 1 },
    answerPoints: { backgroundColor: '#ff005e', color: 'white', borderRadius: 15, overflow:'hidden', paddingHorizontal: 15, paddingVertical: 5, fontSize: 18, fontWeight: 'bold' },
    hiddenAnswer: { backgroundColor: 'rgba(255,255,255,0.1)', flex: 1, borderRadius: 20, padding: 15, justifyContent: 'center' },
    hiddenText: { color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontWeight: 'bold' },
    inputContainer: { flexDirection: 'row', marginTop: 20 },
    input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingHorizontal: 20, color: 'white', fontSize: 18 },
    submitButton: { backgroundColor: '#ff005e', borderRadius: 16, padding: 15, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
    strikesContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    strikeBox: { width: 60, height: 60, backgroundColor: 'red', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
    strikeX: { color: 'white', fontSize: 40, fontWeight: 'bold' },
});

export default CouplesFamilyFeudGameScreen;
