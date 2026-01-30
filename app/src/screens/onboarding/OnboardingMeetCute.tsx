
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingMeetCuteScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#230f19', 'rgba(124, 58, 237, 0.15)', 'rgba(238, 43, 140, 0.15)', '#230f19']}
                style={styles.background} 
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>The Journey Begins</Text>
                    <Text style={styles.progressStep}>1 of 5</Text>
                </View>
                <View style={styles.progressBar}>
                    <LinearGradient 
                        colors={['#fc0c84', '#7c3aed']} 
                        style={styles.progressBarFill}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.mainTitle}>Step 1: Meet Cute</Text>
                    <Text style={styles.subtitle}>Every great love story has a beginning. How did you two first meet?</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Our Story</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="It was a rainy Tuesday at a coffee shop... or maybe a digital spark in the palm of your hands?"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                 <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                    {/* Arrow Icon could go here */}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
    progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
    progressText: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 },
    progressStep: { color: '#fc0c84', fontWeight: 'bold' },
    progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 24 },
    progressBarFill: { height: '100%', width: '20%', borderRadius: 3 },
    headerContainer: { alignItems: 'center', marginBottom: 24 },
    mainTitle: { color: '#FFF', fontSize: 36, fontWeight: 'bold', textShadowColor: 'rgba(192, 132, 252, 0.5)', textShadowRadius: 15 },
    subtitle: { color: '#c084fc', fontSize: 18, textAlign: 'center', opacity: 0.9, marginTop: 8 },
    inputContainer: { marginBottom: 32 },
    inputLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 12 },
    textInput: {
        backgroundColor: 'rgba(34, 16, 25, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.2)',
        borderRadius: 16,
        padding: 16,
        color: '#FFF',
        fontSize: 16,
        minHeight: 200,
    },
    continueButton: { 
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 99,
        alignSelf: 'flex-end',
        // Cannot replicate gradient button with pure StyleSheet, would need a library component
        backgroundColor: '#fc0c84',
    },
    continueButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default OnboardingMeetCuteScreen;
