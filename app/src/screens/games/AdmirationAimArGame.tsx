import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';

const AdmirationAimArGame = () => {

    const calculateGameResults = () => {
        // Game logic would go here
        console.log("Compliment Launched!");
    }

    const Target = ({ word, color, top, left, scale = 1 }: { word: string, color: string, top: any, left: any, scale?: number }) => (
        <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.target, { top, left, transform: [{ scale }] }]}
        >
            <Text style={[styles.targetText, { color: '#ffffff' }]}>{word}</Text>
        </LinearGradient>
    )

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#221017', '#0a0a0f']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>In AR mode, aim for positive traits in your partner! This builds appreciation and strengthens your emotional connection.</Text>
                </View>
            </View>
            
            {/* AR background would be a camera view in a real app */}

            <View style={styles.hudHeader}>
                <Text style={styles.hudTitle}>Admiration Aim AR</Text>
                <LinearGradient
                    colors={['#db147c', '#f05d68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hudScoreContainer}
                >
                    <Text style={styles.hudScore}>084,200</Text>
                </LinearGradient>
            </View>

            <View style={styles.gameWorld}>
                <Target word="WITTY" color="#d946ef" top="20%" left="15%" />
                <Target word="PATIENT" color="#8b5cf6" top="70%" left="20%" />
                <Target word="RESILIENT" color="#f40b61" top="40%" left="55%" scale={1.25} />
                <Target word="STRONG" color="#FFF" top="80%" left="60%" />
                <Target word="CALM" color="#d946ef" top="15%" left="70%" />

                {/* Central Crosshair */}
                <View style={styles.crosshairContainer}>
                    <LinearGradient
                        colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.crosshair}
                    />
                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.crosshairInner}
                    />
                </View>
            </View>

            <GlobalMarcieOverlay 
                quote="Aim for RESILIENT! Precision is key to a healthy relationship. Take the shot!" 
                characterImage={require('../../assets/marcieimages/marcie-tactical.png')} // Example image
            />

            <View style={styles.controlsFooter}>
                <LinearGradient
                    colors={['#db147c', '#f05d68']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.launchButton}
                >
                    <Text style={styles.launchButtonText} onPress={calculateGameResults}>LAUNCH COMPLIMENT</Text>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f' },
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
    hudHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(244, 11, 97, 0.1)',
    },
    hudTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#db147c', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    hudScoreContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hudScore: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 24, 
        color: '#ffffff',
        fontWeight: 'bold',
    },
    gameWorld: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    target: {
        position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    targetText: {
        fontFamily: 'BarbieDream-Regular',
        fontSize: 18,
        fontWeight: 'bold',
    },
    crosshairContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crosshair: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    crosshairInner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    controlsFooter: {
        padding: 20,
        alignItems: 'center',
    },
    launchButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    launchButtonText: {
        fontFamily: 'BarbieDream-Regular',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdmirationAimArGame;