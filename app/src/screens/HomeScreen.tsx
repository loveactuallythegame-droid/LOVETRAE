import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useGameStore } from '../lib/game-store';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { trustLevel, dailyQuest, leaderboard, gamesPlayed } = useGameStore();
  
  const [trustPercentage, setTrustPercentage] = useState(50);
  const [weeklyChange, setWeeklyChange] = useState(+15);
  const [liquidFillAnim] = useState(new Animated.Value(0));
  const [sosPulseAnim] = useState(new Animated.Value(1));
  const [sosGlowAnim] = useState(new Animated.Value(0.6));

  useEffect(() => {
    // Simulate trust level updates with liquid fill animation
    setTrustPercentage(Math.round(trustLevel * 100));
    
    // Trigger liquid fill animation
    Animated.timing(liquidFillAnim, {
      toValue: trustLevel * 100,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [trustLevel]);

  // SOS button pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sosPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sosGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sosGlowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    glowAnimation.start();
    
    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  const handleDailyQuest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('GamePlayScreen', { gameId: dailyQuest?.id });
  };

  const handleGameLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('GameLibraryGridView');
  };

  const handleSOS = () => {
    // Strong haptic feedback for SOS
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Vibration.vibrate([0, 200, 100, 200]); // SOS vibration pattern
    navigation.navigate('CrisisResources');
  };

  const gameCategories = [
    { id: 'emotional-connection', name: 'Emotional Connection', color: COLORS.vibrantPink, progress: 8 },
    { id: 'conflict-resolution', name: 'Conflict Resolution', color: COLORS.mintGreen, progress: 12 },
    { id: 'creative-chaos', name: 'Creative Chaos', color: COLORS.brightYellow, progress: 6 },
    { id: 'romance-hub', name: 'Romance Hub', color: COLORS.rosePink, progress: 15 },
    { id: 'healing-hospital', name: 'Healing Hospital', color: COLORS.lavenderPurple, progress: 4 },
    { id: 'game-show', name: 'Game Show', color: COLORS.warmOrange, progress: 10 },
    { id: 'love-arcade', name: 'Love Arcade', color: COLORS.blushPink, progress: 20 },
  ];

  // Liquid fill interpolation
  const liquidFillWidth = liquidFillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[COLORS.deepCosmicPurple, COLORS.richPlum]}
        style={styles.background}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section - 20% of screen */}
        <View style={styles.headerSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.connectionGradientStart, COLORS.connectionGradientMid, COLORS.connectionGradientEnd]}
                style={styles.avatarRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarText}>
                    {user?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.userStats}>
              <Text style={styles.userName}>{user?.displayName || 'Player'}</Text>
              <Text style={styles.userLevel}>Level 12 • 1,245 XP</Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>🔥 7 day streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Trust Thermometer - 40% of screen with liquid fill animation */}
        <View style={styles.trustSection}>
          <Text style={styles.sectionTitle}>Trust Thermometer</Text>
          <View style={styles.trustContainer}>
            {/* Liquid fill container */}
            <View style={styles.liquidFillContainer}>
              <LinearGradient
                colors={[
                  COLORS.progressGradientStart, 
                  COLORS.progressGradientMid1, 
                  COLORS.progressGradientMid2, 
                  COLORS.progressGradientEnd
                ]}
                style={styles.trustTrack}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Liquid fill effect */}
                <Animated.View 
                  style={[
                    styles.liquidFill, 
                    { width: liquidFillWidth }
                  ]}
                >
                  <LinearGradient
                    colors={[
                      'rgba(255, 255, 255, 0.3)',
                      'rgba(255, 255, 255, 0.1)',
                      'rgba(255, 255, 255, 0.3)'
                    ]}
                    style={styles.liquidShimmer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
              </LinearGradient>
              
              {/* Trust percentage with neon glow */}
              <View style={styles.trustPercentageContainer}>
                <Text style={styles.trustPercentage}>{trustPercentage}%</Text>
              </View>
            </View>
            
            {/* Weekly change indicator */}
            <View style={styles.weeklyChange}>
              <Text style={[
                styles.weeklyChangeText,
                { color: weeklyChange >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }
              ]}>
                {weeklyChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyChange)}% this week
              </Text>
            </View>
            
            {/* Trust level indicator */}
            <View style={styles.trustLevelIndicator}>
              <Text style={styles.trustLevelText}>
                {trustPercentage >= 80 ? 'Cosmic Connection' : 
                 trustPercentage >= 60 ? 'Stellar Bond' :
                 trustPercentage >= 40 ? 'Orbiting' :
                 trustPercentage >= 20 ? 'Drifting' : 'Lost in Space'}
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Quest Card */}
        {dailyQuest && (
          <TouchableOpacity
            style={styles.dailyQuestCard}
            onPress={handleDailyQuest}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.softViolet, COLORS.rosePink]}
              style={styles.dailyQuestGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.dailyQuestTitle}>Daily Quest</Text>
              <Text style={styles.dailyQuestDescription}>{dailyQuest.title}</Text>
              <Text style={styles.dailyQuestReward}>+50 XP • +10 Trust Points</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Leaderboard */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>You vs Partner</Text>
          <View style={styles.leaderboardContainer}>
            <View style={styles.leaderboardPillars}>
              {[
                { name: 'Trust', value: 75, color: COLORS.progressGradientStart },
                { name: 'Romance', value: 60, color: COLORS.rosePink },
                { name: 'Connection', value: 80, color: COLORS.softViolet },
                { name: 'Vulnerability', value: 45, color: COLORS.vibrantPink },
              ].map((pillar, index) => (
                <View key={index} style={styles.pillarItem}>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                  <View style={styles.pillarBar}>
                    <LinearGradient
                      colors={[pillar.color, `${pillar.color}80`]}
                      style={[styles.pillarFill, { width: `${pillar.value}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  <Text style={styles.pillarValue}>{pillar.value}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Game Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Game Categories</Text>
          <View style={styles.categoriesGrid}>
            {gameCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('CategoryGames', { categoryId: category.id })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[category.color, `${category.color}80`]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryProgress}>{category.progress}/25</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGameLibrary}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>BROWSE GAMES</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Enhanced Floating SOS Button with cosmic retro arcade styling */}
      <Animated.View 
        style={[
          styles.sosButtonContainer,
          {
            transform: [{ scale: sosPulseAnim }],
            opacity: sosGlowAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.sosButton}
          onPress={handleSOS}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
            style={styles.sosGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sosText}>∞♥</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepCosmicPurple,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxlarge,
  },
  
  // Header Section (20% of screen)
  headerSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: COLORS.richPlum,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    color: COLORS.textPrimary,
  },
  userStats: {
    flex: 1,
  },
  userName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerLarge,
    color: COLORS.textPrimary,
  },
  userLevel: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
  },
  streakContainer: {
    marginTop: SPACING.micro,
  },
  streakText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.brightYellow,
  },
  
  // Enhanced Trust Thermometer Section (40% of screen)
  trustSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  trustContainer: {
    backgroundColor: 'rgba(45, 25, 80, 0.4)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(252, 199, 56, 0.2)',
    ...SHADOWS.cosmic,
  },
  liquidFillContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  trustTrack: {
    height: 20,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    position: 'relative',
  },
  liquidFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
  },
  liquidShimmer: {
    flex: 1,
    width: '200%',
    transform: [{ translateX: -100 }],
  },
  trustPercentageContainer: {
    position: 'absolute',
    right: SPACING.small,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  trustPercentage: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weeklyChange: {
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  weeklyChangeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
  },
  trustLevelIndicator: {
    alignItems: 'center',
  },
  trustLevelText: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Daily Quest Card
  dailyQuestCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  dailyQuestGradient: {
    padding: SPACING.lg,
  },
  dailyQuestTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  dailyQuestDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  dailyQuestReward: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.brightYellow,
  },
  
  // Leaderboard
  leaderboardSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  leaderboardContainer: {
    backgroundColor: 'rgba(45, 25, 80, 0.3)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  leaderboardPillars: {
    spaceY: 12,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pillarName: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    width: 80,
  },
  pillarBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.small,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  pillarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.small,
  },
  pillarValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textPrimary,
    width: 30,
    textAlign: 'right',
  },
  
  // Categories
  categoriesSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.sm,
  },
  categoryCard: {
    width: '48%',
    margin: '1%',
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  categoryGradient: {
    padding: SPACING.md,
    height: 100,
    justifyContent: 'space-between',
  },
  categoryName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    color: COLORS.textPrimary,
  },
  categoryProgress: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textPrimary,
    opacity: 0.8,
  },
  
  // Quick Actions
  quickActions: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
    ...SHADOWS.neon,
  },
  buttonGradient: {
    paddingVertical: SPACING.regular,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  // Enhanced Floating SOS Button
  sosButtonContainer: {
    position: 'absolute',
    bottom: SPACING.xlarge,
    right: SPACING.xlarge,
    zIndex: 1000,
  },
  sosButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    ...SHADOWS.neonStrong,
  },
  sosGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.headerLarge,
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default HomeScreen;
