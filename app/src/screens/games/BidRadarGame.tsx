
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
            <Header title="Bid Radar" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.gameConsole}>
                    <View style={styles.inputSide}>
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
                            <Text style={styles.lockButtonText}>Lock Bid</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.revealSide}>
                        <Text style={styles.sideTitle}>The Reveal</Text>
                        <Text style={styles.perceptionLabel}>Sarah's Perception</Text>
                        <Text style={styles.perceptionText}>{partnerPerception}</Text>
                        
                        <View style={styles.resultContainer}>
                           <Text style={styles.resultLabel}>{result}</Text>
                           <Text style={styles.explanationText}>{explanation}</Text>
                        </View>

                         <View style={styles.statsContainer}>
                            <Text>Accuracy: 62%</Text>
                            <Text>Bonus: +150</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.marcieContainer}>
                    <Text style={styles.marcieQuote}>"Oh, you thought that was a sigh for help? Cute. Marcus, honey, next time try using your words or just collapsing dramatically on the floor like a normal person."</Text>
                    <Text style={styles.marcieSignature}>Dr. Marcie Liss, Host</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { padding: 20 },
    gameConsole: { flexDirection: 'row', gap: 20, marginBottom: 30 },
    inputSide: { flex: 1, backgroundColor: 'rgba(16, 34, 32, 0.6)', borderRadius: 16, padding: 20 },
    revealSide: { flex: 1, backgroundColor: 'rgba(16, 34, 32, 0.6)', borderRadius: 16, padding: 20, borderColor: '#ff00ff', borderWidth: 1 },
    sideTitle: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 22, marginBottom: 10 },
    sideDescription: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 20 },
    bidInput: { 
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: 'rgba(19, 236, 218, 0.3)', 
        borderRadius: 12,
        padding: 15,
        color: '#FFF',
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top'
    },
    lockButton: { backgroundColor: '#13ecda', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    lockButtonText: { fontFamily: 'BarbieDream-Regular', color: '#000', fontSize: 16, textTransform: 'uppercase' },
    perceptionLabel: { fontFamily: 'SweetPink-Regular', color: '#ff00ff', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 5 },
    perceptionText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 24, fontStyle: 'italic', marginBottom: 20 },
    resultContainer: { backgroundColor: 'rgba(138, 43, 226, 0.2)', borderRadius: 12, padding: 15, marginBottom: 20 },
    resultLabel: { fontFamily: 'BarbieDream-Regular', color: '#FFF', textAlign: 'center', fontSize: 14, textTransform: 'uppercase', marginBottom: 5},
    explanationText: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    marcieContainer: { backgroundColor: 'rgba(16, 34, 32, 0.8)', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderColor: '#13ecda' },
    marcieQuote: { fontFamily: 'SweetPink-Regular', color: '#FFF', fontSize: 18, fontStyle: 'italic', lineHeight: 26 },
    marcieSignature: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', marginTop: 15, textAlign: 'right' }
});

export default BidRadarGameScreen;
