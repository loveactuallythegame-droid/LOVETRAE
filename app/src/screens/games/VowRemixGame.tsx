
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';

const VowRemixGame = () => {
    const [vowText, setVowText] = useState('');
    const [clarity, setClarity] = useState(5);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#221017', '#f8f5f6']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Vow Remix</Text>
                    <Text style={styles.headerSubtitle}>Creative Writing Phase</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>I vow to...</Text>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Write your current reality here..."
                        placeholderTextColor="#9a4c59"
                        value={vowText}
                        onChangeText={setVowText}
                    />
                </View>

                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Clarity: {clarity.toFixed(1)}</Text>
                    <Slider
                        style={{ width: 250, height: 40 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={0.1}
                        value={clarity}
                        onValueChange={setClarity}
                        minimumTrackTintColor="#f40b61"
                        maximumTrackTintColor="#ff718b"
                        thumbTintColor="#f40b61"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton}>
                    <MaterialIcons name="send" size={24} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Vow</Text>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#221017' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 20 },
    headerTitle: { color: '#f40b61', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { color: '#e7cfd3', fontSize: 16 },
    card: {
        width: '100%',
        backgroundColor: '#fcf8f2',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        minHeight: 300
    },
    cardTitle: { color: '#f40b61', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    textInput: {
        flex: 1,
        color: '#1b0d10',
        fontSize: 18,
        textAlignVertical: 'top', // for multiline
        lineHeight: 28
    },
    sliderContainer: { 
        width: '100%', 
        alignItems: 'center', 
        marginVertical: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 10,
        borderRadius: 12
    },
    sliderLabel: { color: '#fff', fontWeight: '600', marginBottom: 5 },
    submitButton: { 
        flexDirection: 'row', 
        backgroundColor: '#f40b61', 
        paddingHorizontal: 30, 
        paddingVertical: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }
});

export default VowRemixGame;
