
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const options = [
    'Quiet + Caffeine + Support',
    'Sleepy + Drink + Walk',
    'Stormy + Breakfast + Responsibility',
];

const TheNeedsDecoderGame = () => {
    const [selected, setSelected] = useState(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#191022', '#230f15']} style={styles.container}>
                <Text style={styles.header}>The Needs Decoder</Text>
                <Text style={styles.subHeader}>Partner A sent:</Text>

                <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>☁️</Text>
                    <Text style={styles.emoji}>☕</Text>
                    <Text style={styles.emoji}>🐕</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {options.map((option, i) => (
                        <TouchableOpacity 
                            key={i} 
                            style={[styles.option, selected === i && styles.selectedOption]} 
                            onPress={() => setSelected(i)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                            {selected === i && <MaterialIcons name="check-circle" size={24} color="#ff034a" />}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>SUBMIT DECODING</Text>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#191022' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    header: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    subHeader: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 24 },
    emojiContainer: { flexDirection: 'row', gap: 24, marginBottom: 32 },
    emoji: { fontSize: 64 },
    optionsContainer: { width: '100%', gap: 12, marginBottom: 32 },
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    selectedOption: { backgroundColor: 'rgba(255, 3, 74, 0.2)', borderColor: '#ff034a' },
    optionText: { color: '#fff', fontSize: 16 },
    submitButton: { width: '100%', backgroundColor: '#ff034a', padding: 16, borderRadius: 12, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default TheNeedsDecoderGame;
