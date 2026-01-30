
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userInfo}>UID: {item.id}</Text>
      <Text style={styles.userInfo}>Trust: {item.trust_thermometer}</Text>
      <Text style={styles.userInfo}>Subscription: {item.subscription_status || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
      <Text style={styles.title}>User Management</Text>
      <FlatList
        data={users}
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
  userItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    marginBottom: 15,
  },
  userInfo: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Cheese-Regular',
  },
});

export default AdminUserManagement;
