import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const BidRadarGameScreen = () => {
    const [myBid, setMyBid] = useState('');
    const [partnerPerception, setPartnerPerception] = useState('"Are you mad at me for not helping?"');
    const [result, setResult] = useState('Partial Match');
    const [explanation, setExplanation] = useState('Marcus was actually just tired from the heat, but he wanted a hug.');

    const lockBid = () => {
        // In a real app, this would send the bid to a backend and wait for the partner's perception
        console.log('Bid locked:', myBid);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0a0f', '#0a0a0f']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Log emotional bids to track connection attempts! Recognize when you make or receive bids for attention.</Text>
                </View>
            </View>
            
            <Header title="Bid Radar" />
            <ScrollView contentContainerStyle={styles.content}>
                <LinearGradient
                    colors={['#db147c', '#f05d68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gameConsole}
                >
                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.inputSide}
                    >
                        <Text style={styles.sideTitle}>Log Your Emotional Bid</Text>
                        <Text style={styles.sideDescription}>What was an action you took today that had hidden emotional meaning?</Text>
                        <TextInput
                            style={styles.bidInput}
                            value={myBid}
                            onChangeText={setMyBid}
                            placeholder="e.g., I sighed loudly while I was doing the dishes..."
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            multiline
                        />
                        <TouchableOpacity style={styles.lockButton} onPress={lockBid}>
                            <LinearGradient
                                colors={['#ffffff', '#ffffff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.lockButtonText}>Lock Bid</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.revealSide}
                    >
                        <Text style={styles.sideTitle}>The Reveal</Text>
                        <Text style={styles.perceptionLabel}>Sarah's Perception</Text>
                        <Text style={styles.perceptionText}>{partnerPerception}</Text>
                        
                        <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.resultContainer}
                        >
                           <Text style={styles.resultLabel}>{result}</Text>
                           <Text style={styles.explanationText}>{explanation}</Text>
                        </LinearGradient>

                         <View style={styles.statsContainer}>
                            <Text style={styles.statText}>Accuracy: 62%</Text>
                            <Text style={styles.statText}>Bonus: +150</Text>
                        </View>
                    </LinearGradient>
                </LinearGradient>

                <LinearGradient
                    colors={['#ff7600', '#ffef1f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.marcieContainer}
                >
                    <Text style={styles.marcieQuote}>"Oh, you thought that was a sigh for help? Cute. Marcus, honey, next time try using your words or just collapsing dramatically on the floor like a normal person."</Text>
                    <Text style={styles.marcieSignature}>Dr. Marcie Liss, Host</Text>
                </LinearGradient>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f' },
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
    content: { padding: 20 },
    gameConsole: { 
        flexDirection: 'row', 
        gap: 20, 
        marginBottom: 30,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    inputSide: { 
        flex: 1, 
        borderRadius: 16, 
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    revealSide: { 
        flex: 1, 
        borderRadius: 16, 
        padding: 20, 
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sideTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 22, 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sideDescription: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 14, 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    bidInput: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: 'rgba(219, 20, 124, 0.3)', 
        borderRadius: 12,
        padding: 15,
        color: '#FFF',
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    lockButton: { 
        padding: 15, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 20,
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
        borderRadius: 12,
        paddingVertical: 15,
    },
    lockButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 16, 
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    perceptionLabel: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        letterSpacing: 3, 
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    perceptionText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 24, 
        fontStyle: 'italic', 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
    },
    resultContainer: { 
        borderRadius: 12, 
        padding: 15, 
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    resultLabel: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        textAlign: 'center', 
        fontSize: 14, 
        textTransform: 'uppercase', 
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    },
    explanationText: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 16, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around' 
    },
    statText: {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    marcieContainer: { 
        borderRadius: 16, 
        padding: 20, 
        borderLeftWidth: 4, 
        borderColor: '#ffffff',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    marcieQuote: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 18, 
        fontStyle: 'italic', 
        lineHeight: 26,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
    },
    marcieSignature: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 12, 
        textTransform: 'uppercase', 
        marginTop: 15, 
        textAlign: 'right',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    }
});

export default BidRadarGameScreen;