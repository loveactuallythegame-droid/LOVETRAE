
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';
// Placeholder for Lottie Animation
const LottieView = View; 

const bingoTilesData = [
    'Said No without Guilt', 'Respected Space', 'Digital Privacy', 'Honest Check-in',
    'Set Time Limit', 'Expressed Need', 'Honored Silences', 'Physical Bounds',
    'Financial Clarity', 'Social Battery', 'Work Life Sync', 'Priority Shield',
    'Vulnerability Safe', 'Conflict Resolution', 'No Over-explaining', 'Mutual Support',
];

const BingoTile = ({ text, isVerified, onPress }: { text: string, isVerified: boolean, onPress: () => void }) => (
    <TouchableOpacity 
        style={[styles.bingoTile, isVerified && styles.verifiedTile]}
        onPress={onPress}
    >
        <Text style={styles.tileIcon}>{isVerified ? '✔' : ' '}</Text>
        <Text style={styles.bingoText}>{text}</Text>
    </TouchableOpacity>
);

const BoundaryBingoGridScreen = () => {
    const [verifiedTiles, setVerifiedTiles] = useState<boolean[]>(
        bingoTilesData.map((_, i) => i % 3 === 0) // Mock verified tiles
    );

    const toggleTile = (index: number) => {
        const newVerifiedTiles = [...verifiedTiles];
        newVerifiedTiles[index] = !newVerifiedTiles[index];
        setVerifiedTiles(newVerifiedTiles);
    };
    
    const verifiedCount = verifiedTiles.filter(Boolean).length;
    const progress = (verifiedCount / bingoTilesData.length) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f16', '#120a12']} style={styles.background} />
            <Header title="Boundary Bingo" />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.mainContent}>
                     {/* Marcie's "Judgey Nods" Lottie Animation Placeholder */}
                    <LottieView style={styles.lottiePlaceholder} />
                    <View style={styles.bingoGrid}>
                        {bingoTilesData.map((text, index) => (
                            <BingoTile 
                                key={index}
                                text={text}
                                isVerified={!!verifiedTiles[index]}
                                onPress={() => toggleTile(index)}
                            />
                        ))}
                    </View>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressTitle}>Integrity Scan Result: {progress.toFixed(1)}%</Text>
                        <View style={styles.progressBar}>
                            <LinearGradient colors={['#f80b5a', '#8a2be2']} style={{width: `${progress}%`, height: '100%'}} />
                        </View>
                         <Text style={styles.progressSubtitle}>{verifiedCount}/{bingoTilesData.length} boundary squares mutually verified.</Text>
                    </View>
                </View>

                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Firmware Auditor</Text>
                    <Text style={styles.auditorName}>Marcie</Text>
                    <Text style={styles.auditorQuote}>"Integrity scan complete. Boundary verified."</Text>
                    <TouchableOpacity style={styles.sidebarButton}><Text style={styles.sidebarButtonText}>Upload Evidence</Text></TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#120a12' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flexDirection: 'row', padding: 20 },
    mainContent: { flex: 3 },
    sidebar: { flex: 1, marginLeft: 20, backgroundColor: '#1a0d17', borderRadius: 16, padding: 20, borderColor: '#49223f', borderWidth: 1 },
    lottiePlaceholder: { height: 100, width: 100, alignSelf: 'center', marginBottom: 20, backgroundColor: '#ffffff20', borderRadius: 50 },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#1a0d17',
        borderRadius: 24,
        padding: 10,
        borderColor: '#49223f',
        borderWidth: 1,
    },
    bingoTile: {
        width: '23%', 
        aspectRatio: 1,
        margin: '1%',
        backgroundColor: '#230f16',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#49223f',
    },
    verifiedTile: {
        borderColor: '#f425c0',
        shadowColor: '#f425c0',
        shadowRadius: 10,
        shadowOpacity: 0.4,
    },
    tileIcon: { color: '#f80b5a', fontSize: 20, fontWeight: 'bold' },
    bingoText: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: '#FFF', },
    progressContainer: { marginTop: 20, backgroundColor: 'rgba(26, 13, 23, 0.6)', borderRadius: 16, padding: 15 },
    progressTitle: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 18, textAlign: 'center' },
    progressBar: { height: 12, backgroundColor: '#49223f', borderRadius: 6, marginVertical: 10 },
    progressSubtitle: { fontFamily: 'SweetPink-Regular', color: '#cb90bc', textAlign: 'center', fontSize: 12 },
    sidebarTitle: { fontFamily: 'SweetPink-Regular', color: '#f80b5a', textTransform: 'uppercase' },
    auditorName: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 24 },
    auditorQuote: { fontFamily: 'SweetPink-Regular', color: '#cb90bc', fontStyle: 'italic', marginBottom: 20 },
    sidebarButton: { backgroundColor: '#f80b5a', padding: 12, borderRadius: 12, alignItems: 'center' },
    sidebarButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF' },
});

export default BoundaryBingoGridScreen;
