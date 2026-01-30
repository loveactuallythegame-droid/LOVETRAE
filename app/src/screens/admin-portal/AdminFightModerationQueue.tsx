
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const AdminFightModerationQueue = () => {
  const [fights, setFights] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fights'), (snapshot) => {
      const fightsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFights(fightsData);
    });
    return () => unsubscribe();
  }, []);

  const resolveFight = async (fightId) => {
    const fightRef = doc(db, 'fights', fightId);
    try {
      await updateDoc(fightRef, {
        status: 'resolved',
        verdict: 'Dr. Marcie has spoken!'
      });
    } catch (error) {
      console.error("Error resolving fight: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.fightItem}>
      <Text style={styles.fightInfo}>Couple ID: {item.couple_id}</Text>
      <Text style={styles.fightInfo}>Status: {item.status}</Text>
      <TouchableOpacity style={styles.button} onPress={() => resolveFight(item.id)}>
        <Text style={styles.buttonText}>Resolve</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
      <Text style={styles.title}>SOS Fight Queue</Text>
      <FlatList
        data={fights}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
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
  fightItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    marginBottom: 15,
  },
  fightInfo: {
    fontSize: 16,
    fontFamily: 'SweetPink-Regular',
    color: '#000',
  },
  button: {
    backgroundColor: '#33DEA5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminFightModerationQueue;
