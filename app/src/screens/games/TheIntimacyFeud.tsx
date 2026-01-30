
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const TheIntimacyFeud = () => {
    const [answers, setAnswers] = useState(Array(5).fill(null));
    const [strikes, setStrikes] = useState(1);
    const [guess, setGuess] = useState('');

    const handleGuess = () => {
        // Dummy check, in a real app this would be validated against a list
        if (guess.toLowerCase().includes('cuddle')) {
            const newAnswers = [...answers];
            newAnswers[0] = 'More Cuddles';
            setAnswers(newAnswers);
        } else {
            setStrikes(s => (s < 3 ? s + 1 : 3));
        }
        setGuess('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181114', '#230f16']} style={styles.container}>
                <Text style={styles.header}>The Intimacy Feud</Text>
                <Text style={styles.prompt}>A secret desire your partner finally shared</Text>

                <View style={styles.board}>
                    {answers.map((answer, index) => (
                        <View key={index} style={styles.slot}>
                            <Text style={styles.slotText}>{answer || '[ Locked ]'}</Text>
                            {answer ? null : <MaterialIcons name="lock" size={24} color="rgba(255,255,255,0.2)" />}
                        </View>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a secret desire..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={guess}
                        onChangeText={setGuess}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleGuess}>
                        <MaterialIcons name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.strikesContainer}>
                    {[1, 2, 3].map(i => (
                        <View key={i} style={[styles.strike, i <= strikes && styles.strikeActive]}>
                            <MaterialIcons name="close" size={32} color={i <= strikes ? '#fff' : 'rgba(255,255,255,0.1)'} />
                        </View>
                    ))}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181114' },
    container: { flex: 1, alignItems: 'center', padding: 24, justifyContent: 'center' },
    header: { fontSize: 32, fontWeight: 'bold', color: '#ff0055', marginBottom: 8 },
    prompt: { fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 24 },
    board: { width: '100%', gap: 12, marginBottom: 32 },
    slot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#271c21', padding: 16, borderRadius: 12 },
    slotText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    inputContainer: { flexDirection: 'row', width: '100%', marginBottom: 24 },
    input: { flex: 1, backgroundColor: '#271c21', padding: 16, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, color: '#fff', fontSize: 16 },
    sendButton: { backgroundColor: '#ff0055', padding: 16, borderTopRightRadius: 12, borderBottomRightRadius: 12, justifyContent: 'center' },
    strikesContainer: { flexDirection: 'row', gap: 16 },
    strike: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#271c21', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
    strikeActive: { backgroundColor: '#ff6b00', borderColor: '#ff6b00', shadowColor: '#ff6b00', shadowRadius: 10, shadowOpacity: 0.7 },
});

export default TheIntimacyFeud;
