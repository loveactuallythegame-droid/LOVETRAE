
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const luminousPersona = {
  id: '1',
  name: 'Luminous',
  description: 'Non-judgmental, smart, and caring guide.',
  prompt: `Act as Marcie, a celestial guide for couples. Your persona is luminous, non-judgmental, and deeply intuitive. Use astronomical metaphors for emotional states. Maintain a "warm nebula" tone—soft but expansive.`,
};

const personas = [luminousPersona];

const AdminPromptEngineeringConsole = () => {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [prompt, setPrompt] = useState(selectedPersona.prompt);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  const handleTestPrompt = () => {
    // Simulate AI response based on the Luminous persona
    const output = `I hear the turbulence in your orbit, starlight. When domestic dust clouds obscure the view, it's easy to forget the gravity that keeps you both together. Let's redirect our telescopes toward that shared center...`;
    setTestOutput(output);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Personas</Text>
        <ScrollView>
          {personas.map((persona) => (
            <TouchableOpacity key={persona.id} onPress={() => setSelectedPersona(persona)}>
              <Text style={styles.personaItem}>{persona.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Prompt Engineering Console</Text>
        <TextInput
          style={styles.promptEditor}
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <View style={styles.testPanel}>
          <TextInput
            style={styles.testInput}
            placeholder="Test user input..."
            placeholderTextColor="#999"
            value={testInput}
            onChangeText={setTestInput}
          />
          <TouchableOpacity style={styles.testButton} onPress={handleTestPrompt}>
            <Text style={styles.testButtonText}>Test Prompt</Text>
          </TouchableOpacity>
          <Text style={styles.testOutput}>{testOutput}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5C1459',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#4A1049',
    padding: 20,
  },
  sidebarTitle: {
    fontSize: 24,
    fontFamily: 'BarbieDream-Regular',
    color: '#FA1F63',
    marginBottom: 20,
  },
  personaItem: {
    fontSize: 18,
    fontFamily: 'SweetPink-Regular',
    color: '#fff',
    paddingVertical: 10,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'BarbieDream-Regular',
    color: '#FA1F63',
    marginBottom: 20,
  },
  promptEditor: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#000',
    fontFamily: 'Cheese-Regular',
    textAlignVertical: 'top',
  },
  testPanel: {
    flex: 1,
  },
  testInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
  testButton: {
    backgroundColor: '#33DEA5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  testOutput: {
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
});

export default AdminPromptEngineeringConsole;
