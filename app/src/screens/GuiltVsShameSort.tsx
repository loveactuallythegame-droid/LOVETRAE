
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const GuiltVsShameSortScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#101322', '#230f16']} style={styles.background} />

            <View style={styles.header}>
                <Text style={styles.headerProgress}>8 / 10</Text>
            </View>
            
            <View style={styles.gameContainer}>
                <Text style={styles.title}>Guilt vs. Shame Sort</Text>
                <Text style={styles.subtitle}>Rapid-fire: Where does this feeling belong?</Text>

                <View style={styles.cardContainer}>
                    {/* "Fix" Button */}
                    <TouchableOpacity style={[styles.actionButton, styles.fixButton]}>
                        <Text style={styles.actionButtonText}>FIX</Text>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>"I'm unlovable"</Text>
                        <View style={styles.divider} />
                        <Text style={styles.cardDescription}>This thought focuses on who you are at your core, rather than what you've done.</Text>
                    </View>

                    {/* "Trash" Button */}
                    <TouchableOpacity style={[styles.actionButton, styles.trashButton]}>
                        <Text style={styles.actionButtonText}>TRASH</Text>
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
    container: { flex: 1, backgroundColor: '#101322' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, alignItems: 'center' },
    headerProgress: { color: '#FFF', fontWeight: 'bold' },
    gameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24, textAlign: 'center' },
    cardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' },
    actionButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    fixButton: { borderColor: '#1132d4', backgroundColor: 'rgba(17, 50, 212, 0.2)' },
    trashButton: { borderColor: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.2)' },
    actionButtonText: { color: '#FFF', fontWeight: 'bold' }, 
    card: {
        width: 280,
        height: 400,
        backgroundColor: 'rgba(25, 30, 51, 0.8)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 16 },
    divider: { height: 4, width: 48, backgroundColor: 'rgba(255, 75, 75, 0.5)', borderRadius: 2, marginBottom: 16 },
    cardDescription: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
    streakContainer: { marginTop: 24, padding: 8, borderRadius: 16, backgroundColor: 'rgba(255, 215, 0, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.3)' },
    streakText: { color: '#FFD700', fontWeight: 'bold', fontSize: 18 },
    footer: { padding: 16, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
});

export default GuiltVsShameSortScreen;
