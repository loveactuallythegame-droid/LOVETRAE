
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';

const VibeSyncScreen = () => {
  const [syncProgress, setSyncProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the sync progress
    Animated.timing(syncProgress, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false, // Cannot use native driver for color interpolation
    }).start();
  }, []);

  const ring1Rotation = syncProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  const ring2Rotation = syncProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '-360deg'],
  });

  const syncColor = syncProgress.interpolate({
      inputRange: [0, 50, 100],
      outputRange: ['#FA1F63', '#FACC15', '#33DEA5']
  })

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a0a1a', '#5C1459']} style={styles.background} />
      <Header title="Vibe Sync" />
      <View style={styles.content}>
        <Text style={styles.title}>Synchronize Your Vibes</Text>
        <Text style={styles.instruction}>Tap and hold when you feel the connection</Text>

        <View style={styles.syncContainer}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: ring1Rotation }] }]} />
          <Animated.View style={[styles.ring, styles.ring2, { transform: [{ rotate: ring2Rotation }] }]} />
          <Animated.Text style={[styles.syncPercentage, {color: syncColor}]}>
            {/* This would be bound to a real-time value */}
            88%
          </Animated.Text>
        </View>

        <View style={styles.playerTagsContainer}>
            <Text style={styles.playerTag}>You</Text>
            <Text style={styles.playerTag}>Partner</Text>
        </View>
      </View>
      <GlobalMarcieOverlay quote="Feel the rhythm? That's your connection strengthening."/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a1a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: '#FFF',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  instruction: {
    fontFamily: 'HolidayChristmas-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
  },
  syncContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 150,
    borderWidth: 5,
    borderColor: '#FA1F63',
    borderTopColor: 'transparent',
    borderBottomColor: '#33DEA5',
  },
  ring2: {
      width: '80%',
      height: '80%',
      borderRadius: 120,
      borderColor: '#33DEA5',
      borderTopColor: '#FA1F63',
      borderBottomColor: 'transparent',
  },
  syncPercentage: {
    fontFamily: 'WonderfulSometimes-Regular',
    fontSize: 72,
  },
  playerTagsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 40,
      marginTop: 60,
  },
  playerTag: {
      fontFamily: 'SweetPink-Regular',
      fontSize: 16,
      color: '#FFF',
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
  }
});

export default VibeSyncScreen;
