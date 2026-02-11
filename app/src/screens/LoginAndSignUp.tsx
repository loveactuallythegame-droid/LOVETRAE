import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';

const LoginAndSignUpScreen = ({ navigation }: any) => {
    const [authMode, setAuthMode] = useState<'Login' | 'SignUp'>('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert('Login Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (authMode === 'Login') {
            handleLogin();
        } else {
            handleSignUp();
        }
    };

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
                            disabled={loading}
                        >
                            <Text style={[styles.toggleText, authMode === 'Login' && styles.toggleTextActive]}>LOGIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.toggleButton, authMode === 'SignUp' && styles.toggleButtonActive]}
                            onPress={() => setAuthMode('SignUp')}
                            disabled={loading}
                        >
                            <Text style={[styles.toggleText, authMode === 'SignUp' && styles.toggleTextActive]}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="YOUR COSMIC HANDLE (EMAIL)"
                        placeholderTextColor="#D1C4E9"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="SECRET FREQUENCY (PASSWORD)"
                        placeholderTextColor="#D1C4E9"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        editable={!loading}
                    />

                    <TouchableOpacity 
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'CONNECTING...' : authMode === 'Login' ? 'INITIATE CONNECTION' : 'CREATE ACCOUNT'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.dividerText}>OR BRIDGE VIA</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FF9500'}]} disabled={loading}>
                            <Text style={styles.socialButtonText}>APPLE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#008080'}]} disabled={loading}>
                            <Text style={styles.socialButtonText}>GOOGLE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FF4081'}]} disabled={loading}>
                            <Text style={styles.socialButtonText}>EMAIL</Text>
                        </TouchableOpacity>
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
    toggleButtonActive: { backgroundColor: '#db147c' }, // Cosmic Pink theme
    toggleText: { color: '#D1C4E9', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
    toggleTextActive: { color: '#FFF' },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, color: '#FFF', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', fontWeight: 'bold', textTransform: 'uppercase' },
    submitButton: { backgroundColor: '#db147c', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: '#db147c', shadowRadius: 20, shadowOpacity: 0.4 }, // Cosmic Pink theme
    submitButtonDisabled: { backgroundColor: '#8B1555', opacity: 0.7 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    dividerText: { color: '#D1C4E9', textAlign: 'center', marginVertical: 24, textTransform: 'uppercase', fontWeight: 'bold' },
    socialContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    socialButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
    socialButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' }
});

export default LoginAndSignUpScreen;
