
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ChoiceButton = ({ label, imageUri, color, glowColor, letter }) => (
    <TouchableOpacity style={[styles.choiceButton, { borderColor: color, shadowColor: glowColor }]}>
        <ImageBackground source={{ uri: imageUri }} style={styles.choiceImage} imageStyle={{ borderRadius: 16 }}>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']} style={styles.choiceGradient}>
                <View style={[styles.choiceLetterContainer, { backgroundColor: color }]}>
                    <Text style={styles.choiceLetter}>{letter}</Text>
                </View>
                <Text style={styles.choiceLabel}>{label}</Text>
            </LinearGradient>
        </ImageBackground>
    </TouchableOpacity>
);

const LoveMapSpeedrunGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>TIME REMAINING</Text>
                    <View style={styles.timerBarBackground}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.timerBar} />
                    </View>
                </View>

                <Text style={styles.questionText}>WHAT'S THEIR GO-TO COMFORT SNACK THIS MONTH?</Text>

                <View style={styles.choicesGrid}>
                    <ChoiceButton letter="A" label="SALT & VINEGAR CHIPS" color="#FF4081" glowColor="rgba(255, 64, 129, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAR6eyEJy4q7hAH3icbzu3BtkriNGhKWsR1BUjLTU93nKB7vhaby-U8CT0IoBGaHimsRKPIR9jfh-XDAx7EHb3ghdNVErYPBHPYVR1VFtnF_ZKkSFvV0G4_NoeD94XbPdCO7D6sWn4olDsEuasr7lysqsxqtnZz0zwWzuD_0sthzMtEjJcm2uyDzsd7Cv_MCUeYUPgfRUd5N79pxISeG7MxGWYlJhyA8S6Tm6x9Gi6NYAhx3MDpr8xu8EShdzLEuaoFYAP-zfh5D03_" />
                    <ChoiceButton letter="B" label="DARK CHOCOLATE" color="#E040FB" glowColor="rgba(224, 64, 251, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCvkMYBCSseWmeW-GCYzIF9TZKJc9F2biyg_4IQGfK7QBAitTvcNkkNQEPXD3H3KqNQbrOpz1ziPBbIvS88nN-QEFaz-MttJpvhmmluT7-n95vlWCsnstVokr-UuvVDMDA7s5hDzJagXNz9ErZWx_WnTmuXmZU_H1LldtKxaTSm4OfwtPkeEilGbZmOBCtxBOsXYnpsfvFq_e5CPlLHDVseqZZfO6gVp5mGpN41naDWQ7kVD_otUCs7j0oEoeIip7yh8fbhKGm49pcS" />
                    <ChoiceButton letter="C" label="SPICY RAMEN" color="#00FFFF" glowColor="rgba(0, 255, 255, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBkzovkATWmPhVDPbsVMAjLEAcszGcG599qhQPr9wlPpMW3FrNdabYYUtfQzTSgsYno3jDjrlx59wSHhCXatBrkCFv9D1HKhb6P1YHpFO8J-JL2XrSPQ-jZmYbV-LxZJs3RoqSPQyHjwGk3e0JMChoaJaWa8PVpx6I_vjfBF-jRwNap9bsnzGYynWG9Vkas-7XO43lxTUrANThvWNoMzgOOSUpt2rInNx_q1_AlDcfezrfosXbr4-0fp5Mn6VILlED4qDOaL-Ldrim4" />
                    <ChoiceButton letter="D" label="GUMMY BEARS" color="#FFD700" glowColor="rgba(255, 215, 0, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBrIrOZiJrnO-3GAW2SPs_ShPJ48Y9Y_PdhG4emcbgLxO6RZKBebDr_FSx1gwN6h6r3lLVlsbxklttr7PqAqNaOKkcxxgo8zeE0Kh9W0otz9wvAbNvNfYGRmSf4SbWWUpevt3I0NjhyeEUnKsOv219hR2ndtBMTWdm-BtntrqGLHyEhxxO7zRe4v83gZwhWPL-a8lPfU1mGxVTVFnDteGOnOyJOoCYzcuhl_UkXDhHfeCAEewwKQ2YeEa6tn9U0o57YRBI6j-aooVBX" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    timerContainer: { marginBottom: 24, paddingHorizontal: 16 },
    timerLabel: { color: '#FF4081', textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, marginBottom: 8, fontWeight: 'bold' },
    timerBarBackground: { height: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6 },
    timerBar: { width: '65%', height: '100%', borderRadius: 6 },
    questionText: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase' },
    choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    choiceButton: { width: '48%', aspectRatio: 1, marginBottom: 16, borderRadius: 20, borderWidth: 2, shadowRadius: 15, shadowOpacity: 0.4, backgroundColor: 'rgba(255,255,255,0.1)' },
    choiceImage: { flex: 1, justifyContent: 'flex-end' },
    choiceGradient: { flex: 1, justifyContent: 'flex-end', padding: 12, borderRadius: 16 },
    choiceLetterContainer: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    choiceLetter: { color: '#000', fontWeight: 'bold' },
    choiceLabel: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default LoveMapSpeedrunGameScreen;
