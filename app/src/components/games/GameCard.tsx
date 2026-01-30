
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const loveActuallyLogo = require('../../../assets/logo/mainlogoone.png');
const marcieSkeptical = require('../../../assets/marcieimages/marcie-expressions/side-eye.png');

const nebulaGlowColors = {
  "Physical Connection": '#FA1F63',
  "Vulnerability": '#8b5cf6',
  "Empathy": '#33DEA5',
  "Playfulness": '#ec4899',
};

const GameCard = ({
  category,
  title,
  description,
  onPress,
  isSelected,
}) => {
  const glowColor = nebulaGlowColors[category] || '#FA1F63';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[glowColor, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.glow, { shadowColor: glowColor }]}
      />
      <BlurView intensity={100} tint="dark" style={styles.card}>
        <View style={styles.iconContainer}>
          <Image source={loveActuallyLogo} style={styles.logo} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.footer}>
          <Text style={[styles.category, { color: glowColor }]}>{category}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 10,
    width: 280,
    height: 400,
  },
  glow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontFamily: 'Work Sans',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Work Sans',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 15,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  category: {
    fontFamily: 'Work Sans',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default GameCard;
