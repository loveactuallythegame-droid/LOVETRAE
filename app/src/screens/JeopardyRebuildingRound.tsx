
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const JeopardyCell = ({ value, isAnswered }) => (
    <TouchableOpacity style={[styles.cell, isAnswered && styles.cellAnswered]}>
        <Text style={styles.cellText}>${value}</Text>
    </TouchableOpacity>
);

const JeopardyRebuildingRoundScreen = () => {
    const [showWager, setShowWager] = useState(false); // To toggle wager view

    // Example categories and values
    const categories = ["Forensic Truth", "Repair Tactics", "Emotional Rebuild", "Healing Syntax", "Word-Wound Protocol"];
    const values = [200, 400, 600, 800, 1000];

    const handleFinalRound = () => {
      // Logic to check if it is the final round
      setShowWager(true);
    };

    if (showWager) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
                <View style={styles.wagerContainer}>
                    <Text style={styles.wagerTitle}>FINAL ROUND WAGER</Text>
                    <Text style={styles.wagerSubtitle}>Place your bet before the final question is revealed.</Text>
                    {/* Wager input and button would go here */}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>JEOPARDY!: <Text style={{color: '#FF4081'}}>REBUILDING</Text></Text>
                    <Text style={styles.playerScore}>$4,200</Text>
                </View>

                <View style={styles.gridContainer}>
                    <View style={styles.gridHeader}>
                        {categories.map(cat => <Text key={cat} style={styles.categoryTitle}>{cat.toUpperCase()}</Text>)}
                    </View>
                    {values.map(val => (
                        <View key={val} style={styles.gridRow}>
                            {categories.map(cat => <JeopardyCell key={`${cat}-${val}`} value={val} />)}
                        </View>
                    ))}
                </View>

                 <View style={styles.footer}>
                    <TouchableOpacity style={styles.buzzButton} onPress={handleFinalRound}>
                        <Text style={styles.buzzButtonText}>BUZZ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
    playerScore: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
    gridContainer: { padding: 8 },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    categoryTitle: { flex: 1, color: '#FF4081', fontWeight: 'bold', fontSize: 10, textAlign: 'center', textTransform: 'uppercase' },
    gridRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    cell: { flex: 1, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', justifyContent: 'center', alignItems: 'center' },
    cellAnswered: { backgroundColor: 'rgba(0,0,0,0.3)' },
    cellText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', textShadowColor: '#FFD700', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
    footer: { padding: 16, alignItems: 'center' },
    buzzButton: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF4081', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF4081', shadowRadius: 20, shadowOpacity: 0.5 },
    buzzButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    // Wager styles
    wagerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    wagerTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 16, textTransform: 'uppercase' },
    wagerSubtitle: { fontSize: 18, color: '#D1C4E9', textAlign: 'center', marginBottom: 32 },
});

export default JeopardyRebuildingRoundScreen;
