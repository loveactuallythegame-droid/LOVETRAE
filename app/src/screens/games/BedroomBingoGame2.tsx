
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const bingoTilesData = [
    { icon: 'spa', text: 'Massage' }, { icon: 'restaurant', text: 'Dinner Date' }, { icon: 'favorite', text: 'Long Kiss' }, { icon: 'wine_bar', text: 'Nightcap' }, { icon: 'celebration', text: 'Surprise' },
    { icon: 'music_note', text: 'Slow Dance' }, { icon: 'auto_awesome', text: 'Lingerie' }, { icon: 'light', text: 'Candlelight' }, { icon: 'menu_book', text: 'Reading' }, { icon: 'bed', text: 'Breakfast' },
    { icon: 'wb_sunny', text: 'Sunrise' }, { icon: 'self_improvement', text: 'Connection' }, { text: 'Free Space', isFree: true }, { icon: 'mms', text: 'Photos' }, { icon: 'mood', text: 'Eye Contact' },
    { icon: 'local_florist', text: 'Flowers' }, { icon: 'bathtub', text: 'Shared Bath' }, { icon: 'history_edu', text: 'Love Letter' }, { icon: 'volunteer_activism', text: 'Hold Hands' }, { icon: 'rocket_launch', text: 'New Thing' },
    { icon: 'dark_mode', text: 'Stargazing' }, { icon: 'theaters', text: 'Movie Night' }, { icon: 'nights_stay', text: 'Cuddle' }, { icon: 'chat', text: 'Deep Talk' }, { icon: 'blind', text: 'Blindfold' },
];

const BingoTile = ({ icon, text, isActive, isFree, onPress }: { icon?: string, text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => (
    <TouchableOpacity 
        style={[styles.bingoTile, isActive && styles.activeTile, isFree && styles.freeSpace]}
        onPress={onPress}
        disabled={isFree}
    >
        {icon && <Text style={styles.bingoIcon}>{icon}</Text>}
        <Text style={[styles.bingoText, isFree && styles.freeSpaceText]}>{text}</Text>
    </TouchableOpacity>
);

const BedroomBingoGame2Screen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((t, i) => t.isFree || i % 5 === 0)
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    const completedCount = activeTiles.filter(Boolean).length;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181118', '#230f23', '#120a12']} style={styles.background} />
            <Header title="Bedroom Bingo" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.bingoGridContainer}>
                    <View style={styles.bingoGrid}>
                        {['B','I','N','G','O'].map(l => <Text key={l} style={styles.gridHeader}>{l}</Text>)}
                        {bingoTilesData.map((tile, index) => (
                            <BingoTile 
                                key={index}
                                {...tile}
                                isActive={!!activeTiles[index]}
                                onPress={() => toggleTile(index)}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.footerContainer}>
                     <Text style={styles.progressText}>{completedCount} / 24 Acts Completed</Text>
                    <TouchableOpacity style={styles.nextChallengeButton}>
                        <Text style={styles.nextChallengeButtonText}>Next Challenge</Text>
                    </TouchableOpacity>
                </View>

                 <View style={styles.hostContainer}>
                    <Text style={styles.hostQuote}>"Keep going, darling... you're almost there. I can feel the tension from here."</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181118' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { padding: 20 },
    bingoGridContainer: {
        backgroundColor: 'rgba(39, 27, 39, 0.3)',
        borderRadius: 24,
        padding: 15,
    },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridHeader: { width: '20%', textAlign: 'center', fontFamily: 'BarbieDream-Regular', fontSize: 28, color: 'rgba(255,0,72,0.5)', marginBottom: 10 },
    bingoTile: {
        width: '18%', 
        aspectRatio: 1,
        margin: '1%',
        backgroundColor: '#271b27',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeTile: {
        borderColor: '#f906f9',
        shadowColor: '#f906f9',
        shadowRadius: 8,
        shadowOpacity: 1
    },
    freeSpace: { 
        backgroundColor: '#ff0048',
        borderWidth: 2, 
        borderColor: 'rgba(255,255,255,0.2)'
    },
    bingoIcon: { fontSize: 28, color: '#ff0048', marginBottom: 5 },
    bingoText: { fontFamily: 'SweetPink-Regular', fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'uppercase' },
    freeSpaceText: { color: '#FFF', fontSize: 12, fontFamily: 'BarbieDream-Regular' },
    footerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 20, 
        padding: 15,
        backgroundColor: 'rgba(39, 27, 39, 0.4)',
        borderRadius: 16,
    },
    progressText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 18 },
    nextChallengeButton: { backgroundColor: '#ff0048', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
    nextChallengeButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16 },
    hostContainer: { position: 'absolute', bottom: 20, right: 20, width: '40%' },
    hostQuote: { backgroundColor: 'rgba(255,0,72,0.9)', color: '#FFF', padding: 10, borderRadius: 12, fontStyle: 'italic' },
    hostName: { fontFamily: 'SweetPink-Regular', color: '#ff0048', textAlign: 'right', marginTop: 5 },
});

export default BedroomBingoGame2Screen;
