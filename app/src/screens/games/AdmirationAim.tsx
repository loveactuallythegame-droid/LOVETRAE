
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';
import { SquishyButton } from '../../components/ui';

const AdmirationAimScreen = () => {
  // Placeholder for game state and logic
  const score = 1200;
  const kudos = ["You're an amazing listener.", "I love your sense of humor.", "Thank you for always being there for me."];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#5C1459', '#1a0a1a']} style={styles.background} />
      <Header title="Admiration Aim" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.targetContainer}>
          {/* Concentric rings of the target would be animated here */}
          <View style={[styles.ring, styles.outerRing]} />
          <View style={[styles.ring, styles.middleRing]} />
          <View style={[styles.ring, styles.innerRing]} />
          <View style={styles.bullseye} />
        </View>

        <View style={styles.kudosContainer}>
          <Text style={styles.kudosTitle}>Kudos Corner</Text>
          {kudos.map((kudo, index) => (
            <Text key={index} style={styles.kudoText}>- {kudo}</Text>
          ))}
        </View>

        <View style={styles.scoreAndActionContainer}>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <SquishyButton style={styles.fireButton}>
                <Text style={styles.fireButtonText}>Fire!</Text>
            </SquishyButton>
        </View>
      </ScrollView>
      <GlobalMarcieOverlay quote={`Right in the heart! Another perfect shot.`} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a1a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20, alignItems: 'center' },
  targetContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  ring: {
    position: 'absolute',
    borderRadius: 150,
  },
  outerRing: { width: 300, height: 300, backgroundColor: 'rgba(250, 31, 99, 0.2)' }, // #FA1F63 opacity
  middleRing: { width: 200, height: 200, backgroundColor: 'rgba(250, 31, 99, 0.4)' },
  innerRing: { width: 100, height: 100, backgroundColor: 'rgba(250, 31, 99, 0.6)' },
  bullseye: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FA1F63' },
  kudosContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(92, 20, 89, 0.2)',
    borderRadius: 16,
    marginBottom: 20,
  },
  kudosTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#33DEA5',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  kudoText: {
    fontFamily: 'SweetPink-Regular',
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  scoreAndActionContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
  },
  scoreContainer: {
      alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    color: '#33DEA5',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#FFF',
    fontSize: 48,
  },
  fireButton: {
      backgroundColor: '#33DEA5',
      paddingVertical: 20,
      paddingHorizontal: 50,
      borderRadius: 40,
  },
  fireButtonText: {
      fontFamily: 'BarbieDream-Regular',
      color: '#5C1459',
      fontSize: 24,
  }
});

export default AdmirationAimScreen;
