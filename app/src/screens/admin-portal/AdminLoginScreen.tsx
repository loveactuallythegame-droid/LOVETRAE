
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig'; // Assuming you have this configured
import { useAppStore } from '../../state/store';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAdmin = useAppStore((s) => s.setAdmin);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, 'admins', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAdmin(true);
      } else {
        setError('You are not authorized to access the admin portal.');
        auth.signOut();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
      <Text style={styles.title}>Admin Console</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Authorize Access</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5C1459', // Glam Noir
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 20,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontFamily: 'BarbieDream-Regular', // Barbie Dream
        color: '#FA1F63', // Hot Pink
        marginBottom: 40,
    },
    input: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
        color: '#000',
        fontFamily: 'Cheese-Regular', // Cheese
    },
    button: {
        width: '80%',
        backgroundColor: '#33DEA5', // Teal
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 20,
    },
});

export default AdminLoginScreen;
