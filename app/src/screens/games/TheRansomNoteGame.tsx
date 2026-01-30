
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Using a library like react-native-draggable-flatlist would be ideal for drag & drop

const wordBank = [
    { text: 'TONIGHT', style: 'ransom' },
    { text: 'PIZZA', style: 'spooky' },
    { text: 'BEHOLD', style: 'marker' },
    { text: 'MY', style: 'ransom' },
    { text: 'ETERNAL', style: 'spooky' },
    { text: 'FEAST', style: 'marker' },
    { text: 'WITH', style: 'ransom' },
    { text: 'YOU', style: 'spooky' },
];

const RansomWord = ({ word, onSelect }) => (
    <TouchableOpacity style={[styles.clipping, styles[word.style]]} onPress={() => onSelect(word)}>
        <Text style={styles.clippingText}>{word.text}</Text>
    </TouchableOpacity>
);

const TheRansomNoteGame = () => {
    const [note, setNote] = useState([]);

    const addWordToNote = (word) => {
        setNote([...note, word]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#191022', '#191022']} style={styles.container}>
                <Text style={styles.header}>The Ransom Note</Text>
                <Text style={styles.objective}>Invite your partner on a date... or else.</Text>

                <View style={styles.canvas}>
                    {note.length > 0 ? (
                        note.map((word, i) => <Text key={i} style={[styles.noteText, styles[word.style]]}>{word.text}</Text>)
                    ) : (
                        <Text style={styles.placeholder}>Drag words here</Text>
                    )}
                </View>

                <ScrollView horizontal contentContainerStyle={styles.wordBank}>
                    {wordBank.map((word, i) => <RansomWord key={i} word={word} onSelect={addWordToNote} />)}
                </ScrollView>

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#191022' },
    container: { flex: 1, padding: 24, alignItems: 'center' },
    header: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    objective: { color: '#ab9db9', fontSize: 18, marginBottom: 24 },
    canvas: {
        width: '100%',
        height: 300,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 8,
        borderColor: '#211c27',
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 24
    },
    noteText: { paddingHorizontal: 8, paddingVertical: 4 },
    placeholder: { color: '#ccc', fontSize: 18, fontStyle: 'italic', alignSelf: 'center' },
    wordBank: { gap: 12, paddingVertical: 16 },
    clipping: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 4, elevation: 3 },
    clippingText: { color: '#000', fontSize: 18 },
    ransom: { backgroundColor: '#fff', fontFamily: 'monospace' }, // Using generic fonts
    marker: { backgroundColor: '#a5f3fc', fontFamily: 'sans-serif-medium' },
    spooky: { backgroundColor: '#fca5a5', fontFamily: 'serif' },
});

export default TheRansomNoteGame;
