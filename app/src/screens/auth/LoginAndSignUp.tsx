
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const LoginAndSignUpScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // On successful login, the auth state change will be caught by the root navigator
        // and the user will be redirected to the main app.
        // No explicit navigation is needed here if the listener is set up correctly.
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Same as login, auth state change handles navigation.
      }
    } catch (error) {
      Alert.alert('Authentication Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0f0a0c', '#392830', '#0f0a0c']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.mainTitle}>Navigate the stars of your relationship.</Text>
          <Text style={styles.subtitle}>Sync your frequencies to begin the journey.</Text>

          <BlurView intensity={20} tint="dark" style={styles.glassPanel}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggleButton]}
                onPress={() => setIsLogin(true)}>
                <Text style={[styles.toggleButtonText, isLogin && styles.activeToggleButtonText]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggleButton]}
                onPress={() => setIsLogin(false)}>
                <Text style={[styles.toggleButtonText, !isLogin && styles.activeToggleButtonText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Your Cosmic Handle</Text>
            <TextInput
              style={styles.input}
              placeholder="commander@nebula.space"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Secret Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
              <Text style={styles.authButtonText}>{isLogin ? 'Initiate Connection' : 'Create Account'}</Text>
            </TouchableOpacity>

          </BlurView>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mainTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#fc0c84',
  },
  toggleButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeToggleButtonText: {
    color: '#ffffff',
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#fc0c84',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#fc0c84',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10, // for Android
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default LoginAndSignUpScreen;
