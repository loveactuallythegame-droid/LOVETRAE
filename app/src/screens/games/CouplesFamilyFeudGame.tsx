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
            <View style={styles.hiddenAnswer}>
                <Text style={styles.hiddenText}>???</Text>
            </View>
        )}
    </View>
);

const CouplesFamilyFeudGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120a12', '#2d1b2e']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Discover your partner's thoughts! How well do you really know each other?</Text>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.header}>
                     <Text style={styles.headerTitle}>Couples Family Feud</Text>
                </View>

                <View style={styles.gameLayout}>
                    {/* Left Column */}
                     <View style={styles.leftColumn}>
                         <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWcKlRF_sXHoJ0XK21Jo6OTAEFtCet0bA8Sxtc5CAltmza6R46xHtMDoMlaFmPPuVSh3axAKHej7mVy5C3DJ3fXKfgBmPQ4h29VeF3SqxTIk5cNP_0ARmTX7kCLdZGVOUhNO0zEeV8JjMn9jygdv22kgT17eLytPw5N4N9yNkER-8dmh_Rp2zM7tm19pKXzcyj2KTS5nLNRUDo9JlYFVOnF3zzfYwgZu5iXAIqj4X2UY5nGSf5eZRhRQnOG0lezxPIlYDHxzFCoJ32' }} style={styles.hostImage} />
                        <LinearGradient
                            colors={['#37cf97', '#b37dec']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.speechBubble}
                        >
                            <Text style={styles.speechText}>"Honey, we all knew that was coming. Survey says...?"</Text>
                        </LinearGradient>
                        <View style={styles.teamScores}>
                            <LinearGradient
                                colors={['#db147c', '#f05d68']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scoreBox}
                            >
                                <Text style={styles.teamName}>Team Love</Text>
                                <Text style={styles.teamScore}>420</Text>
                            </LinearGradient>
                            <LinearGradient
                                colors={['#a22ac4', '#9056ef']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scoreBox}
                            >
                                <Text style={styles.teamName}>Team Actually</Text>
                                <Text style={styles.teamScore}>385</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.rightColumn}>
                        <Text style={styles.question}>Most annoying partner habit?</Text>
                        <Text style={styles.round}>Round 3: The Truth Hurts</Text>
                        
                        <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.board}
                        >
                            <FamilyFeudAnswer rank={1} answer="Leaving towels on floor" points={42} revealed={true} />
                            <FamilyFeudAnswer rank={2} answer="Snoring like a beast" points={28} revealed={true} />
                            <FamilyFeudAnswer rank={3} revealed={false} />
                            <FamilyFeudAnswer rank={4} revealed={false} />
                            <FamilyFeudAnswer rank={5} revealed={false} />
                        </LinearGradient>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="Your Guess..." placeholderTextColor="#777" />
                             <TouchableOpacity style={styles.submitButton}>
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={{ color: '#db147c' }}>SEND</Text>
                                </LinearGradient>
                             </TouchableOpacity>
                        </View>

                         <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.strikesContainer}
                         >
                           <View style={styles.strikeBox}><Text style={styles.strikeX}>X</Text></View>
                           <View style={[styles.strikeBox, { opacity: 0.3 }]}><Text style={styles.strikeX}>X</Text></View>
                           <View style={[styles.strikeBox, { opacity: 0.3 }]}><Text style={styles.strikeX}>X</Text></View>
                        </LinearGradient>

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    scrollContainer: { padding: 10 },
    header: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 28, 
        color: '#db147c', 
        textAlign: 'center',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    gameLayout: { flexDirection: 'row', marginTop: 20 },
    leftColumn: { flex: 1, alignItems: 'center', padding: 10 },
    rightColumn: { flex: 2, padding: 10 },
    hostImage: { 
        width: 150, 
        height: 220, 
        borderRadius: 16, 
        marginBottom: 15 
    },
    speechBubble: { 
        padding: 15, 
        borderRadius: 20, 
        borderBottomRightRadius: 0, 
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    speechText: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontStyle: 'italic', 
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    teamScores: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    scoreBox: { 
        borderRadius: 16, 
        padding: 10, 
        alignItems: 'center', 
        flex: 1, 
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    teamName: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        textTransform: 'uppercase', 
        color: '#ffffff', 
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    teamScore: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 30, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    question: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 32, 
        color: '#ffffff', 
        textAlign: 'center', 
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 12,
    },
    round: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#db147c', 
        textAlign: 'center', 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        marginBottom: 20,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    board: { 
        borderRadius: 24, 
        padding: 15, 
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    answerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(255,255,255,0.05)' 
    },
    answerRank: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#db147c', 
        fontStyle: 'italic', 
        width: 30,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    answerText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 18, 
        color: '#ffffff', 
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    answerPoints: { 
        backgroundColor: '#db147c', 
        color: 'white', 
        borderRadius: 15, 
        overflow:'hidden', 
        paddingHorizontal: 15, 
        paddingVertical: 5, 
        fontSize: 18, 
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    hiddenAnswer: { 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        flex: 1, 
        borderRadius: 20, 
        padding: 15, 
        justifyContent: 'center' 
    },
    hiddenText: { 
        color: 'rgba(255,255,255,0.3)', 
        fontStyle: 'italic', 
        fontWeight: 'bold' 
    },
    inputContainer: { flexDirection: 'row', marginTop: 20 },
    input: { 
        flex: 1, 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 20, 
        paddingHorizontal: 20, 
        color: 'white', 
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(219, 20, 124, 0.3)',
    },
    submitButton: { 
        borderRadius: 16, 
        padding: 15, 
        marginLeft: 10, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 15,
    },
    strikesContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    strikeBox: { 
        width: 60, 
        height: 60, 
        backgroundColor: '#db147c', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    strikeX: { 
        color: 'white', 
        fontSize: 40, 
        fontWeight: 'bold' 
    },
});

export default CouplesFamilyFeudGameScreen;