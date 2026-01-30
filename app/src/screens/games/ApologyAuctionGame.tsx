
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider'; // Example slider component
import { Header } from '../../components/ui/Header';

const ApologyAuctionGameScreen = () => {
    const [partnerARating, setPartnerARating] = useState(42);
    const [partnerBRating, setPartnerBRating] = useState(12);

    const auctionItem = "I'm sorry you feel that way.";

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#13070c', '#2e1021']} style={styles.background} />
            <Header title="Apology Auction" />
            <View style={styles.content}>
                <View style={styles.auctionItemContainer}>
                    <Text style={styles.auctionItemText}>"{auctionItem}"</Text>
                </View>

                <View style={styles.biddingContainer}>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.partnerLabel}>Partner A</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerARating}
                            onValueChange={setPartnerARating}
                            minimumTrackTintColor="#f91085"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                            thumbTintColor="#FFF"
                        />
                        <Text style={styles.ratingText}>{partnerARating}%</Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.partnerLabel}>Partner B</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerBRating}
                            onValueChange={setPartnerBRating}
                            minimumTrackTintColor="#f91085"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                            thumbTintColor="#FFF"
                        />
                        <Text style={styles.ratingText}>{partnerBRating}%</Text>
                    </View>
                </View>

                <View style={styles.hostContainer}>
                    <Text style={styles.hostQuote}>"That apology smells like week-old fish."</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </View>

                 <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next Auction</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#13070c' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, padding: 20, justifyContent: 'space-around' },
    auctionItemContainer: {
        backgroundColor: 'rgba(35, 16, 26, 0.7)',
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(249, 16, 133, 0.2)',
    },
    auctionItemText: { fontFamily: 'BarbieDream-Regular', fontSize: 32, color: '#FFF', textAlign: 'center' },
    biddingContainer: { marginBottom: 20 },
    sliderContainer: {
        backgroundColor: 'rgba(35, 16, 26, 0.7)',
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
    },
    partnerLabel: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#FFF', marginBottom: 10 },
    ratingText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 18, color: '#f91085', textAlign: 'right' },
    hostContainer: {
        backgroundColor: 'rgba(35, 16, 26, 0.7)',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    hostQuote: { fontFamily: 'SweetPink-Regular', fontStyle: 'italic', fontSize: 18, color: '#FFF', textAlign: 'center', marginBottom: 10 },
    hostName: { fontFamily: 'BarbieDream-Regular', fontSize: 16, color: '#f91085' },
    nextButton: {
        backgroundColor: '#f91085',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    nextButtonText: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF', textTransform: 'uppercase' },
});

export default ApologyAuctionGameScreen;
