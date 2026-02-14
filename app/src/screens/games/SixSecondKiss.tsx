
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';
import { SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SIZES, SPACING, GLOWS, moderateScale } from '../../theme';

const SIX_SECONDS = 6000;

const SixSecondKissScreen = () => {
  const [player1Active, setPlayer1Active] = useState(false);
  const [player2Active, setPlayer2Active] = useState(false);
  const [timer, setTimer] = useState(SIX_SECONDS);
  const [isKissing, setIsKissing] = useState(false);
  const timerAnimation = useRef(new Animated.Value(0)).current;

  const bothPlayersActive = player1Active && player2Active;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (bothPlayersActive) {
      setIsKissing(true);
      Animated.timing(timerAnimation, {
        toValue: 1,
        duration: SIX_SECONDS,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // calculateGameResults();
        }
      });

      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 10) {
            clearInterval(interval!);
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    } else {
      setIsKissing(false);
      timerAnimation.stop();
      if(interval) clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [bothPlayersActive]);

  const timerDisplay = (timer / 1000).toFixed(2);

  const circleProgress = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  const syncProgress = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const TouchZone = ({ player, onStateChange, isActive }: { player: string, onStateChange: (active: boolean) => void, isActive: boolean }) => (
    <View
      onMouseDown={() => onStateChange(true)}
      onMouseUp={() => onStateChange(false)}
      onTouchStart={() => onStateChange(true)}
      onTouchEnd={() => onStateChange(false)}
      style={[styles.touchZone, isActive && styles.touchZoneActive]}
    >
      <View style={[styles.touchIconContainer, isActive && styles.touchIconActive]}>
        <Text style={styles.touchIcon}>touch_app</Text>
      </View>
      <Text style={styles.playerLabel}>{player}</Text>
      {isActive && <Text style={styles.connectedText}>Connected</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.deepCosmicPurple, COLORS.richPlum]}
        style={styles.background}
      />
      <Header title="6-Second Kiss Challenge" />
      <View style={styles.content}>
        <Text style={styles.title}>6-Second Kiss Challenge</Text>
        <Text style={styles.subtitle}>Hold to ignite the spark</Text>

        <View style={styles.gameArea}>
          <TouchZone player="Player 1" onStateChange={setPlayer1Active} isActive={player1Active} />

          <View style={styles.timerContainer}>
            <Animated.View style={styles.timerCircle}>
              {/* Animated circle would go here */}
            </Animated.View>
            <Text style={styles.timerText}>{timerDisplay}</Text>
            <Text style={styles.secondsText}>Seconds</Text>
          </View>

          <TouchZone player="Player 2" onStateChange={setPlayer2Active} isActive={player2Active} />
        </View>

         <View style={styles.syncBarContainer}>
            <Text style={styles.syncLabel}>Synchronization</Text>
            <View style={styles.syncBar}>
                <Animated.View style={[styles.syncBarProgress, {width: syncProgress}]} />
            </View>
        </View>

      </View>
      <GlobalMarcieOverlay quote="A six-second kiss creates a psychological bridge that words cannot build." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181116' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: 48,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'SweetPink-Regular',
    fontSize: 18,
    color: '#ff006d',
    opacity: 0.8,
    marginBottom: 40,
  },
  gameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  touchZone: {
    width: 150,
    height: 250,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchZoneActive: {
    borderColor: '#f20da6',
    backgroundColor: 'rgba(242, 13, 166, 0.1)',
  },
  touchIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
   touchIconActive: {
      borderColor: '#f20da6',
      shadowColor: '#f20da6',
      shadowRadius: 15,
  },
  touchIcon: {
    fontFamily: 'Material Icons', // This would need to be a custom font or icon set
    fontSize: 40,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  playerLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  connectedText: {
      marginTop: 10,
      fontFamily: 'SweetPink-Regular',
      fontSize: 10,
      color: '#f20da6',
      backgroundColor: 'rgba(242, 13, 166, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'rgba(242, 13, 166, 0.3)',
      textTransform: 'uppercase'
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  timerCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 8,
      borderColor: 'rgba(255,255,255,0.05)',
      position: 'absolute'
  },
  timerText: {
    fontFamily: 'WonderfulSometimes-Regular',
    fontSize: 72,
    color: '#FFF',
  },
  secondsText: {
    fontFamily: 'HolidayChristmas-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -10,
  },
  syncBarContainer: {
      marginTop: 40,
      width: '60%',
  },
  syncLabel: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 12,
      fontFamily: 'HolidayChristmas-Regular',
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: 5,
  },
  syncBar: {
      height: 6,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 3,
  },
  syncBarProgress: {
      height: '100%',
      backgroundColor: '#f20da6',
      borderRadius: 3,
      shadowColor: '#f20da6',
      shadowRadius: 10,
  }
});

export default SixSecondKissScreen;
