import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GlassCard, Text, SquishyButton, RadialGradientBackground } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MARCIE_IMAGE = require('../../../assets/marcieimages/marcieimage1.png');
const LOGO_IMAGE = require('../../../assets/logo/mainlogoone.png');

type Props = {
  onContinue: () => void;
};

export default function LegalDisclaimerScreen({ onContinue }: Props) {
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onContinue();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
          <Text variant="header" style={styles.title}>Love Actually...</Text>
        </View>

        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <View style={styles.heroSection}>
              <Text variant="header" style={styles.heroTitle}>Welcome, Seekers</Text>
            </View>

            <View style={styles.disclaimerSection}>
              <View style={styles.iconRow}>
                <Ionicons name="document-text" size={24} color="#FA1F63" />
                <Text variant="sass" style={styles.disclaimerLabel}>LEGAL DISCLAIMER</Text>
              </View>
              <ScrollView style={styles.scrollArea} persistentScrollbar showsVerticalScrollIndicator={true}>
                <Text variant="body" style={styles.disclaimerText}>
                  This game, Love Actually... The Game, is designed exclusively for entertainment and connection purposes between consenting adults. It provides a structured framework for dialogue and shared experiences.{'\n\n'}
                  Important: This experience is NOT a replacement for professional clinical therapy, medical advice, psychological diagnosis, or mental health counseling. If you or your partner are experiencing significant distress or require clinical intervention, please consult a licensed professional.{'\n\n'}
                  By proceeding, you acknowledge that you are participating voluntarily and that the creators of this game are not liable for any interpersonal outcomes or emotional responses triggered during gameplay.
                </Text>
              </ScrollView>
            </View>

            <View style={styles.footerSection}>
              <TouchableOpacity
                style={styles.checkboxRow}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.selectionAsync();
                  setAgreed(!agreed);
                }}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text variant="body" style={styles.checkboxLabel}>I understand and agree to the terms</Text>
              </TouchableOpacity>

              <SquishyButton onPress={handleContinue} style={[styles.btn, !agreed ? styles.btnDisabled : {}]} disabled={!agreed}>
                <Text variant="header" style={styles.btnText}>Continue Journey</Text>
                <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 8 }} />
              </SquishyButton>
            </View>
          </GlassCard>
        </View>
      </SafeAreaView>
      {/* Marcie Overlay - Peeking from bottom right */}
      <View style={styles.marcieContainer} pointerEvents="none">
        <Image source={MARCIE_IMAGE} style={styles.marcieImage} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120016' },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 10 },
  logo: { width: 60, height: 60 },
  title: { color: 'white', fontSize: 24, marginTop: 5 },
  contentContainer: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', paddingBottom: 40 },
  card: { padding: 0, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(26, 10, 31, 0.6)', maxHeight: '80%' },
  heroSection: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  heroTitle: { fontSize: 28, color: '#FA1F63' }, // romance-pink
  disclaimerSection: { padding: 20, flex: 1 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  disclaimerLabel: { color: '#FA1F63', letterSpacing: 1 },
  scrollArea: { flex: 1 },
  disclaimerText: { color: '#E2E8F0', lineHeight: 22, fontSize: 14 },
  footerSection: { padding: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', gap: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  checkboxLabel: { color: 'white', fontSize: 14 },
  btn: { backgroundColor: '#FA1F63', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontSize: 20 },
  marcieContainer: { position: 'absolute', bottom: -20, right: -20, height: 200, width: 150, zIndex: 10, opacity: 0.9 },
  marcieImage: { width: '100%', height: '100%' },
});
