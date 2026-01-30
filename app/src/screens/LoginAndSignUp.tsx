
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoginAndSignUpScreen = () => {
    const [authMode, setAuthMode] = useState('Login');

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0f0a0c', '#230f19']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Navigate the stars of your relationship.</Text>
                <Text style={styles.subtitle}>Sync your frequencies to begin the journey.</Text>

                <View style={styles.glassPanel}>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity 
                            style={[styles.toggleButton, authMode === 'Login' && styles.toggleButtonActive]}
                            onPress={() => setAuthMode('Login')}
                        >
                            <Text style={[styles.toggleText, authMode === 'Login' && styles.toggleTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.toggleButton, authMode === 'SignUp' && styles.toggleButtonActive]}
                             onPress={() => setAuthMode('SignUp')}
                        >
                            <Text style={[styles.toggleText, authMode === 'SignUp' && styles.toggleTextActive]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Your Cosmic Handle"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Secret Frequency"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Initiate Connection</Text>
                    </TouchableOpacity>

                    <Text style={styles.dividerText}>or bridge via</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FF9500'}]}><Text style={styles.socialButtonText}>Apple</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#008080'}]}><Text style={styles.socialButtonText}>Google</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#ee2b8c'}]}><Text style={styles.socialButtonText}>Email</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { alignItems: 'center', padding: 24 },
    title: { fontSize: 42, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: 18, marginBottom: 32 },
    glassPanel: { backgroundColor: 'rgba(39, 28, 33, 0.6)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480 },
    toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 4, marginBottom: 24 },
    toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 6 },
    toggleButtonActive: { backgroundColor: '#fc0c84' },
    toggleText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontWeight: 'bold' },
    toggleTextActive: { color: '#FFF' },
    input: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 16, color: '#FFF', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    submitButton: { backgroundColor: '#fc0c84', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, shadowColor: '#fc0c84', shadowRadius: 20, shadowOpacity: 0.4 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    dividerText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginVertical: 24, textTransform: 'uppercase' },
    socialContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    socialButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
    socialButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default LoginAndSignUpScreen;
