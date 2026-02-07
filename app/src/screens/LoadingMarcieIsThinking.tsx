
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingMarcieIsThinkingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#2A002A', '#5A005A']}
                style={styles.background} 
            />
            
            <View style={styles.mainContent}>
                <View style={styles.animationContainer}>
                    <Text style={styles.lottiePlaceholder}>[Lottie Animation]</Text>
                </View>

                <Text style={styles.title}>MARCIE IS THINKING...</Text>
                <Text style={styles.subtitle}>VARIANT 5 OF 10</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBar} />
                    </View>
                    <Text style={styles.progressText}>SYNCING NODES... 50%</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerTitle}>GAME INSIGHT</Text>
                <Text style={styles.footerText}>"Communication is the bridge between two hearts. Take this moment to breathe and reflect on one thing you appreciate about your partner today."</Text>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    animationContainer: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 10,
        borderColor: '#FF4081',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#00FFFF',
        shadowRadius: 20,
        shadowOpacity: 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    lottiePlaceholder: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#FF4081', fontSize: 18, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
    progressContainer: { marginTop: 32, width: '80%' },
    progressBarBackground: { height: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2, overflow: 'hidden' },
    progressBar: { height: '100%', width: '50%' },
    progressText: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', textAlign: 'center', marginTop: 8, fontWeight: 'bold' },
    footer: { padding: 24, backgroundColor: 'rgba(255,255,255,0.1)', margin: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    footerTitle: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 10, marginBottom: 8, fontWeight: 'bold' },
    footerText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});

export default LoadingMarcieIsThinkingScreen;
