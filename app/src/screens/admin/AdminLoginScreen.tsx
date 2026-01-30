
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const AdminLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Placeholder for admin authentication
    if (username === 'admin' && password === 'password') {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Authentication Failed', 'Invalid username or password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#0a050a', '#230f19']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Love Actually... The Game</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Admin Console</Text>
          <Text style={styles.subtitle}>Secure access for game coordinators and moderators</Text>

          <BlurView intensity={10} tint="dark" style={styles.glassPanel}>
            <Text style={styles.inputLabel}>Administrator Username</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. coordinator_alpha"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.inputLabel}>Access Security Key</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Authorize Access</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Love Actually... Cosmic Entertainment. All rights reserved.</Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginBottom: 32,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 205, 0.2)',
    overflow: 'hidden',
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default AdminLoginScreen;
