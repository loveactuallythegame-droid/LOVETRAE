
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import GameCard from '../../components/games/GameCard';

const repairOptions = [
  {
    id: '1',
    category: 'Physical Connection',
    title: '6-Second Hug',
    description: 'Release oxytocin and ground each other through physical presence.',
  },
  {
    id: '2',
    category: 'Vulnerability',
    title: 'Direct Apology',
    description: 'Take ownership of your part in the friction with zero justifications.',
  },
  {
    id: '3',
    category: 'Empathy',
    title: 'Active Listening',
    description: 'Hold space for their perspective without planning your response.',
  },
  {
    id: '4',
    category: 'Playfulness',
    title: 'Silly Humor',
    description: 'Crack the tension with an inside joke or a lighthearted observation.',
  },
];

const RepairAttemptScreen = () => {
  const [selectedPath, setSelectedPath] = useState(null);

  const handleSelectPath = (pathId) => {
    setSelectedPath(pathId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Peace Offering</Text>
      <Text style={styles.subtitle}>
        Tension detected in the cosmic field. Select a repair attempt to realign your orbits and restore harmony to the connection.
      </Text>
      <FlatList
        data={repairOptions}
        renderItem={({ item }) => (
          <GameCard
            {...item}
            onPress={() => handleSelectPath(item.id)}
            isSelected={selectedPath === item.id}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CHOOSE THIS PATH</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#230f19',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  list: {
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#FA1F63',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RepairAttemptScreen;
