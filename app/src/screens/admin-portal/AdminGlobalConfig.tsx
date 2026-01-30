
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Slider, TouchableOpacity, Image } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const AdminGlobalConfig = () => {
  const [sassLevel, setSassLevel] = useState(0);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'system_config', 'ai_personality');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSassLevel(docSnap.data().sass_level);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, 'system_config', 'ai_personality');
    try {
      await setDoc(docRef, { sass_level: sassLevel }, { merge: true });
    } catch (error) {
      console.error("Error updating config: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Global Config</Text>
      <Text style={styles.label}>Sass Level: {sassLevel.toFixed(1)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        value={sassLevel}
        onValueChange={setSassLevel}
        minimumTrackTintColor="#FA1F63"
        maximumTrackTintColor="#fff"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C1459',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
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
  },
  label: {
    fontSize: 24,
    fontFamily: 'SweetPink-Regular',
    color: '#fff',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  button: {
    backgroundColor: '#33DEA5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdminGlobalConfig;
