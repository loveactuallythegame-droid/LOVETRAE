
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
                <LinearGradient colors={['#102222', '#1a2e2e']} style={styles.background} />
                <View style={styles.wagerContainer}>
                    <Text style={styles.wagerTitle}>Final Round Wager</Text>
                    <Text style={styles.wagerSubtitle}>Place your bet before the final question is revealed.</Text>
                    {/* Wager input and button would go here */}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#1a2e2e']} style={styles.background} />
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>JEOPARDY!: <Text style={{color: '#ff005e'}}>REBUILDING</Text></Text>
                    <Text style={styles.playerScore}>$4,200</Text>
                </View>

                <View style={styles.gridContainer}>
                    <View style={styles.gridHeader}>
                        {categories.map(cat => <Text key={cat} style={styles.categoryTitle}>{cat}</Text>)}
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
    container: { flex: 1, backgroundColor: '#102222' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    playerScore: { color: '#facc15', fontSize: 18, fontWeight: 'bold' },
    gridContainer: { padding: 8 },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    categoryTitle: { flex: 1, color: '#ff005e', fontWeight: 'bold', fontSize: 10, textAlign: 'center' },
    gridRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    cell: { flex: 1, height: 80, backgroundColor: 'rgba(28, 39, 39, 0.8)', margin: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    cellAnswered: { backgroundColor: 'rgba(28, 39, 39, 0.3)' },
    cellText: { color: '#facc15', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(250, 204, 21, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
    footer: { padding: 16, alignItems: 'center' },
    buzzButton: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ff005e', justifyContent: 'center', alignItems: 'center', shadowColor: '#11d4d4', shadowRadius: 20, shadowOpacity: 0.3 },
    buzzButtonText: { color: '#230f16', fontSize: 24, fontWeight: 'bold' },
    // Wager styles
    wagerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    wagerTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
    wagerSubtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 32 },
});

export default JeopardyRebuildingRoundScreen;
