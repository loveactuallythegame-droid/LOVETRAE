import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; // Assuming a generic header

const AmazingRaceCrossroadsScreen = () => {
    const [detour, setDetour] = useState<string | null>(null);
    const [roadblock, setRoadblock] = useState<string | null>(null);

    const handleDetourSelect = (option: string) => {
        setDetour(option);
        // In a real app, this would trigger a backend update
    }

    const handleRoadblockSelect = (partner: string) => {
        setRoadblock(partner);
        // In a real app, this would trigger a backend update
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#1a2a2a']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>At relationship crossroads, choices matter! Each decision shapes your journey together. Choose wisely!</Text>
                </View>
            </View>
            
            <Header title="Amazing Race: Crossroads" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.decisionHub}>
                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <Text style={styles.cardTitle}>WORD-WOUND PROTOCOL</Text>
                        <Text style={styles.cardSubtitle}>PHASE 04: ACTIVE</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <Text style={styles.hubTitle}>DETOUR</Text>
                        <Text style={styles.hubDescription}>Choose your communication style for the next 500 miles:</Text>
                        <TouchableOpacity 
                            style={[styles.optionButton, detour === 'candor' && styles.selectedOption]}
                            onPress={() => handleDetourSelect('candor')}
                        >
                            <Text style={styles.optionTitle}>Radical Candor</Text>
                            <Text style={styles.optionDescription}>High intensity, direct feedback, zero filters.</Text>
                        </TouchableOpacity>
                        <Text style={styles.orText}>-- OR --</Text>
                        <TouchableOpacity 
                            style={[styles.optionButton, detour === 'soft' && styles.selectedOption]}
                             onPress={() => handleDetourSelect('soft')}
                        >
                            <Text style={styles.optionTitle}>Softened Start-up</Text>
                            <Text style={styles.optionDescription}>Low impact, high empathy, gradual entry.</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <Text style={[styles.hubTitle, {color: '#ffffff'}]}>ROADBLOCK</Text>
                        <Text style={styles.hubDescription}>A personal growth task for ONE partner only:</Text>
                         <View style={styles.roadblockTask}>
                            <Text style={styles.optionTitle}>Mirror Meditation</Text>
                            <Text style={styles.optionDescription}>Facing self-criticism without projection. Takes approx 20 mins.</Text>
                        </View>
                        <TouchableOpacity style={styles.roadblockButton} onPress={() => handleRoadblockSelect('user')}>
                            <Text style={styles.roadblockButtonText}>I'll Take This Task</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                 {/* Simplified representation of the map and moderator for mobile */}
                 <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.moderatorCard}
                >
                    <Text style={styles.moderatorName}>Dr. Marcie Liss</Text>
                    <Text style={styles.moderatorTitle}>Race Moderator</Text>
                    <Text style={styles.moderatorQuote}>"Phase 4 Word-Wound Protocol is active. Choose your path wisely, the rift is closing!"</Text>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a2a2a' },
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
    scrollViewContent: { padding: 20 },
    decisionHub: { marginBottom: 20 },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    cardTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 24, 
        color: '#ffffff', 
        textTransform: 'uppercase',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    cardSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 14, 
        color: '#ff7600', 
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 8,
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    hubTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 18, 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    hubDescription: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 14, 
        color: '#ffffff', 
        marginBottom: 15,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    optionButton: { 
        padding: 15, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: 'rgba(255, 255, 255, 0.2)', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    selectedOption: { 
        borderColor: '#db147c', 
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        transform: [{ scale: 1.02 }],
    },
    optionTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 16, 
        color: '#ffffff',
        textAlign: 'center',
    },
    optionDescription: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ffffff', 
        marginTop: 5,
        textAlign: 'center',
        opacity: 0.8,
    },
    orText: { 
        textAlign: 'center', 
        color: '#db147c', 
        marginVertical: 10, 
        fontFamily: 'HolidayChristmas-Regular',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: 4,
        borderRadius: 12,
    },
    roadblockTask: { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        padding: 15, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: 'rgba(255, 118, 0, 0.3)', 
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    roadblockButton: { 
        backgroundColor: '#db147c', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    roadblockButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 14, 
        color: '#ffffff', 
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    moderatorCard: { 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    moderatorName: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    moderatorTitle: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ff7600', 
        textTransform: 'uppercase', 
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moderatorQuote: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 14, 
        color: '#ffffff', 
        textAlign: 'center', 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 12,
    },
});

export default AmazingRaceCrossroadsScreen;