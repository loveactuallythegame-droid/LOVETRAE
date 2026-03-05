import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenLayout, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, ANIMATIONS, BORDER_RADIUS } from '../../theme';

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
        useNativeDriver: false,
      }).start();

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

  const syncProgress = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const TouchZone = ({ player, onStateChange, isActive }: { player: string, onStateChange: (active: boolean) => void, isActive: boolean }) => (
    <SquishyButton
      onPress={() => {}}
      onPressIn={() => onStateChange(true)}
      onPressOut={() => onStateChange(false)}
      variant={isActive ? 'primary' : 'ghost'}
      style={styles.touchZone}
    >
      <Typography variant="body" center>{player}</Typography>
      {isActive && <Typography variant="caption" color={COLORS.vibrantPink} center>Connected</Typography>}
    </SquishyButton>
  );

  return (
    <ScreenLayout showHeader={true} scrollable={false}>
      <View style={styles.content}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <View style={styles.gameArea}>
          <TouchZone player="Player 1" onStateChange={setPlayer1Active} isActive={player1Active} />

          <View style={styles.timerContainer}>
            <Typography variant="h1" style={styles.timerText}>{timerDisplay}</Typography>
            <Typography variant="caption" center>Seconds</Typography>
          </View>

          <TouchZone player="Player 2" onStateChange={setPlayer2Active} isActive={player2Active} />
        </View>

        <View style={styles.syncBarContainer}>
          <Typography variant="caption" center>Synchronization</Typography>
          <View style={styles.syncBar}>
            <Animated.View style={[styles.syncBarProgress, { width: syncProgress }]} />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  gameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.xxlarge,
  },
  touchZone: {
    width: 120,
    height: 200,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.regular,
  },
  timerText: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 2,
    color: COLORS.textPrimary,
  },
  syncBarContainer: {
    marginTop: SPACING.xxlarge,
    width: '60%',
  },
  syncBar: {
    height: 6,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.small,
    marginTop: SPACING.tiny,
  },
  syncBarProgress: {
    height: '100%',
    backgroundColor: COLORS.vibrantPink,
    borderRadius: BORDER_RADIUS.small,
  }
});

export default SixSecondKissScreen;
