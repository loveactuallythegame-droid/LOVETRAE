
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES, SPACING, GLOWS } from '../../theme';
// Placeholder for Lottie animations, assuming 'lottie-react-native' is installed.
// import LottieView from 'lottie-react-native';

const GlobalMarcieOverlay = ({ quote }: { quote?: string }) => {
  return (
    <View style={styles.marcieContainer}>
      {/*
        The LottieView component will be used here.
        <LottieView source={require('../../../public/animations/marcie-idle.webm')} autoPlay loop />
      */}
      <View style={styles.marcieCharacterModel} />
      {quote && (
        <View style={styles.speechBubble}>
          <Text style={styles.quoteText}>{quote}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  marcieContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(200), // Responsive height
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none', // Allow interactions with content underneath
  },
  marcieCharacterModel: {
    // This will be replaced by the Lottie animation component
    width: moderateScale(150),
    height: moderateScale(150),
    backgroundColor: COLORS.vibrantPink, // Dr. Marcie's signature color
    borderRadius: moderateScale(75),
    ...GLOWS.medium(COLORS.vibrantPink)
  },
  speechBubble: {
    position: 'absolute',
    bottom: moderateScale(160), // Responsive positioning above character
    backgroundColor: COLORS.nightSky,
    borderRadius: SIZES.cardBorderRadius,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: COLORS.vibrantPink,
    ...GLOWS.soft(COLORS.vibrantPink)
  },
  quoteText: {
    ...TYPOGRAPHY.marcieDialogue,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default GlobalMarcieOverlay;
