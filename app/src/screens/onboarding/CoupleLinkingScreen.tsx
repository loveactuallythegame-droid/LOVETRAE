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
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';

const { width, height } = Dimensions.get('window');

const CoupleLinkingScreen = () => {
  const [partnerCode, setPartnerCode] = useState('');
  const navigation = useNavigation();

  const handleLinkCouple = async () => {
    if (!partnerCode.trim()) {
      Alert.alert('Error', 'Please enter a partner code');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to link with a partner');
        return;
      }

      // Find partner by couple code
      const partnerProfileRef = doc(db, 'profiles', partnerCode.toUpperCase());
      const partnerProfileSnap = await getDoc(partnerProfileRef);

      if (!partnerProfileSnap.exists()) {
        Alert.alert('Error', 'Invalid partner code. Please try again.');
        return;
      }

      const partnerData = partnerProfileSnap.data();
      const partnerUserId = partnerData.userId;

      if (partnerUserId === currentUser.uid) {
        Alert.alert('Error', 'You cannot link with yourself!');
        return;
      }

      // Check if partner is already linked to someone else
      if (partnerData.partnerId) {
        Alert.alert('Error', 'This partner is already linked to someone else.');
        return;
      }

      // Create/update couple relationship
      const coupleId = `${currentUser.uid}_${partnerUserId}`.split('').sort().join(''); // deterministic id
      
      // Update both user profiles
      const currentUserProfileRef = doc(db, 'profiles', currentUser.uid);
      await updateDoc(currentUserProfileRef, {
        partnerId: partnerUserId,
        coupleId: coupleId,
        updatedAt: serverTimestamp()
      });

      const partnerProfileUpdateRef = doc(db, 'profiles', partnerUserId);
      await updateDoc(partnerProfileUpdateRef, {
        partnerId: currentUser.uid,
        coupleId: coupleId,
        updatedAt: serverTimestamp()
      });

      // Create/update couple document
      const coupleRef = doc(db, 'couples', coupleId);
      const coupleExists = await getDoc(coupleRef);
      
      if (!coupleExists.exists()) {
        await setDoc(coupleRef, {
          id: coupleId,
          user1_id: currentUser.uid,
          user2_id: partnerUserId,
          created_at: serverTimestamp(),
          trust_meter: 0.5,
          vulnerability_meter: 0.5,
          romance_meter: 0.5,
          connection_meter: 0.5,
          total_points: 0,
          streak_days: 0,
          last_interaction: serverTimestamp()
        });
      } else {
        await updateDoc(coupleRef, {
          last_interaction: serverTimestamp()
        });
      }

      Alert.alert(
        'Success!', 
        'You are now linked with your partner!', 
        [
          { text: 'Continue', onPress: () => navigation.navigate('DashboardHome' as never) }
        ]
      );
    } catch (error) {
      console.error('Error linking couple:', error);
      Alert.alert('Error', 'Failed to link with partner. Please try again.');
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
          <Text style={styles.mainTitle}>Link Your Cosmic Connection</Text>
          <Text style={styles.subtitle}>Enter your partner's cosmic code to sync your journey.</Text>

          <BlurView intensity={20} tint="dark" style={styles.glassPanel}>
            <Text style={styles.inputLabel}>Partner's Cosmic Code</Text>
            <TextInput
              style={styles.input}
              placeholder="XXXX-XXXX"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              value={partnerCode}
              onChangeText={setPartnerCode}
              autoCapitalize="characters"
              maxLength={9} // XXXX-XXXX
            />

            <TouchableOpacity style={styles.authButton} onPress={handleLinkCouple}>
              <Text style={styles.authButtonText}>Link Cosmic Connection</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton]}
              onPress={() => navigation.navigate('OnboardingCurrentVibe' as never)}>
              <Text style={[styles.secondaryButtonText]}>Generate My Code</Text>
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
    fontSize: theme.TYPOGRAPHY.title.fontSize,
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
    textAlign: 'center',
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.SIZES.buttonBorderRadius,
    paddingVertical: theme.SPACING.lg,
    alignItems: 'center',
    marginTop: theme.SPACING.md,
    borderWidth: 1,
    borderColor: theme.COLORS.accentPink,
  },
  authButtonText: {
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.keyword.fontSize,
    fontWeight: theme.TYPOGRAPHY.keyword.fontWeight,
    textTransform: theme.TYPOGRAPHY.keyword.textTransform,
    letterSpacing: theme.TYPOGRAPHY.keyword.letterSpacing,
  },
  secondaryButtonText: {
    color: theme.COLORS.accentPink,
    fontSize: theme.TYPOGRAPHY.keyword.fontSize,
    fontWeight: theme.TYPOGRAPHY.keyword.fontWeight,
    textTransform: theme.TYPOGRAPHY.keyword.textTransform,
    letterSpacing: theme.TYPOGRAPHY.keyword.letterSpacing,
  },
});

export default CoupleLinkingScreen;