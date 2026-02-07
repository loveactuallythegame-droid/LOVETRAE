
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoginAndSignUpScreen = () => {
    const [authMode, setAuthMode] = useState('Login');

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>NAVIGATE THE STARS OF YOUR RELATIONSHIP.</Text>
                <Text style={styles.subtitle}>Sync your frequencies to begin the journey.</Text>

                <View style={styles.glassPanel}>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity 
                            style={[styles.toggleButton, authMode === 'Login' && styles.toggleButtonActive]}
                            onPress={() => setAuthMode('Login')}
                        >
                            <Text style={[styles.toggleText, authMode === 'Login' && styles.toggleTextActive]}>LOGIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.toggleButton, authMode === 'SignUp' && styles.toggleButtonActive]}
                             onPress={() => setAuthMode('SignUp')}
                        >
                            <Text style={[styles.toggleText, authMode === 'SignUp' && styles.toggleTextActive]}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="YOUR COSMIC HANDLE"
                        placeholderTextColor="#D1C4E9"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="SECRET FREQUENCY"
                        placeholderTextColor="#D1C4E9"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>INITIATE CONNECTION</Text>
                    </TouchableOpacity>

                    <Text style={styles.dividerText}>OR BRIDGE VIA</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FF9500'}]}><Text style={styles.socialButtonText}>APPLE</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#008080'}]}><Text style={styles.socialButtonText}>GOOGLE</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FF4081'}]}><Text style={styles.socialButtonText}>EMAIL</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { alignItems: 'center', padding: 24 },
    title: { fontSize: 42, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', fontSize: 18, marginBottom: 32 },
    glassPanel: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 4, marginBottom: 24 },
    toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 16 },
    toggleButtonActive: { backgroundColor: '#FF4081' },
    toggleText: { color: '#D1C4E9', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
    toggleTextActive: { color: '#FFF' },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, color: '#FFF', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', fontWeight: 'bold', textTransform: 'uppercase' },
    submitButton: { backgroundColor: '#FF4081', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: '#FF4081', shadowRadius: 20, shadowOpacity: 0.4 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    dividerText: { color: '#D1C4E9', textAlign: 'center', marginVertical: 24, textTransform: 'uppercase', fontWeight: 'bold' },
    socialContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    socialButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
    socialButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' }
});

export default LoginAndSignUpScreen;
