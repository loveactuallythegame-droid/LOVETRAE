
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const rituals = [
    { name: 'The Toast', icon: 'wine-bar', color: '#9213ec' },
    { name: 'Reflection', icon: 'dark-mode', color: '#ff2d85' },
    { name: 'Reading', icon: 'menu-book', color: '#1a1022' },
    { name: 'Connection', icon: 'auto-awesome', color: '#00f5ff' },
    { name: 'Generosity', icon: 'volunteer-activism', color: '#9213ec' },
    { name: 'Creativity', icon: 'camera-alt', color: '#ff2d85' },
];

const RitualRouletteGame = () => {
    const [spinAnim] = useState(new Animated.Value(0));
    const [selectedRitual, setSelectedRitual] = useState(null);

    const spinWheel = () => {
        const randomNumber = Math.floor(Math.random() * rituals.length);
        const toValue = 360 * 5 + (360 - (360 / rituals.length) * randomNumber);

        Animated.timing(spinAnim, {
            toValue,
            duration: 4000,
            useNativeDriver: true,
        }).start(() => {
            setSelectedRitual(rituals[randomNumber]);
        });
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#1a1022', '#221017']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>Ritual Roulette</Text>
                    <Text style={styles.subHeader}>Spin the wheel to discover your shared evening ritual.</Text>

                    <View style={styles.gameContainer}>
                        <View style={styles.wheelContainer}>
                            <View style={styles.pointer}><MaterialIcons name="expand-more" size={40} color="#00f5ff" /></View>
                            <Animated.View style={[styles.wheel, { transform: [{ rotate: spin }] }]}>
                                {rituals.map((ritual, i) => (
                                    <View key={i} style={[styles.wheelSection, { transform: [{ rotate: `${(360 / rituals.length) * i}deg` }] }]}>
                                        <MaterialIcons name={ritual.icon} size={32} color="#fff" style={{ transform: [{ translateY: -150 }]}} />
                                    </View>
                                ))}
                                <TouchableOpacity style={styles.spinButton} onPress={spinWheel} activeOpacity={0.8}>
                                     <LinearGradient colors={['#ff2d85', '#f40b61']} style={styles.spinButtonGradient}>
                                         <Text style={styles.spinButtonText}>SPIN</Text>
                                     </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        <View style={styles.proofContainer}>
                            <View style={styles.marcieCard}>
                               <Text style={styles.marcieTitle}>Dr. Marcie Liss</Text>
                               <Text style={styles.marcieComment}>"This ritual is a total 10/10 for you! It's going to unlock some amazing vibes tonight."</Text>
                            </View>
                            <View style={styles.logProofCard}>
                                <Text style={styles.logProofTitle}>Log Proof</Text>
                                <TouchableOpacity style={styles.uploadZone}>
                                    <MaterialIcons name="add-a-photo" size={32} color="rgba(255,255,255,0.6)" />
                                    <Text style={styles.uploadText}>Snap a photo together</Text>
                                </TouchableOpacity>
                                <Text style={styles.orText}>OR</Text>
                                 <TouchableOpacity style={styles.voiceNoteZone}>
                                    <MaterialIcons name="mic" size={24} color="#fff" />
                                    <Text style={styles.voiceNoteText}>Record a Voice Note</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>SUBMIT PROOF</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1022' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
    subHeader: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24 },
    gameContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 24 },
    wheelContainer: { flex: 1, alignItems: 'center' },
    pointer: { position: 'absolute', top: -20, zIndex: 2 },
    wheel: { width: 350, height: 350, borderRadius: 175, borderWidth: 12, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    wheelSection: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    spinButton: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    spinButtonGradient: { width: '100%', height: '100%', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)' },
    spinButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    proofContainer: { flex: 1, gap: 24 },
    marcieCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 },
    marcieTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    marcieComment: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', fontSize: 18 },
    logProofCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, gap: 16 },
    logProofTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    uploadZone: { borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
    uploadText: { color: 'rgba(255,255,255,0.6)' },
    orText: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', fontSize: 10 },
    voiceNoteZone: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 12, gap: 12 },
    voiceNoteText: { color: '#fff' },
    submitButton: { backgroundColor: '#f40b61', borderRadius: 16, padding: 16, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default RitualRouletteGame;
