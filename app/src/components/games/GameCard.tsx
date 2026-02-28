import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import * as Haptics from 'expo-haptics';

const loveActuallyLogo = require('../../../assets/logo/mainlogoone.png');

// Enhanced cosmic retro arcade color mapping
const cosmicGlowColors = {
  "Physical Connection": ['#FA1F63', '#FCC738', '#EA031F'],
  "Vulnerability": ['#8B5CF6', '#A22AC4', '#9056EF'],
  "Empathy": ['#33DEA5', '#37CF97', '#00D4AA'],
  "Playfulness": ['#EC4899', '#FC0C84', '#FF6B9D'],
  "Intimacy": ['#BE1980', '#C60AB3', '#A22AC4'],
  "Trust": ['#22D3EE', '#37CF97', '#33DEA5'],
  "Communication": ['#FCC738', '#FFEF1F', '#FF9E3D'],
  "Romance": ['#E16BA9', '#FC0C84', '#FF6B9D'],
  "Conflict Resolution": ['#33DEA5', '#37CF97', '#00D4AA'],
  "Emotional Connection": ['#FA1F63', '#FCC738', '#EA031F'],
};

interface GameCardProps {
  category: string;
  title: string;
  description: string;
  onPress: () => void;
  isSelected?: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  duration?: string;
  players?: string;
}

const GameCard = ({
  category,
  title,
  description,
  onPress,
  isSelected = false,
  difficulty = 'Medium',
  duration = '15 min',
  players = '2 players',
}: GameCardProps) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const glowColors = cosmicGlowColors[category] || ['#FA1F63', '#FCC738', '#EA031F'];
  
  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return COLORS.mintGreen;
      case 'Medium': return COLORS.brightYellow;
      case 'Hard': return COLORS.vibrantPink;
      default: return COLORS.brightYellow;
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        {/* Multi-layered cosmic glow effect */}
        <View style={styles.glowContainer}>
          <LinearGradient
            colors={[...glowColors, 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowOuter, { shadowColor: glowColors[0] }]}
          />
          <LinearGradient
            colors={[glowColors[0], glowColors[1], 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowMiddle, { shadowColor: glowColors[1] }]}
          />
          <LinearGradient
            colors={[glowColors[2], 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowInner, { shadowColor: glowColors[2] }]}
          />
        </View>
        
        {/* Main card with cosmic retro arcade styling */}
        <BlurView intensity={80} tint="dark" style={[styles.card, isSelected && styles.cardSelected]}>
          {/* Game icon with cosmic ring */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[glowColors[0], glowColors[1]]}
              style={styles.iconRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Image source={loveActuallyLogo} style={styles.logo} />
          </View>
          
          {/* Game title with neon effect */}
          <Text style={[styles.title, { color: glowColors[0] }]} numberOfLines={2}>
            {title}
          </Text>
          
          {/* Game description */}
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
          
          {/* Game metadata */}
          <View style={styles.metadata}>
            <View style={[styles.metadataItem, { backgroundColor: getDifficultyColor(difficulty) }]}>
              <Text style={styles.metadataText}>{difficulty}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataText}>{duration}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataText}>{players}</Text>
            </View>
          </View>
          
          {/* Category badge with cosmic styling */}
          <View style={styles.footer}>
            <LinearGradient
              colors={[glowColors[0], glowColors[1]]}
              style={styles.categoryBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.category}>{category}</Text>
            </LinearGradient>
          </View>
          
          {/* Selection indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <LinearGradient
                colors={['#FCC738', '#EA031F']}
                style={styles.selectionBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.selectionText}>SELECTED</Text>
              </LinearGradient>
            </View>
          )}
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.card,
    margin: SPACING.small,
    width: 280,
    height: 380,
  },
  
  touchable: {
    flex: 1,
  },
  
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  glowOuter: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: BORDER_RADIUS.card + 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  
  glowMiddle: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BORDER_RADIUS.card + 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  },
  
  glowInner: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: BORDER_RADIUS.card + 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(45, 25, 80, 0.7)',
  },
  
  cardSelected: {
    borderColor: 'rgba(252, 199, 56, 0.5)',
    borderWidth: 2,
  },
  
  iconContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  
  iconRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.headerSmall,
    textAlign: 'center',
    marginBottom: SPACING.small,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  description: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    flex: 1,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: SPACING.regular,
  },
  
  metadataItem: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  metadataText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textPrimary,
  },
  
  footer: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: SPACING.regular,
    marginTop: SPACING.regular,
    width: '100%',
    alignItems: 'center',
  },
  
  categoryBadge: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
  },
  
  category: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  
  selectionIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
  },
  
  selectionBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
  },
  
  selectionText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.label,
    color: COLORS.textPrimary,
  },
});

export default GameCard;
