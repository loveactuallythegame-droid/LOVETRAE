
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
// In a real app, you'd use a Firebase function to send the push notification.
// For this example, we'll just log the intended action.

const AdminPushComposer = () => {
  const [coupleId, setCoupleId] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSend = () => {
    if (!coupleId || !message) {
      setFeedback('Couple ID and message are required.');
      return;
    }
    // In a real application, you would trigger a Firebase Cloud Function here.
    console.log(`Sending push notification to couple_id: ${coupleId}`);
    console.log(`Message: ${message}`);
    setFeedback(`Push notification sent to ${coupleId}!`);
    setCoupleId('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
      <Text style={styles.title}>Push Composer</Text>
      <TextInput
        style={styles.input}
        placeholder="Couple ID"
        value={coupleId}
        onChangeText={setCoupleId}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Notification Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C1459',
    padding: 20,
    alignItems: 'center',
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
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
  textArea: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    height: 120,
    textAlignVertical: 'top',
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
  button: {
    width: '90%',
    backgroundColor: '#33DEA5',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  feedback: {
    marginTop: 20,
    color: '#33DEA5',
    fontFamily: 'SweetPink-Regular',
    fontSize: 16,
  },
});

export default AdminPushComposer;
