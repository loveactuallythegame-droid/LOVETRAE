
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const OfflineMode = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#230f19']} style={styles.background} />
            <View style={styles.content}>
                
                <View style={styles.iconContainer}>
                    <LinearGradient 
                        colors={['#f97316', '#dc2626']} 
                        style={styles.planet}
                    >
                        <View style={styles.wifiOffContainer}>
                            <MaterialIcons name="wifi-off" size={60} color="#FFF" />
                        </View>
                    </LinearGradient>
                </View>

                <Text style={styles.title}>Signal Lost in the Nebula</Text>
                <Text style={styles.subtitle}>The stars are temporarily misaligned. Please check your internet connection and try re-syncing.</Text>

                <TouchableOpacity style={styles.retryButton}>
                    <LinearGradient colors={['#13ecec', '#0891b2']} style={styles.retryButtonGradient}>
                        <MaterialIcons name="sync" size={24} color="#FFF" />
                        <Text style={styles.retryButtonText}>Retry Connection</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.miniGameButton}>
                    <MaterialIcons name="videogame-asset" size={20} color="#FFF" />
                    <Text style={styles.miniGameButtonText}>Play Offline Mini-Game</Text>
                </TouchableOpacity>

                <Text style={styles.quoteText}>"The space between stars is where we find ourselves."</Text>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconContainer: { marginBottom: 32, alignItems: 'center', justifyContent: 'center' },
    planet: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', shadowColor: '#fb923c', shadowRadius: 30, shadowOpacity: 0.5 },
    wifiOffContainer: { backgroundColor: 'rgba(35,15,25,0.8)', borderRadius: 99, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
    subtitle: { color: '#9db9b9', fontSize: 18, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
    retryButton: { width: '80%', marginBottom: 16 },
    retryButtonGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 99, shadowColor: '#13ecec', shadowRadius: 15, shadowOpacity: 0.4 },
    retryButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
    miniGameButton: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    miniGameButtonText: { color: '#FFF', marginLeft: 8, fontWeight: '600' },
    quoteText: { fontStyle: 'italic', color: 'rgba(157,185,185,0.6)', marginTop: 32, textAlign: 'center' },
});

export default OfflineMode;
