import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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
            {icon && <Text style={styles.bingoIcon}>{icon}</Text>}
            <Text style={[styles.bingoText, isFree && styles.freeSpaceText]}>{text}</Text>
        </TouchableOpacity>
    </LinearGradient>
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

                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.footerContainer}
                >
                     <Text style={styles.progressText}>{completedCount} / 24 Acts Completed</Text>
                    <TouchableOpacity style={styles.nextChallengeButton}>
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.nextChallengeButtonText}>Next Challenge</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hostContainer}
                >
                    <Text style={styles.hostQuote}>"Keep going, darling... you're almost there. I can feel the tension from here."</Text>
                    <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181118' },
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
    bingoGridContainer: {
        backgroundColor: 'rgba(39, 27, 39, 0.3)',
        borderRadius: 24,
        padding: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridHeader: { 
        width: '20%', 
        textAlign: 'center', 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 28, 
        color: '#db147c', 
        marginBottom: 10,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: 4,
        borderRadius: 8,
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
        borderColor: '#db147c',
        shadowColor: '#db147c',
        shadowRadius: 8,
        shadowOpacity: 0.5
    },
    freeSpace: { 
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderWidth: 2, 
        borderColor: 'rgba(255,255,255,0.2)'
    },
    bingoIcon: { 
        fontSize: 28, 
        color: '#ffffff', 
        marginBottom: 5 
    },
    bingoText: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 10, 
        color: '#ffffff', 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    freeSpaceText: { 
        color: '#ffffff', 
        fontSize: 12, 
        fontFamily: 'BarbieDream-Regular' 
    },
    footerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 20, 
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    progressText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nextChallengeButton: { 
        paddingHorizontal: 20, 
        paddingVertical: 12, 
        borderRadius: 12,
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
        paddingVertical: 12,
    },
    nextChallengeButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    hostContainer: { 
        position: 'absolute', 
        bottom: 20, 
        right: 20, 
        width: '40%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hostQuote: { 
        color: '#ffffff', 
        padding: 10, 
        borderRadius: 12, 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    hostName: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textAlign: 'right', 
        marginTop: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
});

export default BedroomBingoGame2Screen;