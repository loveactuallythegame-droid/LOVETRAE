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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { userApi } from '../../lib/api';

const { width, height } = Dimensions.get('window');

const LoginAndSignUpScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleAuth = async () => {
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // ============================================
        // LOGIN FLOW
        // ============================================
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get Firebase token for backend authentication
        const token = await userCredential.user.getIdToken();
        console.log('User logged in, token obtained');
        
        // Auth state change will be caught by the root navigator
        // and the user will be redirected to the main app.
      } else {
        // ============================================
        // SIGNUP FLOW - Create user in Firebase + Backend
        // ============================================
        
        // Step 1: Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Step 2: Get Firebase ID token for backend authentication
        const token = await user.getIdToken();
        console.log('Firebase user created, token obtained');
        
        // Step 3: Create user in backend database
        try {
          const displayName = email.split('@')[0]; // Use email prefix as default display name
          
          await userApi.create(
            {
              email: user.email || email,
              display_name: displayName
            },
            token
          );
          
          console.log('Backend user created successfully');
          
          // Step 4: Update Firebase profile with display name
          await updateProfile(user, { displayName });
          
        } catch (backendError) {
          // Backend creation failed - log but don't block the user
          // The user can still use the app, we'll sync later
          console.error('Backend user creation failed:', backendError);
          
          // Show a warning but don't prevent sign in
          Alert.alert(
            'Account Created',
            'Your account was created successfully. Some features may be limited until sync completes.',
            [{ text: 'OK' }]
          );
        }
        
        // Auth state change will handle navigation to main app
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Authentication Failed',
        error.message || 'An error occurred during authentication'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
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
    padding: theme.SPACING.lg,
  },
  mainTitle: {
    fontFamily: theme.TYPOGRAPHY.header.fontFamily || 'BarbieDream-Regular',
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    fontWeight: theme.TYPOGRAPHY.header.fontWeight,
    textAlign: 'center',
    marginBottom: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
  },
  subtitle: {
    color: theme.COLORS.textSecondary,
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    textAlign: 'center',
    marginBottom: theme.SPACING.xxl,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 480,
    borderRadius: theme.SIZES.borderRadius * 1.5,
    padding: theme.SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: theme.SIZES.borderRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: theme.SPACING.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius - 2,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: theme.COLORS.accentPink,
  },
  toggleButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
    fontSize: theme.TYPOGRAPHY.small.fontSize,
  },
  activeToggleButtonText: {
    color: theme.COLORS.textPrimary,
  },
  inputLabel: {
    color: theme.COLORS.textSecondary,
    fontSize: theme.TYPOGRAPHY.keyword.fontSize,
    fontWeight: theme.TYPOGRAPHY.keyword.fontWeight,
    textTransform: theme.TYPOGRAPHY.keyword.textTransform,
    letterSpacing: theme.TYPOGRAPHY.keyword.letterSpacing,
    marginBottom: theme.SPACING.sm,
  },
  input: {
    height: theme.SIZES.inputHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.SIZES.borderRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.SPACING.md,
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    marginBottom: theme.SPACING.lg,
  },
  authButton: {
    backgroundColor: theme.COLORS.accentPink,
    borderRadius: theme.SIZES.buttonBorderRadius,
    paddingVertical: theme.SPACING.lg,
    alignItems: 'center',
    marginTop: theme.SPACING.md,
    shadowColor: theme.COLORS.accentPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10, // for Android
  },
  authButtonText: {
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.keyword.fontSize,
    fontWeight: theme.TYPOGRAPHY.keyword.fontWeight,
    textTransform: theme.TYPOGRAPHY.keyword.textTransform,
    letterSpacing: theme.TYPOGRAPHY.keyword.letterSpacing,
  },
});

export default LoginAndSignUpScreen;