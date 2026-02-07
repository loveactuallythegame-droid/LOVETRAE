
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const GuiltVsShameSortScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />

            <View style={styles.header}>
                <Text style={styles.headerProgress}>8 / 10</Text>
            </View>
            
            <View style={styles.gameContainer}>
                <Text style={styles.title}>GUILT VS. SHAME SORT</Text>
                <Text style={styles.subtitle}>Rapid-fire: Where does this feeling belong?</Text>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={[styles.actionButton, styles.fixButton]}>
                        <Text style={styles.actionButtonText}>🔧</Text>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>"I'M UNLOVABLE"</Text>
                        <View style={styles.divider} />
                        <Text style={styles.cardDescription}>This thought focuses on who you are at your core, rather than what you've done.</Text>
                    </View>

                    <TouchableOpacity style={[styles.actionButton, styles.trashButton]}>
                        <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.streakContainer}>
                    <Text style={styles.streakText}>STREAK: 12</Text>
                </View>
            </View>

            <View style={styles.footer}>
                {/* Footer stats would go here */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, alignItems: 'center' },
    headerProgress: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    gameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase' },
    subtitle: { fontSize: 16, color: '#D1C4E9', marginBottom: 24, textAlign: 'center' },
    cardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' },
    actionButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    fixButton: { borderColor: '#00FFFF', backgroundColor: 'rgba(0, 255, 255, 0.2)' },
    trashButton: { borderColor: '#FF4081', backgroundColor: 'rgba(255, 64, 129, 0.2)' },
    actionButtonText: { fontSize: 30 },
    card: {
        width: 280,
        height: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase' },
    divider: { height: 4, width: 48, backgroundColor: '#FF4081', borderRadius: 2, marginBottom: 16 },
    cardDescription: { fontSize: 14, color: '#D1C4E9', textAlign: 'center' },
    streakContainer: { marginTop: 24, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, backgroundColor: 'rgba(255, 215, 0, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.5)' },
    streakText: { color: '#FFD700', fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase' },
    footer: { padding: 16, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
});

export default GuiltVsShameSortScreen;
