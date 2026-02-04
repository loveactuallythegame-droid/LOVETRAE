import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
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
      
      {/* Dr. Marcie Section */}
      <View style={styles.drMarcieSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>Expressing admiration strengthens your bond! Each target hit represents a positive trait you appreciate in your partner.</Text>
        </View>
      </View>
      
      <Header title="Admiration Aim" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.targetContainer}>
          <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.outerRing]}
          />
          <LinearGradient
            colors={['#ff7600', '#ffef1f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.middleRing]}
          />
          <LinearGradient
            colors={['#37cf97', '#b37dec']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.innerRing]}
          />
          <LinearGradient
            colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bullseye}
          />
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
                <LinearGradient
                  colors={['#db147c', '#f05d68']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scoreValueContainer}
                >
                  <Text style={styles.scoreValue}>{score}</Text>
                </LinearGradient>
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
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    margin: 16,
    marginBottom: 8
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  },
  content: { padding: 20, alignItems: 'center' },
  targetContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  ring: {
    position: 'absolute',
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  outerRing: { width: 300, height: 300 },
  middleRing: { width: 200, height: 200 },
  innerRing: { width: 100, height: 100 },
  bullseye: { width: 50, height: 50, borderRadius: 25 },
  kudosContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(92, 20, 89, 0.2)',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  kudosTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#db147c',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  kudoText: {
    fontFamily: 'SweetPink-Regular',
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    color: '#db147c',
    fontSize: 18,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scoreValueContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scoreValue: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fireButton: {
      backgroundColor: '#db147c',
      paddingVertical: 20,
      paddingHorizontal: 50,
      borderRadius: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
  },
  fireButtonText: {
      fontFamily: 'BarbieDream-Regular',
      color: '#FFF',
      fontSize: 24,
  }
});

export default AdmirationAimScreen;