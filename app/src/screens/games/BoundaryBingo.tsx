
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity style={styles.bingoSquare} onPress={() => handlePress(item.id)}>
      <Text style={styles.bingoText}>{item.text}</Text>
      {markedSquares[item.id] && (
          <View style={[styles.marker, markedSquares[item.id] === 'YES' ? styles.yesMarker : styles.noMarker]}>
              <Text style={styles.markerText}>{markedSquares[item.id]}</Text>
          </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a2e2e', '#0a1111']} style={styles.background} />
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
  content: { flex: 1, padding: 10 },
  grid: { justifyContent: 'center', alignItems: 'center' },
  bingoSquare: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(22, 37, 37, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(51, 222, 165, 0.3)',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  bingoText: {
    fontFamily: 'SweetPink-Regular',
    color: '#FFF',
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
      backgroundColor: 'rgba(51, 222, 165, 0.7)', // #33DEA5 with opacity
  },
  noMarker: {
      backgroundColor: 'rgba(250, 31, 99, 0.7)', // #FA1F63 with opacity
  },
  markerText: {
      fontFamily: 'BarbieDream-Regular',
      color: '#FFF',
      fontSize: 24,
  }
});

export default BoundaryBingoScreen;
