import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';

const BINGO_SQUARES = [
  { id: '1', text: '"Can you not look at your phone while I'm talking?"' },
  { id: '2', text: '"I need some alone time tonight."' },
  { id: '3', text: '"Please don't raise your voice at me."' },
  { id: '4', text: '"I'm not comfortable discussing that with your family."' },
  { id: '5', text: '"It's not okay to make jokes about that."' },
  // ... add all 25 squares
].concat(Array.from({ length: 20 }, (_, i) => ({ id: (i + 6).toString(), text: `Boundary #${i+6}` })))

const BoundaryBingoScreen = () => {
  const [markedSquares, setMarkedSquares] = useState<{ [key: string]: 'YES' | 'NO' }>({});

  const handlePress = (id: string) => {
    setMarkedSquares(prev => ({
        ...prev,
        [id]: prev[id] === 'YES' ? 'NO' : 'YES'
    }));
  }

  const renderItem = ({ item }: { item: { id: string; text: string } }) => (
    <LinearGradient
      colors={['#db147c', '#f05d68']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bingoSquare}
    >
      <TouchableOpacity style={styles.touchableArea} onPress={() => handlePress(item.id)}>
        <Text style={styles.bingoText}>{item.text}</Text>
        {markedSquares[item.id] && (
            <View style={[styles.marker, markedSquares[item.id] === 'YES' ? styles.yesMarker : styles.noMarker]}>
                <Text style={styles.markerText}>{markedSquares[item.id]}</Text>
            </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a2e2e', '#0a1111']} style={styles.background} />
      
      {/* Dr. Marcie Section */}
      <View style={styles.drMarcieSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>Establish healthy boundaries! Clear communication protects both partners' wellbeing.</Text>
        </View>
      </View>
      
      <Header title="Boundary Bingo" />
      <View style={styles.content}>
        <FlatList
          data={BINGO_SQUARES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={5}
          contentContainerStyle={styles.grid}
        />
      </View>
      <GlobalMarcieOverlay quote="Remember, a good fence makes good neighbors... and good partners."/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1111' },
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
  content: { flex: 1, padding: 10 },
  grid: { justifyContent: 'center', alignItems: 'center' },
  bingoSquare: {
    width: 70,
    height: 70,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  touchableArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  bingoText: {
    fontFamily: 'SweetPink-Regular',
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
  },
  marker: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 0, // a circle would be half the width/height
  },
  yesMarker: {
      backgroundColor: 'rgba(55, 207, 151, 0.7)', // #37cf97 with opacity
  },
  noMarker: {
      backgroundColor: 'rgba(219, 20, 124, 0.7)', // #db147c with opacity
  },
  markerText: {
      fontFamily: 'BarbieDream-Regular',
      color: '#FFF',
      fontSize: 24,
  }
});

export default BoundaryBingoScreen;