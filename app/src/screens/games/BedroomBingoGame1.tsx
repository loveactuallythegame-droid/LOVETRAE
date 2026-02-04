import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const bingoTilesData = [
    'Slow Dance', 'Eye Contact', 'New Location', 'Candlelight', 'Massage',
    'Whisper', 'Hold Hands', 'Compliment', 'Deep Talk', 'Playlist',
    'Morning Hug', 'Cuddle', 'Free Space', 'Kiss', 'Date Night',
    'Surprise', 'Nature Walk', 'Soft Light', 'Truth/Dare', 'Bath Time',
    'Breakfast', 'Reading', 'Stargazing', 'Cooking', 'Sweet Note',
];

const BingoTile = ({ text, isActive, isFree, onPress }: { text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bingoTile, isActive && styles.activeTile, isFree && styles.freeSpace]}
    >
        <TouchableOpacity 
            style={styles.tileButton}
            onPress={onPress}
            disabled={isFree}
        >
            {isFree && <Text style={styles.freeSpaceIcon}>💖</Text>}
            <Text style={styles.bingoText}>{text}</Text>
        </TouchableOpacity>
    </LinearGradient>
);

const BedroomBingoGame1Screen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((t, i) => t === 'Free Space' || i % 4 === 0) // Mock active tiles
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    const completedLines = 1; // Mock data

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Connect intimately through shared experiences! Each tile represents a new way to deepen your bond.</Text>
                </View>
            </View>
            
            <Header title="Bedroom Bingo" />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.gameContainer}>
                    <View style={styles.bingoGrid}>
                        {bingoTilesData.map((text, index) => (
                            <BingoTile 
                                key={index}
                                text={text}
                                isActive={!!activeTiles[index]}
                                isFree={text === 'Free Space'}
                                onPress={() => toggleTile(index)}
                            />
                        ))}
                    </View>

                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sidebar}
                    >
                        <LinearGradient
                            colors={['#37cf97', '#b37dec']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.hostBubble}
                        >
                            <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                            <Text style={styles.hostQuote}>"Keep the fire burning, lovebirds! One more square for a diagonal Bingo!"</Text>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.multipliersContainer}
                        >
                            <Text style={styles.sidebarTitle}>Active Multipliers</Text>
                            <Text style={styles.multiplierText}>Evening Bonus: 2x Progress</Text>
                        </LinearGradient>
                    </LinearGradient>
                </View>

            </ScrollView>
            <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.footer}
            >
                <Text style={styles.footerTitle}>Bingo Status: {completedLines}/5 Lines Complete</Text>
                 <View style={styles.progressBar}>
                    <LinearGradient colors={['#ffffff', '#ffffff80']} style={{width: `${(completedLines / 5) * 100}%`, height: '100%'}} />
                </View>
                <TouchableOpacity style={styles.submitButton}>
                    <LinearGradient
                        colors={['#ffffff', '#ffffff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.submitButtonText}>SUBMIT LINE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181116' },
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
    gameContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    bingoGrid: { 
        flex: 3,
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 10
    },
    sidebar: { 
        flex: 1, 
        marginLeft: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hostBubble: { 
        borderRadius: 16,
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
    hostName: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    hostQuote: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 14, 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    multipliersContainer: { 
        borderRadius: 16,
        padding: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    multiplierText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 4,
        borderRadius: 6,
    },
    bingoTile: {
        width: '18%',
        aspectRatio: 1,
        margin: '1%',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    tileButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    activeTile: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: '#db147c',
    },
    freeSpace: { 
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: '#db147c',
    },
    freeSpaceIcon: { 
        fontSize: 24, 
        color: '#ffffff' 
    },
    bingoText: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 10, 
        color: '#ffffff', 
        textAlign: 'center', 
        textTransform: 'uppercase',
    },
    footer: { 
        padding: 20, 
        borderTopWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    footerTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    },
    progressBar: { 
        height: 12, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 6, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    submitButton: { 
        padding: 15, 
        borderRadius: 99, 
        alignItems: 'center',
        marginTop: 10,
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
        borderRadius: 99,
        paddingVertical: 15,
    },
    submitButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 16, 
        fontWeight: 'bold',
    }
});

export default BedroomBingoGame1Screen;