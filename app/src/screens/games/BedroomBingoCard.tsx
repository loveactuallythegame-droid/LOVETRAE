import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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
            <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.bingoTile, styles.freeSpace]}
            >
                <Text style={styles.bingoIcon}>💖</Text>
                <Text style={styles.bingoText}>Free Love</Text>
            </LinearGradient>
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

                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.progressContainer}
                >
                    <Text style={styles.progressTitle}>Current Progress</Text>
                    <Text style={styles.progressSubtitle}>You're making beautiful memories together</Text>
                    <View style={styles.progressBar}>
                        <LinearGradient colors={['#db147c', '#f05d68']} style={{width: `${(activeTiles.filter(Boolean).length / 25) * 100}%`, height: '100%'}} />
                    </View>
                    <Text style={styles.progressText}>{activeTiles.filter(Boolean).length} / 25 Completed</Text>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
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
    subtitle: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 18, 
        color: '#db147c', 
        textAlign: 'center', 
        marginBottom: 20,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: 8,
        borderRadius: 12,
    },
    lottiePlaceholder: { 
        height: 100, 
        width: 100, 
        alignSelf: 'center', 
        marginBottom: 20, 
        backgroundColor: '#ffffff20', 
        borderRadius: 50 
    },
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    activeTile: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: '#db147c',
    },
    freeSpace: {
        borderRadius: 16,
    },
    bingoIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    bingoText: {
        fontFamily: 'SweetPink-Regular',
        fontSize: 10,
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    progressContainer: { 
        borderRadius: 16,
        padding: 20, 
        marginTop: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    progressTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 22, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    },
    progressSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 14, 
        color: '#ffffff', 
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 4,
        borderRadius: 8,
    },
    progressBar: { 
        height: 10, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 5, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 16, 
        color: '#ffffff', 
        alignSelf: 'flex-end', 
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    }
});

export default BedroomBingoCardScreen;