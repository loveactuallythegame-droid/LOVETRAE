import React, { useState, useEffect } from 'react';
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
  Image,
  ActivityIndicator,
  Keyboard,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginAndSignUpScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    const keyboardWillShowListener = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
      : Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    
    const keyboardWillHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
      : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleAuth = async () => {
    try {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Validation
      if (!email.trim()) {
        Alert.alert('Validation Error', 'Please enter your cosmic handle');
        return;
      }
      
      if (!validateEmail(email)) {
        Alert.alert('Validation Error', 'Please enter a valid cosmic frequency address');
        return;
      }
      
      if (!password.trim()) {
        Alert.alert('Validation Error', 'Please enter your secret frequency');
        return;
      }
      
      if (!validatePassword(password)) {
        Alert.alert('Validation Error', 'Secret frequency must be at least 8 characters long');
        return;
      }
      
      if (!isLogin && password !== confirmPassword) {
        Alert.alert('Validation Error', 'Secret frequencies do not match');
        return;
      }

      setIsLoading(true);

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Navigation is handled by auth state change listener
    } catch (error: any) {
      let errorMessage = 'Cosmic synchronization failed';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid cosmic frequency address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This cosmic channel has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No cosmic signature found with this frequency';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect secret frequency';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'A cosmic signature already exists with this frequency';
          break;
        case 'auth/weak-password':
          errorMessage = 'Secret frequency is too weak. Please use at least 8 characters';
          break;
        default:
          errorMessage = error.message || 'Cosmic synchronization failed. Please try again.';
      }
      
      Alert.alert('Synchronization Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PasswordResetScreen');
  };

  const handleModeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Cosmic Retro Arcade Animated Splash Gradient */}
        <LinearGradient
          colors={[
            COLORS.arenaBgStart, // #1A0D2E
            COLORS.arenaBgEnd,   // #3D1B5A
            COLORS.primaryGradientStart, // #DB147C
            COLORS.primaryGradientEnd    // #F05D68
          ]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated cosmic particles */}
          <Animated.View style={[styles.particlesContainer, { opacity: fadeAnim }]}>
            {[...Array(20)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    opacity: Math.random() * 0.8 + 0.2,
                    transform: [
                      {
                        scale: new Animated.Value(Math.random() * 0.5 + 0.5)
                      }
                    ]
                  }
                ]}
              />
            ))}
          </Animated.View>
          
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContainer,
              keyboardVisible && styles.scrollContainerKeyboard
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* App Logo/Branding with cosmic animation */}
            <Animated.View 
              style={[
                styles.brandingSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Image
                source={require('../../../assets/logo/mainlogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.mainTitle}>Navigate the stars of your relationship.</Text>
              <Text style={styles.subtitle}>Sync your frequencies to begin the cosmic journey.</Text>
            </Animated.View>

            {/* Authentication Form with cosmic glass styling */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: Animated.multiply(slideAnim, 1.5) }]
                }
              ]}
            >
              <BlurView 
                intensity={Platform.OS === 'ios' ? 30 : 15} 
                tint="dark" 
                style={styles.glassPanel}
              >
                {/* Login/Signup Toggle with cosmic styling */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton, 
                      isLogin && styles.activeToggleButton
                    ]}
                    onPress={handleModeToggle}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.toggleButtonText, 
                      isLogin && styles.activeToggleButtonText
                    ]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.toggleButton, 
                      !isLogin && styles.activeToggleButton
                    ]}
                    onPress={handleModeToggle}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.toggleButtonText, 
                      !isLogin && styles.activeToggleButtonText
                    ]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Email Input with cosmic styling */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Cosmic Handle</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        isLoading && styles.inputDisabled
                      ]}
                      placeholder="commander@nebula.space"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                      textContentType="emailAddress"
                    />
                  </View>
                </View>

                {/* Password Input with cosmic styling */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Secret Frequency</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        isLoading && styles.inputDisabled
                      ]}
                      placeholder="••••••••••••"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      editable={!isLoading}
                      textContentType={isLogin ? "password" : "newPassword"}
                    />
                  </View>
                </View>

                {/* Confirm Password Input */}
                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm Secret Frequency</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          isLoading && styles.inputDisabled
                        ]}
                        placeholder="••••••••••••"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!isLoading}
                        textContentType="newPassword"
                      />
                    </View>
                  </View>
                )}

                {/* Action Buttons with cosmic styling */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled
                  ]}
                  onPress={handleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {isLogin ? 'Sync Frequencies' : 'Initialize Cosmic Signature'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Forgot Password */}
                {isLogin && (
                  <TouchableOpacity
                    style={styles.forgotPasswordButton}
                    onPress={handleForgotPassword}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Lost your frequency? Reset here.
                    </Text>
                  </TouchableOpacity>
                )}
              </BlurView>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepCosmicPurple,
  },
  
  keyboardAvoidingView: {
    flex: 1,
  },
  
  backgroundGradient: {
    flex: 1,
  },
  
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(252, 199, 56, 0.8)',
    borderRadius: 999,
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xlarge,
  },
  
  scrollContainerKeyboard: {
    paddingTop: SPACING.regular,
  },
  
  brandingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.regular,
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  
  mainTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.displaySmall,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.small,
    textShadowColor: 'rgba(252, 199, 56, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  formContainer: {
    paddingHorizontal: SPACING.screenPadding,
  },
  
  glassPanel: {
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    backgroundColor: 'rgba(45, 25, 80, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(252, 199, 56, 0.2)',
    ...SHADOWS.cosmic,
  },
  
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.button,
    padding: SPACING.micro,
    marginBottom: SPACING.xlarge,
  },
  
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
  },
  
  activeToggleButton: {
    backgroundColor: COLORS.primaryGradientStart,
    ...SHADOWS.neonSoft,
  },
  
  toggleButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textSecondary,
  },
  
  activeToggleButtonText: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  
  inputGroup: {
    marginBottom: SPACING.regular,
  },
  
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.micro,
    marginLeft: SPACING.small,
  },
  
  inputContainer: {
    position: 'relative',
  },
  
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.medium,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  inputDisabled: {
    opacity: 0.6,
  },
  
  primaryButton: {
    backgroundColor: COLORS.primaryGradientStart,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.regular,
    alignItems: 'center',
    marginTop: SPACING.regular,
    ...SHADOWS.neon,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  primaryButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: SPACING.regular,
    paddingVertical: SPACING.small,
  },
  
  forgotPasswordText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textHint,
    textDecorationLine: 'underline',
  },
});

export default LoginAndSignUpScreen;