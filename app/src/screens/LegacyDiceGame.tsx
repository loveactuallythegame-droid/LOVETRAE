
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Dice = ({ title, value, icon }) => (
    <View style={styles.dice}>
        <Text style={{fontSize: 40}}>{icon}</Text>
        <Text style={styles.diceValue}>{value}</Text>
        <Text style={styles.diceTitle}>{title}</Text>
    </View>
);

const LegacyDiceGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>LEGACY DICE ARENA</Text>
                <Text style={styles.subtitle}>Roll your future. Record your legacy.</Text>

                <View style={styles.diceContainer}>
                    <Dice title="CHILDREN" value="3" icon="👶"/>
                    <Dice title="GOLDEN RETRIEVERS" value="2" icon="🐶"/>
                    <Dice title="LOYALTY SCORE" value="88%" icon="💖"/>
                </View>

                <TouchableOpacity style={styles.recordButton}>
                    <Text style={styles.recordButtonText}>RECORD LEGACY</Text>
                </TouchableOpacity>
                
                {/* Waveform visualization would go here */}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { alignItems: 'center', padding: 24 },
    title: { fontSize: 48, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 32 },
    diceContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 32, gap: 16 },
    dice: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        minWidth: 120,
        flex: 1,
    },
    diceValue: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
    diceTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 10, marginTop: 8, fontWeight: 'bold' },
    recordButton: {
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 32,
        backgroundColor: '#FF4081',
    },
    recordButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 16 },
});

export default LegacyDiceGameScreen;
