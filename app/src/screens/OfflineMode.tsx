
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const OfflineMode = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <View style={styles.content}>
                
                <View style={styles.iconContainer}>
                    <LinearGradient 
                        colors={['#FF4081', '#E040FB']}
                        style={styles.planet}
                    >
                        <View style={styles.wifiOffContainer}>
                            <Text style={{fontSize: 60}}>🛰️</Text>
                        </View>
                    </LinearGradient>
                </View>

                <Text style={styles.title}>SIGNAL LOST IN THE NEBULA</Text>
                <Text style={styles.subtitle}>The stars are temporarily misaligned. Please check your internet connection and try re-syncing.</Text>

                <TouchableOpacity style={styles.retryButton}>
                    <LinearGradient colors={['#00FFFF', '#00BFFF']} style={styles.retryButtonGradient}>
                        <Text style={{fontSize: 24}}>🔄</Text>
                        <Text style={styles.retryButtonText}>RETRY CONNECTION</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.miniGameButton}>
                    <Text style={{fontSize: 20}}>🎮</Text>
                    <Text style={styles.miniGameButtonText}>PLAY OFFLINE MINI-GAME</Text>
                </TouchableOpacity>

                <Text style={styles.quoteText}>"The space between stars is where we find ourselves."</Text>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconContainer: { marginBottom: 32, alignItems: 'center', justifyContent: 'center' },
    planet: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', shadowColor: '#E040FB', shadowRadius: 30, shadowOpacity: 0.5 },
    wifiOffContainer: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 99, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', fontSize: 18, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
    retryButton: { width: '80%', marginBottom: 16 },
    retryButtonGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 99, shadowColor: '#00FFFF', shadowRadius: 15, shadowOpacity: 0.4 },
    retryButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
    miniGameButton: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    miniGameButtonText: { color: '#FFF', marginLeft: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    quoteText: { fontStyle: 'italic', color: '#D1C4E9', marginTop: 32, textAlign: 'center' },
});

export default OfflineMode;
