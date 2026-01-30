
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';

const AdminGameEditorScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { game } = route.params;
  const [title, setTitle] = useState(game.title);
  const [instructions, setInstructions] = useState(game.instructions);
  const [gradingKeys, setGradingKeys] = useState(JSON.stringify(game.grading_keys, null, 2));

  const handleSave = async () => {
    const gameRef = doc(db, 'game_library', game.id);
    try {
      await updateDoc(gameRef, {
        title,
        instructions,
        grading_keys: JSON.parse(gradingKeys),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Edit Game</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.textArea}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Instructions"
        multiline
      />
      <TextInput
        style={styles.textArea}
        value={gradingKeys}
        onChangeText={setGradingKeys}
        placeholder="Grading Keys (JSON)"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C1459',
    padding: 20,
  },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
  title: {
    fontSize: 32,
    fontFamily: 'BarbieDream-Regular',
    color: '#FA1F63',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    height: 150,
    textAlignVertical: 'top',
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
  button: {
    backgroundColor: '#33DEA5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminGameEditorScreen;
