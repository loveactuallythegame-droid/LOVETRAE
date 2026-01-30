
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// Placeholder for Lottie animations, assuming 'lottie-react-native' is installed.
// import LottieView from 'lottie-react-native';

const GlobalMarcieOverlay = ({ quote }: { quote?: string }) => {
  return (
    <View style={styles.marcieContainer}>
      {/* 
        The LottieView component will be used here. 
        <LottieView source={require('../../../assets/animations/marcie-idle.json')} autoPlay loop />
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
    height: 200, // Adjust as needed
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none', // Allow interactions with content underneath
  },
  marcieCharacterModel: {
    // This will be replaced by the Lottie animation component
    width: 150,
    height: 150,
    backgroundColor: '#FA1F63', // Temporary placeholder color
    borderRadius: 75,
  },
  speechBubble: {
    position: 'absolute',
    bottom: 160, // Position above the character model
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  quoteText: {
    fontFamily: 'SweetPink-Regular',
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GlobalMarcieOverlay;
