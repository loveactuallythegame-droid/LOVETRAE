
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const loveActuallyLogo = require('../../../assets/logo/mainlogoone.png');

const GlobalHeader = ({ progress = 0 }) => {
  return (
    <View style={styles.container}>
      <Image source={loveActuallyLogo} style={styles.logo} />
      <View style={styles.progressWrapper}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        {/* This View creates the glow effect */}
        <View style={[styles.glow, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 10,
    width: '100%',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
  },
  progressWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  progressContainer: {
    height: 10,
    backgroundColor: 'rgba(92, 20, 89, 0.5)', // #5C1459 at 50% opacity
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#33DEA5',
    borderRadius: 5,
  },
  glow: {
    position: 'absolute',
    height: 10,
    top: 4, // Centering the glow with the bar
    borderRadius: 5,
    backgroundColor: '#FA1F63',
    shadowColor: '#FA1F63',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8, // For Android
  },
});

export default GlobalHeader;
