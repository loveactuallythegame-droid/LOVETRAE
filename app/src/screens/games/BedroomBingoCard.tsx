
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';
// Placeholder for Lottie Animation
const LottieView = View; 

const bingoTilesData = [
    { icon: 'spa', text: 'Massage' }, { icon: 'forum', text: 'Deep Talk' }, { icon: 'co2', text: 'New Scents' }, { icon: 'music_note', text: 'Music Sync' }, { icon: 'auto_awesome', text: 'Stargaze' },
    { icon: 'flare', text: 'Candlelight' }, { icon: 'nightlight', text: 'Slow Dance' }, { icon: 'record_voice_over', text: 'Whisper' }, { icon: 'flight', text: 'Feather' }, { icon: 'bathtub', text: 'Bath Time' },
    { icon: 'menu_book', text: 'Read Aloud' }, { icon: 'bed', text: 'Cuddle' }, { icon: 'favorite', text: 'Free Love', isFree: true }, { icon: 'visibility', text: 'Eye Contact' }, { icon: 'pan_tool', text: 'Holding' },
    { icon: 'edit_note', text: 'Love Letter' }, { icon: 'restaurant', text: 'Dinner Date' }, { icon: 'help_center', text: 'Truth/Dare' }, { icon: 'directions_walk', text: 'Night Walk' }, { icon: 'cloud', text: 'Dreams' },
    { icon: 'queue_music', text: 'Playlist' }, { icon: 'lightbulb', text: 'Soft Light' }, { icon: 'oil_barrel', text: 'Oils' }, { icon: 'air', text: 'Breathing' }, { icon: 'family_restroom', text: 'Warm Hug' },
];

const BingoTile = ({ icon, text, isActive, isFree, onPress }: { icon: string, text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => {
    if (isFree) {
        return (
            <View style={[styles.bingoTile, styles.freeSpace]}>
                <Text style={styles.bingoIcon}>💖</Text>
                <Text style={styles.bingoText}>Free Love</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={[styles.bingoTile, isActive && styles.activeTile]} onPress={onPress}>
            <Text style={styles.bingoIcon}>{icon}</Text>
            <Text style={styles.bingoText}>{text}</Text>
        </TouchableOpacity>
    );
};

const BedroomBingoCardScreen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((_, i) => i % 3 === 0) // Mock active tiles
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f19', '#120d09']} style={styles.background} />
            <Header title="Bedroom Bingo" />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>Ignite your connection through 25 shared cosmic experiences.</Text>
                
                {/* Marcie's "Judgey Nods" Lottie Animation Placeholder */}
                <LottieView style={styles.lottiePlaceholder} />

                <View style={styles.bingoGrid}>
                    {bingoTilesData.map((tile, index) => (
                        <BingoTile 
                            key={index}
                            {...tile}
                            isActive={!!activeTiles[index]}
                            onPress={() => toggleTile(index)}
                        />
                    ))}
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>Current Progress</Text>
                    <Text style={styles.progressSubtitle}>You're making beautiful memories together</Text>
                    <View style={styles.progressBar}>
                        <LinearGradient colors={['#ee2b9d', '#8b5cf6']} style={{width: `${(activeTiles.filter(Boolean).length / 25) * 100}%`, height: '100%'}} />
                    </View>
                    <Text style={styles.progressText}>{activeTiles.filter(Boolean).length} / 25 Completed</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { padding: 20 },
    subtitle: { fontFamily: 'SweetPink-Regular', fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
    lottiePlaceholder: { height: 100, width: 100, alignSelf: 'center', marginBottom: 20, backgroundColor: '#ffffff20', borderRadius: 50 },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: -5,
    },
    bingoTile: {
        width: '18%', 
        aspectRatio: 1,
        margin: '1%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeTile: {
        backgroundColor: 'rgba(238, 43, 157, 0.2)',
        borderColor: '#ee2b9d',
    },
    freeSpace: {
        backgroundColor: '#fc0c84',
    },
    bingoIcon: {
        fontSize: 24,
        color: '#FFF',
    },
    bingoText: {
        fontFamily: 'SweetPink-Regular',
        fontSize: 10,
        color: '#FFF',
        textAlign: 'center',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    progressContainer: { 
        backgroundColor: 'rgba(34, 16, 26, 0.4)', 
        borderRadius: 16,
        padding: 20, 
        marginTop: 30
    },
    progressTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 22, color: '#FFF' },
    progressSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#94a3b8', marginBottom: 15 },
    progressBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' },
    progressText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 16, color: '#FFF', alignSelf: 'flex-end', marginTop: 10 }
});

export default BedroomBingoCardScreen;
