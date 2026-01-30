
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// Assuming a Lottie component is available
// import LottieView from 'lottie-react-native';

const LoadingMarcieIsThinkingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['rgba(16, 34, 34, 1)', 'rgba(10, 10, 10, 1)']} 
                style={styles.background} 
            />
            
            <View style={styles.mainContent}>
                <View style={styles.animationContainer}>
                    {/* <LottieView source={require('./marcie_thinking.json')} autoPlay loop style={styles.lottie} /> */}
                    <Text style={styles.lottiePlaceholder}>[Lottie Animation]</Text>
                </View>

                <Text style={styles.title}>Marcie is Thinking...</Text>
                <Text style={styles.subtitle}>Variant 5 of 10</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar} />
                    <Text style={styles.progressText}>Syncing Nodes... 50%</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerTitle}>Game Insight</Text>
                <Text style={styles.footerText}>"Communication is the bridge between two hearts. Take this moment to breathe and reflect on one thing you appreciate about your partner today."</Text>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    animationContainer: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 10,
        borderColor: '#fc0c84',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#13ecec',
        shadowRadius: 20,
        shadowOpacity: 0.4,
    },
    lottie: { width: 150, height: 150 },
    lottiePlaceholder: { color: '#FFF', fontSize: 18 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(252, 12, 132, 0.7)', fontSize: 18, textAlign: 'center' },
    progressContainer: { marginTop: 32, width: '80%' },
    progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    progressText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', textAlign: 'center', marginTop: 8 },
    footer: { padding: 24, backgroundColor: 'rgba(255,255,255,0.05)', margin: 16, borderRadius: 16 },
    footerTitle: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: 10, marginBottom: 8 },
    footerText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});

export default LoadingMarcieIsThinkingScreen;
