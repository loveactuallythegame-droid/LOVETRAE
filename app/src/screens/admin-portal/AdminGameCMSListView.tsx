
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const AdminGameCMSListView = () => {
  const [games, setGames] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, 'game_library'));
      const gamesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesData);
    };
    fetchGames();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AdminGameEditor', { game: item })}>
        <View style={styles.gameItem}>
            <Text style={styles.gameTitle}>{item.title}</Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Game CMS</Text>
      <FlatList
        data={games}
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
    gameItem: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        marginBottom: 15,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SweetPink-Regular',
        color: '#000',
    },
});

export default AdminGameCMSListView;
