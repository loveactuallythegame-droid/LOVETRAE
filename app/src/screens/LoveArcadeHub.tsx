import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const ARCADE_GAMES = [
  {
    id: 'truth-teller-tower',
    name: 'TRUTH TELLER TOWER',
    phase: 'PHASE 1: FOUNDATION',
    format: 'Who Wants to Be a Millionaire meets Newlywed Game',
    description: "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain—if you're lucky.",
    icon: '🗼',
    colors: ['#FA1F63', '#FCC738', '#EA031F'],
    maxScore: 100,
    cabinetStyle: 'tower',
  },
  {
    id: 'echo-chamber-escape',
    name: 'ESCAPE FROM THE ECHO CHAMBER',
    phase: 'PHASE 2: DECONSTRUCTION',
    format: 'Digital Escape Room',
    description: "Trapped in a hall of infinite mirrors, each reflecting a version of the 'love script.' Break the loop.",
    icon: '🪞',
    colors: ['#8B5CF6', '#A22AC4', '#9056EF'],
    maxScore: 100,
    cabinetStyle: 'mirror',
  },
  {
    id: 'intimacy-feud',
    name: 'THE INTIMACY FEUD',
    phase: 'PHASE 3: SHARED REALITY',
    format: 'Family Feud Style',
    description: "Survey says... be boring. Be authentic. Face off against The Ghost of the Old Script.",
    icon: '👨‍👩‍👧‍👦',
    colors: ['#33DEA5', '#37CF97', '#00D4AA'],
    maxScore: 250,
    cabinetStyle: 'feud',
  },
];

const ArcadeGameCard = ({ game, onPress }: any) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0.6));

  useEffect(() => {
    // Neon glow pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.arcadeCard,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        {/* Neon cabinet glow effect */}
        <Animated.View 
          style={[
            styles.cabinetGlow,
            { 
              opacity: glowAnim,
              shadowColor: game.colors[0],
            }
          ]}
        />
        
        {/* Main cabinet body */}
        <LinearGradient
          colors={[
            'rgba(45, 25, 80, 0.9)',
            'rgba(26, 11, 46, 0.8)',
            'rgba(45, 25, 80, 0.7)'
          ]}
          style={styles.cabinetBody}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Cabinet frame with neon border */}
          <View style={[styles.cabinetFrame, { borderColor: game.colors[0] }]}>
            
            {/* Game screen/monitor */}
            <View style={styles.gameScreen}>
              <LinearGradient
                colors={[game.colors[0], game.colors[1]]}
                style={styles.screenGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.gameIcon, { fontSize: 48 }]}>{game.icon}</Text>
              </LinearGradient>
            </View>
            
            {/* Game title marquee */}
            <View style={styles.marqueeContainer}>
              <Text style={[styles.gameName, { color: game.colors[1] }]}>
                {game.name}
              </Text>
            </View>
            
            {/* Phase indicator */}
            <View style={[styles.phaseIndicator, { backgroundColor: game.colors[0] }]}>
              <Text style={styles.phaseText}>{game.phase}</Text>
            </View>
            
            {/* Game description */}
            <Text style={styles.gameDesc}>{game.description}</Text>
            
            {/* Control panel */}
            <View style={styles.controlPanel}>
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreLabel}>MAX SCORE</Text>
                <Text style={[styles.scoreValue, { color: game.colors[1] }]}>
                  {game.maxScore}
                </Text>
              </View>
              
              {/* Play button with neon effect */}
              <TouchableOpacity style={[styles.playButton, { backgroundColor: game.colors[0] }]}>
                <LinearGradient
                  colors={[game.colors[0], game.colors[1]]}
                  style={styles.playButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.playButtonText}>▶ PLAY</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Cabinet legs/feet */}
            <View style={styles.cabinetLegs}>
              <View style={[styles.leg, { backgroundColor: game.colors[0] }]} />
              <View style={[styles.leg, { backgroundColor: game.colors[0] }]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LoveArcadeHub({ navigation }: any) {
  const [totalScore, setTotalScore] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [titleGlowAnim] = useState(new Animated.Value(0.6));

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Title neon glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(titleGlowAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack();
  };

  const handleGamePress = (game: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const screenMap: Record<string, string> = {
      'truth-teller-tower': 'TruthTellerTower',
      'echo-chamber-escape': 'EscapeEchoChamber',
      'intimacy-feud': 'IntimacyFeud',
      'relational-jeopardy': 'RelationalJeopardy',
      'family-forge': 'ChoppedFamily',
      'harbor-storm': 'HarborMasterChallenge',
    };
    navigation?.navigate(screenMap[game.id] || 'MainGameLibrary');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={[
          COLORS.arenaBgStart, // #1A0D2E
          COLORS.arenaBgEnd,   // #3D1B5A
          COLORS.deepCosmicPurple
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated cosmic background particles */}
        <View style={styles.particlesContainer}>
          {[...Array(15)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  opacity: Math.random() * 0.8 + 0.2,
                  backgroundColor: ['#FCC738', '#EA031F', '#C60AB3'][Math.floor(Math.random() * 3)],
                }
              ]}
            />
          ))}
        </View>
        
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Enhanced Header with neon effects */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <LinearGradient
                colors={['#FCC738', '#EA031F']}
                style={styles.backButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.backButtonText}>←</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Animated.View style={[styles.titleContainer, { opacity: titleGlowAnim }]}>
                <Text style={styles.arcadeTitle}>🎮 THE LOVE ARCADE 🎮</Text>
              </Animated.View>
              <Text style={styles.arcadeSubtitle}>INSERT COIN. HOLD HANDS. PREPARE FOR TRUTH.</Text>
            </View>
            
            <View style={styles.headerRight} />
          </View>

          {/* Dr. Marcie Intro with cosmic styling */}
          <BlurView intensity={20} tint="dark" style={styles.marcieIntro}>
            <Text style={styles.marcieQuote}>
              "Welcome to the Love Arcade, you glorious disaster couple. We don't do 'safe spaces.' We do safe SCORES."
            </Text>
            <Text style={styles.marcieSig}>— DR. MARCIE LISS, PHD IN CALLING IT LIKE SHE SEES IT</Text>
          </BlurView>

          {/* Enhanced Leaderboard with neon styling */}
          <View style={styles.leaderboard}>
            <View style={[styles.scoreBox, styles.neonBox]}>
              <Text style={styles.scoreLabel}>TOTAL ARCADE SCORE</Text>
              <Text style={styles.totalScore}>{totalScore}</Text>
              <Text style={styles.maxLabel}>/ 2450 MAX</Text>
            </View>
            <View style={[styles.badgesBox, styles.neonBox]}>
              <Text style={styles.badgesLabel}>BADGES EARNED</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>🏗️</Text>
                <Text style={styles.badge}>🪞</Text>
                <Text style={styles.badge}>🗡️</Text>
                <Text style={styles.badge}>🏰</Text>
              </View>
            </View>
          </View>

          {/* Games List with neon cabinet aesthetic */}
          <ScrollView 
            style={styles.gamesList} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gamesListContent}
          >
            <Text style={styles.sectionTitle}>CHAMPIONSHIP GAMES</Text>
            {ARCADE_GAMES.map((game) => (
              <ArcadeGameCard
                key={game.id}
                game={game}
                onPress={() => handleGamePress(game)}
              />
            ))}

            {/* Final Ritual Teaser with cosmic styling */}
            <View style={styles.finalRitual}>
              <Text style={styles.ritualIcon}>🔥</Text>
              <Text style={styles.ritualTitle}>THE DIGITAL BONFIRE</Text>
              <Text style={styles.ritualDesc}>
                Complete all 4 phases to unlock the Final Ritual. Burn the workbook. Rise from the ashes.
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepCosmicPurple,
  },
  
  backgroundGradient: {
    flex: 1,
  },
  
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  particle: {
    position: 'absolute',
    borderRadius: 999,
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  content: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.safeTop || 16,
    paddingBottom: SPACING.regular,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  backButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  
  headerRight: {
    width: 40,
  },
  
  titleContainer: {
    marginBottom: SPACING.micro,
  },
  
  arcadeTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.displaySmall,
    color: COLORS.primaryGradientStart,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    textShadowColor: 'rgba(219, 20, 124, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  arcadeSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  marcieIntro: {
    marginHorizontal: SPACING.screenPadding,
    marginVertical: SPACING.regular,
    padding: SPACING.cardPadding,
    borderRadius: BORDER_RADIUS.card,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryGradientStart,
    backgroundColor: 'rgba(219, 20, 124, 0.1)',
  },
  
  marcieQuote: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.small,
  },
  
  marcieSig: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.primaryGradientStart,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  leaderboard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.screenPadding,
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  
  neonBox: {
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(252, 199, 56, 0.3)',
    ...SHADOWS.neonSoft,
  },
  
  scoreBox: {
    flex: 1,
    padding: SPACING.cardPadding,
    alignItems: 'center',
    backgroundColor: 'rgba(252, 199, 56, 0.1)',
  },
  
  scoreLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    marginBottom: SPACING.micro,
  },
  
  totalScore: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.displaySmall,
    color: COLORS.brightYellow,
    textShadowColor: 'rgba(252, 199, 56, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  
  maxLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textHint,
    textTransform: 'uppercase',
  },
  
  badgesBox: {
    flex: 1,
    padding: SPACING.cardPadding,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  badgesLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    marginBottom: SPACING.small,
  },
  
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  
  badge: {
    fontSize: 28,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  
  gamesList: {
    flex: 1,
  },
  
  gamesListContent: {
    paddingHorizontal: SPACING.screenPadding,
  },
  
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.headerLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.regular,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    textAlign: 'center',
  },
  
  // Neon Cabinet Styles
  arcadeCard: {
    marginBottom: SPACING.xlarge,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
  },
  
  cardTouchable: {
    flex: 1,
  },
  
  cabinetGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: BORDER_RADIUS.card + 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  
  cabinetBody: {
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  cabinetFrame: {
    flex: 1,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    padding: SPACING.regular,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  gameScreen: {
    height: 120,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    marginBottom: SPACING.regular,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  screenGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  marqueeContainer: {
    marginBottom: SPACING.small,
  },
  
  gameName: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    marginBottom: SPACING.micro,
  },
  
  phaseIndicator: {
    alignSelf: 'center',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.small,
  },
  
  phaseText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  gameDesc: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING.regular,
  },
  
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.regular,
  },
  
  scoreDisplay: {
    alignItems: 'center',
  },
  
  scoreLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textHint,
    textTransform: 'uppercase',
    marginBottom: SPACING.micro,
  },
  
  scoreValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
  },
  
  playButton: {
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
    ...SHADOWS.neon,
  },
  
  playButtonGradient: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
  },
  
  playButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  cabinetLegs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.regular,
    paddingHorizontal: SPACING.xlarge,
  },
  
  leg: {
    width: 8,
    height: 20,
    borderRadius: BORDER_RADIUS.small,
  },
  
  finalRitual: {
    backgroundColor: 'rgba(234, 3, 31, 0.1)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 3, 31, 0.3)',
    marginTop: SPACING.xlarge,
  },
  
  ritualIcon: {
    fontSize: 48,
    marginBottom: SPACING.small,
  },
  
  ritualTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    color: COLORS.primaryGradientStart,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: SPACING.small,
  },
  
  ritualDesc: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
});

export default LoveArcadeHub;
