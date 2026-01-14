import { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton, RadialGradientBackground } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { signInEmail, signUpEmail, signInWithGoogle } from '../../lib/supabase';
import { MarcieHost } from '../../components/ai-host';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        setError('Please enter a valid cosmic handle and a secret frequency of at least 6 chars.');
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
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="header" style={styles.appTitle}>LOVE ACTUALLY...</Text>
          </View>

          {/* Hero Text */}
          <View style={styles.heroContainer}>
            <Text variant="header" style={styles.heroTitle}>Navigate the stars of your relationship.</Text>
            <Text variant="body" style={styles.heroSubtitle}>Sync your frequencies to begin the journey.</Text>
          </View>

          {/* Marcie Host - Floating */}
          <View style={styles.marcieContainer}>
            <MarcieHost mode="idle" size={120} float position={{ x: 0, y: 0 }} />
          </View>

          {/* Glass Panel */}
          <GlassCard style={styles.card}>
            {/* Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleBtn, isLogin && styles.toggleActive]}
                onPress={() => toggleMode(true)}
              >
                <Text variant="body" style={[styles.toggleText, isLogin && styles.toggleTextActive]}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
                onPress={() => toggleMode(false)}
              >
                <Text variant="body" style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text variant="keyword" style={styles.label}>YOUR COSMIC HANDLE</Text>
                  <View style={styles.statusDot}><View style={[styles.dot, { backgroundColor: '#FACC15' }]} /></View>
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="commander@nebula.space"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text variant="keyword" style={styles.label}>SECRET FREQUENCY</Text>
                  <View style={styles.statusDot}><View style={[styles.dot, { backgroundColor: '#F97316' }]} /></View>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                </View>
              </View>

              {error && <Text variant="sass" style={styles.error}>{error}</Text>}

              <SquishyButton style={styles.submitBtn} onPress={handleSubmit}>
                {loading ? <ActivityIndicator color="#fff" /> :
                  <Text variant="header" style={styles.submitBtnText}>INITIATE CONNECTION</Text>
                }
              </SquishyButton>

              {/* Footer Actions */}
              <View style={styles.footerActions}>
                <TouchableOpacity onPress={onForgot}>
                  <Text variant="body" style={styles.forgotLink}>LOST IN SPACE?</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text variant="body" style={styles.orText}>OR BRIDGE VIA</Text>
                <View style={styles.line} />
              </View>

              {/* Social */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn} onPress={doGoogle}>
                  <Ionicons name="logo-google" size={24} color="white" />
                  <Text variant="body" style={styles.socialText}>GOOGLE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120016' },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 10 },
  appTitle: { color: 'white', fontSize: 16, letterSpacing: 2 },
  heroContainer: { marginTop: 20, alignItems: 'center', marginBottom: 20 },
  heroTitle: { color: 'white', fontSize: 32, textAlign: 'center', lineHeight: 38 },
  heroSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 10, textAlign: 'center' },
  marcieContainer: { alignItems: 'center', height: 140, justifyContent: 'center', zIndex: 10 },
  card: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(30, 20, 40, 0.6)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#FA1F63' },
  toggleText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 'bold' },
  toggleTextActive: { color: 'white' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, letterSpacing: 1 },
  statusDot: {},
  dot: { width: 8, height: 8, borderRadius: 4, shadowColor: 'white', shadowOpacity: 0.5, shadowRadius: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16, color: 'white', fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  eyeIcon: { padding: 16 },
  submitBtn: { backgroundColor: '#FA1F63', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#FA1F63', shadowOpacity: 0.4, shadowRadius: 10 },
  submitBtnText: { color: 'white', fontSize: 16, letterSpacing: 1 },
  error: { color: '#E4E831', textAlign: 'center' },
  footerActions: { alignItems: 'center' },
  forgotLink: { color: '#FA1F63', fontSize: 12, letterSpacing: 1 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  orText: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  socialRow: { flexDirection: 'row', justifyContent: 'center' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  socialText: { color: 'white', fontSize: 14, letterSpacing: 1 }
});
