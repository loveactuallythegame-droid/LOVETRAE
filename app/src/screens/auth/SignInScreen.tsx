
import{ useState } from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    // Handle sign in logic
    console.log('Signing in with:', { email, password });
    // Navigate to main app
    navigation.navigate('MainGameLibrary');
  };

  return (
    <LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="header"style={styles.title}>Welcome Back</Text>
          <Text variant="body" style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <GlassCard style={styles.formCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
<View style={styles.inputGroup}>
              <Text variant="small" style={styles.inputLabel}>
                EMAIL ADDRESS
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="commander@nebula.space"
                placeholderTextColor={theme.COLORS.textHint}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="small" style={styles.inputLabel}>
                PASSWORD
              </Text>
              <TextInputstyle={styles.textInput}
                placeholder="••••••••••••"
                placeholderTextColor={theme.COLORS.textHint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <LinearGradient
                  colors={
                    rememberMe 
                      ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                      : ['#666', '#666']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.checkboxGradient}
                >
                  {rememberMe && (
                    <Text style={{ color: theme.COLORS.background, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                  )}
                </LinearGradient>
                <Text variant="small" style={styles.checkboxLabel}>
                  Remember me
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
                <Text variant="small" style={styles.forgotPassword}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={handleSignIn}
              disabled={!email || !password}
            >
              <LinearGradient
                colors={[
                  email && password ? theme.COLORS.primaryGradientStart :'#666',
                  email && password ? theme.COLORS.primaryGradientEnd : '#666'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: email && password ? theme.COLORS.background : theme.COLORS.textHint,
                    textAlign: 'center'
                  }}
                >
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine}></View>
              <Text variant="small" style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine}></View>
            </View>

            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={() => navigation.navigate('LoginAndSignUp')}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                start={{ x: 0,y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signUpGradient}
              >
                <Text 
                  variant="header" 
                  style={{ 
                    color: theme.COLORS.textPrimary,
                    textAlign: 'center'
                  }}
                >
                  Create Account
</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('LegalDisclaimer')}>
            <Text variant="small" style={styles.footerLink}>Legal Disclaimer</Text>
          </TouchableOpacity>
<Text variant="small" style={styles.footerText}>© 2026 Love Actually</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HelpAndFaq')}>
            <Text variant="small" style={styles.footerLink}>Help & FAQ</Text>
          </TouchableOpacity>
        </View>
</ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.SPACING.lg,
    paddingBottom: theme.SPACING.xxl,
  },
  header: {
    alignItems: 'center',
   marginBottom: theme.SPACING.lg,
  },
  title: {
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.sm,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    color: theme.COLORS.textSecondary,
  },
  formCard: {
    marginBottom: theme.SPACING.lg,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  inputGroup: {
    marginBottom: theme.SPACING.lg,
  },
  inputLabel: {
    color: theme.COLORS.textSecondary,
    marginBottom: theme.SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
borderColor: 'rgba(250, 31, 99, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.body.fontSize,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxGradient: {
    width: 20,
   height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.SPACING.sm,
    borderWidth: 1,
    borderColor: theme.COLORS.textSecondary,
  },
  checkboxLabel: {
    color: theme.COLORS.textSecondary,
  },
forgotPassword: {
    color: theme.COLORS.accentTeal,
  },
  signInButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    marginBottom: theme.SPACING.md,
  },
  signInGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    marginHorizontal: theme.SPACING.md,
    color: theme.COLORS.textSecondary,
  },
  signUpButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
 signUpGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.SPACING.lg,
  },
  footerLink: {
   color: theme.COLORS.accentTeal,
  },
  footerText: {
    color: theme.COLORS.textSecondary,
  },
});
