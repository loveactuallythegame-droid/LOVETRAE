
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Dice = ({ title, value, icon }) => (
    <View style={styles.dice}>
        {/* Icon would go here */}
        <Text style={styles.diceValue}>{value}</Text>
        <Text style={styles.diceTitle}>{title}</Text>
    </View>
);

const LegacyDiceGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#221022', '#482348']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Legacy Dice Arena</Text>
                <Text style={styles.subtitle}>Roll your future. Record your legacy.</Text>

                <View style={styles.diceContainer}>
                    <Dice title="Children" value="3" />
                    <Dice title="Golden Retrievers" value="2" />
                    <Dice title="Loyalty Score" value="88%" />
                </View>

                <TouchableOpacity style={styles.recordButton}>
                    <Text style={styles.recordButtonText}>Record Legacy</Text>
                </TouchableOpacity>
                
                {/* Waveform visualization would go here */}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#221017' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { alignItems: 'center', padding: 24 },
    title: { fontSize: 48, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32 },
    diceContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 32 },
    dice: {
        backgroundColor: 'rgba(72, 35, 72, 0.4)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(236, 19, 236, 0.2)',
        minWidth: 120
    },
    diceValue: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
    diceTitle: { color: '#f40b61', textTransform: 'uppercase', fontSize: 10, marginTop: 8 },
    recordButton: {
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 32,
        backgroundColor: '#f40b61',
    },
    recordButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 16 },
});

export default LegacyDiceGameScreen;
