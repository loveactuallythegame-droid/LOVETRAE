
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    <TouchableOpacity 
        style={[styles.bingoTile, isActive && styles.activeTile, isFree && styles.freeSpace]}
        onPress={onPress}
        disabled={isFree}
    >
        {isFree && <Text style={styles.freeSpaceIcon}>💖</Text>}
        <Text style={styles.bingoText}>{text}</Text>
    </TouchableOpacity>
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

                    <View style={styles.sidebar}>
                        <View style={styles.hostBubble}>
                            <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                            <Text style={styles.hostQuote}>"Keep the fire burning, lovebirds! One more square for a diagonal Bingo!"</Text>
                        </View>
                        <View style={styles.multipliersContainer}>
                            <Text style={styles.sidebarTitle}>Active Multipliers</Text>
                            <Text style={styles.multiplierText}>Evening Bonus: 2x Progress</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <Text style={styles.footerTitle}>Bingo Status: {completedLines}/5 Lines Complete</Text>
                 <View style={styles.progressBar}>
                    <LinearGradient colors={['#ff006d', '#ff006d80']} style={{width: `${(completedLines / 5) * 100}%`, height: '100%'}} />
                </View>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>SUBMIT LINE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181116' },
    background: { ...StyleSheet.absoluteFillObject },
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
    sidebar: { flex: 1, marginLeft: 20 },
    hostBubble: { 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20
    },
    hostName: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 18 },
    hostQuote: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontStyle: 'italic' },
    multipliersContainer: { 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 15,
    },
    sidebarTitle: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' },
    multiplierText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 14 },
    bingoTile: {
        width: '18%',
        aspectRatio: 1,
        margin: '1%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeTile: {
        backgroundColor: '#230f18',
        borderColor: '#f425af',
    },
    freeSpace: { backgroundColor: 'rgba(255, 0, 109, 0.2)', borderColor: '#ff006d' },
    freeSpaceIcon: { fontSize: 24, color: '#ff006d' },
    bingoText: { fontFamily: 'SweetPink-Regular', fontSize: 10, color: '#FFF', textAlign: 'center', textTransform: 'uppercase' },
    footer: { padding: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    footerTitle: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 10 },
    progressBar: { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 15 },
    submitButton: { backgroundColor: '#ff006d', padding: 15, borderRadius: 99, alignItems: 'center' },
    submitButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default BedroomBingoGame1Screen;
