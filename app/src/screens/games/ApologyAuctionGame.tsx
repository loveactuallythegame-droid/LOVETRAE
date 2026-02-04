import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Evaluate apologies based on authenticity! Genuine remorse is the key to healing.</Text>
                </View>
            </View>
            
            <Header title="Apology Auction" />
            <View style={styles.content}>
                <LinearGradient
                    colors={['#db147c', '#f05d68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.auctionItemContainer}
                >
                    <Text style={styles.auctionItemText}>"{auctionItem}"</Text>
                </LinearGradient>

                <View style={styles.biddingContainer}>
                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sliderContainer}
                    >
                        <Text style={styles.partnerLabel}>Partner A</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerARating}
                            onValueChange={setPartnerARating}
                            minimumTrackTintColor="#ffffff"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                            thumbTintColor="#db147c"
                        />
                        <Text style={styles.ratingText}>{partnerARating}%</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sliderContainer}
                    >
                        <Text style={styles.partnerLabel}>Partner B</Text>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerBRating}
                            onValueChange={setPartnerBRating}
                            minimumTrackTintColor="#ffffff"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                            thumbTintColor="#db147c"
                        />
                        <Text style={styles.ratingText}>{partnerBRating}%</Text>
                    </LinearGradient>
                </View>

                <LinearGradient
                    colors={['#ff7600', '#ffef1f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hostContainer}
                >
                    <Text style={styles.hostQuote}>"That apology smells like week-old fish."</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </LinearGradient>

                 <TouchableOpacity style={styles.nextButton}>
                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.nextButtonText}>Next Auction</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#13070c' },
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
    content: { flex: 1, padding: 20, justifyContent: 'space-around' },
    auctionItemContainer: {
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    auctionItemText: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 32, 
        color: '#ffffff', 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    biddingContainer: { marginBottom: 20 },
    sliderContainer: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    partnerLabel: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 16, 
        color: '#ffffff', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 18, 
        color: '#ffffff', 
        textAlign: 'right',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    hostContainer: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hostQuote: { 
        fontFamily: 'SweetPink-Regular', 
        fontStyle: 'italic', 
        fontSize: 18, 
        color: '#ffffff', 
        textAlign: 'center', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 12,
    },
    hostName: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 16, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nextButton: {
        padding: 20,
        borderRadius: 15,
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
        borderRadius: 15,
    },
    nextButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 18, 
        color: '#ffffff', 
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});

export default ApologyAuctionGameScreen;