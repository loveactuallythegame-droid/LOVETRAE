
import { useState } from 'react';
import {
  View, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Text } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { signInEmail, signUpEmail, signInWithGoogle } from '../../lib/supabase';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onAuthenticated: () => void;
  onForgot: () => void;
};

export default function SignInScreen({ onAuthenticated, onForgot }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = (login: boolean) => {
    Haptics.selectionAsync();
    setIsLogin(login);
    setError(null);
  };

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      if (!email.includes('@') || password.length < 6) {
        setError('Please enter a valid cosmic handle and a secret frequency of at least 6 characters.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAuthenticated();
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e?.message || (isLogin ? 'Login failed.' : 'Sign up failed.'));
    } finally {
      setLoading(false);
    }
  }

  async function doGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(typeof window !== 'undefined' ? window.location.origin : undefined);
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.root}
    >
      <LinearGradient
        colors={['#0f0a0c', '#230f19', '#392830']}
        style={styles.nebulaBg}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroContainer}>
            <Text variant='header' style={styles.heroTitle}>Navigate the stars of your relationship.</Text>
            <Text variant='body' style={styles.heroSubtitle}>Sync your frequencies to begin the journey.</Text>
          </View>

          <View style={styles.glassPanel}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, isLogin && styles.toggleActive]}
                onPress={() => toggleMode(true)}
              >
                <Text style={[styles.toggleText, isLogin && { color: 'white' }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
                onPress={() => toggleMode(false)}
              >
                <Text style={[styles.toggleText, !isLogin && { color: 'white' }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Your Cosmic Handle</Text>
                  <View style={styles.statusDotRow}>
                    <Text style={styles.statusText}>Connection Live</Text>
                    <View style={[styles.statusDot, { backgroundColor: '#FBBF24', shadowColor: '#FBBF24' }]} />
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="commander@nebula.space"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Secret Frequency</Text>
                  <View style={styles.statusDotRow}>
                    <Text style={styles.statusText}>Secure</Text>
                    <View style={[styles.statusDot, { backgroundColor: '#F97316', shadowColor: '#F97316' }]} />
                  </View>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={24} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formActions}>
                  <TouchableOpacity style={styles.rememberMe} >
                      <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.rememberMeText}>Remember Frequency</Text>
                  </TouchableOpacity>
                <TouchableOpacity onPress={onForgot}>
                  <Text style={styles.forgotLink}>Lost in Space?</Text>
                </TouchableOpacity>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Initiate Connection</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or bridge via</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialLoginContainer}>
                <TouchableOpacity style={[styles.socialBtn, {backgroundColor: 'rgba(255, 149, 0, 0.2)'}]}>
                    <MaterialIcons name="phone-iphone" size={24} color="white" />
                    <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={[styles.socialBtn, {backgroundColor: 'rgba(0, 128, 128, 0.2)'}]} onPress={doGoogle}>
                    <MaterialCommunityIcons name="google" size={24} color="white" />
                    <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={[styles.socialBtn, {backgroundColor: 'rgba(238, 43, 140, 0.2)'}]}>
                    <MaterialIcons name="email" size={24} color="white" />
                    <Text style={styles.socialBtnText}>Email</Text>
                </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Love Actually... The Game. All Rights Reserved.</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity><Text style={styles.footerLink}>Privacy Nebula</Text></TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity><Text style={styles.footerLink}>Safety Protocol</Text></TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity><Text style={styles.footerLink}>Contact Ground Control</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nebulaBg: { ...StyleSheet.absoluteFillObject },
  scrollContent: { 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  heroTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 8,
  },
  glassPanel: {
    backgroundColor: 'rgba(39, 28, 33, 0.6)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: '#fc0c84' },
  toggleText: { 
    color: 'rgba(255,255,255,0.5)', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: 'white',
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 14,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  rememberMe: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
  },
  rememberMeText: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
  },
  forgotLink: {
    color: '#fc0c84',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  submitBtn: {
    backgroundColor: '#fc0c84',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#fc0c84',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    marginTop: 8
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  errorText: {
    color: '#FBBF24',
    textAlign: 'center',
    marginVertical: 10
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  },
  socialBtn: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  socialBtnText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'uppercase',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  footerSeparator: {
      color: 'rgba(255,255,255,0.2)',
      fontSize: 10
  }
});
