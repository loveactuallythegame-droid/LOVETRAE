
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebaseClient';
import { LinearGradient } from 'expo-linear-gradient';

const MatchmakingScreen = () => {
  const [myCode, setMyCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Generate a code to share with your partner, or enter their code to connect.');
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  let lobbyListener = null;

  const generateCode = async () => {
    if (myCode) {
      Alert.alert("Code already generated", `Your code is: ${myCode}`);
      return;
    }
    setIsSearching(true);
    setStatusMessage('Generating your unique connection code...');
    try {
      const lobbyRef = await addDoc(collection(db, 'lobbies'), {
        initiatorId: currentUser.uid,
        status: 'waiting',
        createdAt: new Date(),
      });
      setMyCode(lobbyRef.id);
      setStatusMessage(`Your code is: ${lobbyRef.id}. Share it with your partner.`);

      // Listen for a partner to join
      lobbyListener = onSnapshot(doc(db, 'lobbies', lobbyRef.id), (doc) => {
        const data = doc.data();
        if (data && data.status === 'matched') {
          setIsSearching(false);
          if (lobbyListener) lobbyListener(); // Unsubscribe
          navigation.navigate('GameLobby', { coupleId: doc.id });
        }
      });

    } catch (error) {
      Alert.alert('Error', 'Could not generate a code. Please try again.');
      setIsSearching(false);
      setStatusMessage('Failed to generate code. Please try again.');
    }
  };

  const connectToPartner = async () => {
    if (!partnerCode) {
      Alert.alert('No Code', 'Please enter your partner\'s code.');
      return;
    }
    setIsSearching(true);
    setStatusMessage(`Searching for partner with code: ${partnerCode}...`);

    try {
      const lobbyRef = doc(db, 'lobbies', partnerCode);
      const lobbySnap = await getDoc(lobbyRef);

      if (lobbySnap.exists() && lobbySnap.data().status === 'waiting') {
        await updateDoc(lobbyRef, {
          status: 'matched',
          joinerId: currentUser.uid,
        });
        // The initiator's listener will handle their navigation.
        // We navigate the joiner here.
        setIsSearching(false);
        navigation.navigate('GameLobby', { coupleId: partnerCode });
      } else {
        throw new Error('Lobby not found or already full.');
      }
    } catch (error) {
      Alert.alert('Connection Failed', error.message);
      setIsSearching(false);
      setStatusMessage('Connection failed. Please check the code and try again.');
    }
  };

  useEffect(() => {
    // Cleanup listener on unmount
    return () => {
      if (lobbyListener) {
        lobbyListener();
      }
    };
  }, [lobbyListener]);

  return (
    <LinearGradient colors={['#1b192e', '#0e0d1a']} style={styles.container}>
        <Text style={styles.title}>Connect with Your Partner</Text>
        <Text style={styles.statusText}>{statusMessage}</Text>

        {isSearching && <ActivityIndicator size="large" color="#fc0c84" style={{ marginVertical: 20 }}/>}

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Share Your Code</Text>
            <TouchableOpacity style={styles.button} onPress={generateCode}>
                <Text style={styles.buttonText}>{myCode ? `Code: ${myCode}` : 'Generate Code'}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Partner's Code</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter code..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={partnerCode}
                onChangeText={setPartnerCode}
            />
            <TouchableOpacity style={styles.button} onPress={connectToPartner}>
                <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
        </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: 36,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(27, 25, 46, 0.8)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fc0c84',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MatchmakingScreen;
