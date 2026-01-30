
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

const AdminFightModerationQueue = () => {
  const [activeFights, setActiveFights] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "sos_alerts"), where("status", "==", "active"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fights = [];
      querySnapshot.forEach((doc) => {
        fights.push({ id: doc.id, ...doc.data() });
      });
      setActiveFights(fights);
    });

    return () => unsubscribe();
  }, []);

  const resolveFight = async (id) => {
    try {
      const fightRef = doc(db, "sos_alerts", id);
      await updateDoc(fightRef, {
        status: "resolved",
        resolvedAt: new Date(),
      });
      Alert.alert("Fight Resolved", `SOS session ${id} has been marked as resolved.`);
    } catch (error) {
      Alert.alert("Error", "Could not resolve the fight: " + error.message);
    }
  };

  const renderFightItem = ({ item }) => (
    <View style={styles.fightItem}>
      <View style={styles.fightDetails}>
        <Text style={styles.fightUsers}>{item.coupleId}</Text>
        <Text style={styles.fightTimestamp}>{new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.fightActions}>
        <TouchableOpacity style={styles.resolveButton} onPress={() => resolveFight(item.id)}>
          <Text style={styles.resolveButtonText}>RESOLVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fight Moderation Queue</Text>
      <FlatList
        data={activeFights}
        renderItem={renderFightItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No active fights to moderate.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#230f19',
    padding: 24,
  },
  header: {
    fontFamily: 'BarbieDream-Regular',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  fightItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fightDetails: {
    flex: 1,
  },
  fightUsers: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fightTimestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  fightActions: {},
  resolveButton: {
    backgroundColor: '#13ecec',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resolveButtonText: {
    color: '#230f19',
    fontWeight: 'bold',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 48,
  },
});

export default AdminFightModerationQueue;
