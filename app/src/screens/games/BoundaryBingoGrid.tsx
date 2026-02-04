import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bingoTile, isVerified && styles.verifiedTile]}
    >
        <TouchableOpacity 
            style={styles.tileButton}
            onPress={onPress}
        >
            <Text style={styles.tileIcon}>{isVerified ? '✔' : ' '}</Text>
            <Text style={styles.bingoText}>{text}</Text>
        </TouchableOpacity>
    </LinearGradient>
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Establish healthy boundaries! Clear communication protects both partners' wellbeing.</Text>
                </View>
            </View>
            
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

                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.progressContainer}
                    >
                        <Text style={styles.progressTitle}>Integrity Scan Result: {progress.toFixed(1)}%</Text>
                        <View style={styles.progressBar}>
                            <LinearGradient colors={['#db147c', '#f05d68']} style={{width: `${progress}%`, height: '100%'}} />
                        </View>
                         <Text style={styles.progressSubtitle}>{verifiedCount}/{bingoTilesData.length} boundary squares mutually verified.</Text>
                    </LinearGradient>
                </View>

                <LinearGradient
                    colors={['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sidebar}
                >
                    <Text style={styles.sidebarTitle}>Firmware Auditor</Text>
                    <Text style={styles.auditorName}>Marcie</Text>
                    <Text style={styles.auditorQuote}>"Integrity scan complete. Boundary verified."</Text>
                    <TouchableOpacity style={styles.sidebarButton}>
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.sidebarButtonText}>Upload Evidence</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#120a12' },
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
    content: { flexDirection: 'row', padding: 20 },
    mainContent: { flex: 3 },
    sidebar: { 
        flex: 1, 
        marginLeft: 20, 
        borderRadius: 16, 
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
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
        backgroundColor: 'rgba(26, 13, 23, 0.6)',
        borderRadius: 24,
        padding: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    bingoTile: {
        width: '23%', 
        aspectRatio: 1,
        margin: '1%',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-between',
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
        justifyContent: 'space-between',
        padding: 10,
    },
    verifiedTile: {
        borderColor: '#db147c',
        shadowColor: '#db147c',
        shadowRadius: 10,
        shadowOpacity: 0.4,
    },
    tileIcon: { 
        color: '#ffffff', 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    bingoText: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ffffff', 
    },
    progressContainer: { 
        marginTop: 20, 
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
    progressTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 18, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    },
    progressBar: { 
        height: 12, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 6, 
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textAlign: 'center', 
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 4,
        borderRadius: 8,
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
    auditorName: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 8,
    },
    auditorQuote: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontStyle: 'italic', 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    sidebarButton: { 
        padding: 12, 
        borderRadius: 12, 
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
        borderRadius: 12,
        paddingVertical: 12,
    },
    sidebarButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c',
        fontWeight: 'bold',
    }
});

export default BoundaryBingoGridScreen;