
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';

const AdmirationAimArGame = () => {

    const calculateGameResults = () => {
        // Game logic would go here
        console.log("Compliment Launched!");
    }

    const Target = ({ word, color, top, left, scale = 1 }: { word: string, color: string, top: any, left: any, scale?: number }) => (
        <View style={[styles.target, { top, left, transform: [{ scale }] }]}>
            <Text style={[styles.targetText, { color, borderColor: color }]}>{word}</Text>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#221017', '#0a0a0f']} style={styles.background} />
            {/* AR background would be a camera view in a real app */}

            <View style={styles.hudHeader}>
                <Text style={styles.hudTitle}>Admiration Aim AR</Text>
                <Text style={styles.hudScore}>084,200</Text>
            </View>

            <View style={styles.gameWorld}>
                <Target word="WITTY" color="#d946ef" top="20%" left="15%" />
                <Target word="PATIENT" color="#8b5cf6" top="70%" left="20%" />
                <Target word="RESILIENT" color="#f40b61" top="40%" left="55%" scale={1.25} />
                <Target word="STRONG" color="#FFF" top="80%" left="60%" />
                <Target word="CALM" color="#d946ef" top="15%" left="70%" />

                {/* Central Crosshair */}
                <View style={styles.crosshairContainer}>
                    <View style={styles.crosshair} />
                    <View style={styles.crosshairInner} />
                </View>
            </View>

            <GlobalMarcieOverlay 
                quote="Aim for RESILIENT! Precision is key to a healthy relationship. Take the shot!" 
                characterImage={require('../../assets/marcieimages/marcie-tactical.png')} // Example image
            />

            <View style={styles.controlsFooter}>
                <View style={styles.launchButton} onTouchEnd={calculateGameResults}>
                    <Text style={styles.launchButtonText}>LAUNCH COMPLIMENT</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0f' },
    background: { ...StyleSheet.absoluteFillObject },
    hudHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(244, 11, 97, 0.1)',
    },
    hudTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', textTransform: 'uppercase' },
    hudScore: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 24, color: '#f40b61' },
    gameWorld: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    target: {
        position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
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
        borderColor: 'rgba(244, 11, 97, 0.2)',
    },
    crosshairInner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(244, 11, 97, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsFooter: {
        padding: 20,
        alignItems: 'center',
    },
    launchButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#f40b61',
        borderRadius: 15,
    },
    launchButtonText: {
        fontFamily: 'BarbieDream-Regular',
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdmirationAimArGame;
