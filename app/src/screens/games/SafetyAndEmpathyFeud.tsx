
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const initialAnswers = [
    { text: 'Active Listening', score: 42, revealed: true },
    { text: 'No Interruption', score: 28, revealed: true },
    { text: 'Soft Tone', score: 15, revealed: true },
    { text: '??????????', score: 0, revealed: false },
    { text: '??????????', score: 0, revealed: false },
    { text: '??????????', score: 0, revealed: false },
];

const SafetyAndEmpathyFeud = () => {
    const [answers, setAnswers] = useState(initialAnswers);
    const [strikes, setStrikes] = useState(2);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#102222', '#081212']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>"Things that make me feel safe during a talk"</Text>
                        <Text style={styles.headerSubtitle}>Survey Says...</Text>
                    </View>

                    <View style={styles.gameLayout}>
                        <View style={styles.gameBoardContainer}>
                            {answers.map((answer, index) => (
                                <View key={index} style={styles.answerRow}>
                                    <View style={[styles.answerBox, answer.revealed && styles.revealedBox]}>
                                        <Text style={styles.answerIndex}>{index + 1}</Text>
                                        <Text style={styles.answerText}>{answer.text}</Text>
                                        {answer.revealed && <Text style={styles.answerScore}>{answer.score}</Text>}
                                    </View>
                                </View>
                            ))}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Type your guess here..."
                                    placeholderTextColor="#9db9b9"
                                />
                                <MaterialIcons name="send" size={24} color="#ff005e" style={{ position: 'absolute', right: 16 }} />
                            </View>
                             <View style={styles.strikeContainer}>
                                {[...Array(3)].map((_, i) => (
                                    <Text key={i} style={[styles.strike, i < strikes && styles.activeStrike]}>X</Text>
                                ))}
                            </View>
                        </View>

                        <View style={styles.hostContainer}>
                             <View style={styles.speechBubble}>
                                <Text style={styles.speechText}>"Honey, your empathy is buffering... try again, but with actual feeling this time."</Text>
                            </View>
                            <Text style={styles.hostName}>Dr. Marcie Liss</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#081212' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    headerContainer: { backgroundColor: 'rgba(28, 39, 39, 0.8)', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
    headerTitle: { color: '#ff005e', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { color: '#9db9b9', fontSize: 14, marginTop: 4 },
    gameLayout: { flexDirection: 'row', gap: 24 },
    gameBoardContainer: { flex: 3 },
    answerRow: { marginBottom: 4 },
    answerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111818', padding: 12, borderRadius: 8, height: 50 },
    revealedBox: { backgroundColor: '#1c2727' },
    answerIndex: { color: '#ff005e', fontWeight: 'bold', marginRight: 12 },
    answerText: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 },
    answerScore: { color: '#ff005e', fontWeight: 'bold' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
    textInput: { flex: 1, backgroundColor: '#1c2727', borderWidth: 2, borderColor: '#ff005e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 18 },
    strikeContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 },
    strike: { fontSize: 40, fontWeight: 'bold', color: '#3b5454' },
    activeStrike: { color: '#ef4444', textShadowColor: 'rgba(239, 68, 68, 0.8)', textShadowRadius: 10 },
    hostContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
    speechBubble: { backgroundColor: 'rgba(28, 39, 39, 0.8)', padding: 16, borderRadius: 12, marginBottom: 16 },
    speechText: { color: '#fff', fontStyle: 'italic', fontSize: 16 },
    hostName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default SafetyAndEmpathyFeud;
