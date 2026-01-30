
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';
import { SquishyButton } from '../../components/ui';

const SixSecondKissResultsScreen = () => {
  // Placeholder for results data
  const gameResults = {
    kissScore: 600,
    syncBonus: 250,
    totalScore: 850,
    syncPercentage: 88, // Example percentage
  };

  // This function would be replaced by the actual calculateGameResults logic
  const calculateGameResults = () => gameResults;

  const { kissScore, syncBonus, totalScore, syncPercentage } = calculateGameResults();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#230f15', '#181114']} style={styles.background} />
      <Header title="Results" />
      <View style={styles.content}>
        <Text style={styles.mainTitle}>The 6-Second Kiss</Text>
        <Text style={styles.subtitle}>Challenge Complete</Text>

        <View style={styles.resultsContainer}>
            <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>Kiss Score</Text>
                <Text style={styles.scoreValue}>{kissScore}</Text>
            </View>
            <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>Sync Bonus</Text>
                <Text style={styles.scoreValue}>+{syncBonus}</Text>
            </View>
        </View>

        <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScoreLabel}>Total Score</Text>
            <Text style={styles.totalScoreValue}>{totalScore}</Text>
        </View>

        <View style={styles.syncDisplay}>
            <Text style={styles.syncPercentage}>{syncPercentage}%</Text>
            <Text style={styles.syncLabel}>Synchronization</Text>
        </View>

        <View style={styles.buttonContainer}>
            <SquishyButton style={styles.actionButton}>
                <Text style={styles.buttonText}>Try Again</Text>
            </SquishyButton>
            <SquishyButton style={styles.actionButton}>
                <Text style={styles.buttonText}>Next Challenge</Text>
            </SquishyButton>
        </View>
      </View>
      <GlobalMarcieOverlay quote="Not bad. For amateurs."/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181114' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  mainTitle: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: 52,
    color: '#FFF',
    textShadowColor: '#ff0048',
    textShadowRadius: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'SweetPink-Regular',
    fontSize: 14,
    color: '#ff0048',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 40,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 72, 0.3)',
  },
  scoreLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  scoreValue: {
    fontFamily: 'WonderfulSometimes-Regular',
    fontSize: 42,
    color: '#FFF',
  },
  totalScoreContainer: {
      alignItems: 'center',
      marginBottom: 30,
  },
  totalScoreLabel: {
      fontFamily: 'HolidayChristmas-Regular',
      fontSize: 20,
      color: '#ff0048',
      textTransform: 'uppercase',
      letterSpacing: 2,
  },
  totalScoreValue: {
      fontFamily: 'BarbieDream-Regular',
      fontSize: 80,
      color: '#FFF',
      textShadowColor: '#ff0048',
      textShadowRadius: 20,
  },
  syncDisplay: {
      alignItems: 'center',
      marginBottom: 40,
  },
  syncPercentage: {
      fontFamily: 'WonderfulSometimes-Regular',
      fontSize: 36,
      color: '#33DEA5',
  },
  syncLabel: {
      fontFamily: 'SweetPink-Regular',
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)'
  },
  buttonContainer: {
      flexDirection: 'row',
  },
  actionButton: {
      marginHorizontal: 10,
      backgroundColor: '#ff0048',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
  },
  buttonText: {
      fontFamily: 'BarbieDream-Regular',
      color: '#FFF',
      fontSize: 18,
  }
});

export default SixSecondKissResultsScreen;
