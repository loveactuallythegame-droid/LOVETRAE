
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

const AdminAnalyticsDashboard = () => {
  const [dailyActiveUsers, setDailyActiveUsers] = useState(0);
  const [retention, setRetention] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsUnsub = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      let activeToday = 0;
      snapshot.forEach(doc => {
        const sessionDate = doc.data().timestamp.toDate();
        if (sessionDate >= today) {
          activeToday++;
        }
      });
      setDailyActiveUsers(activeToday);
      setTotalSessions(snapshot.size);
    });

    const retentionUnsub = onSnapshot(collection(db, 'analytics'), (snapshot) => {
        const retentionData = snapshot.docs.find(doc => doc.id === 'retention_d30');
        if (retentionData) {
            setRetention(retentionData.data().value);
        }
    });

    return () => {
      sessionsUnsub();
      retentionUnsub();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Dashboard</Text>
      <Text style={styles.subheader}>Real-time performance overview of the cosmic nebula ecosystem</Text>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Daily Active Users</Text>
          <Text style={styles.kpiValue}>{dailyActiveUsers}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Retention (D30)</Text>
          <Text style={styles.kpiValue}>{retention}%</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Sessions</Text>
          <Text style={styles.kpiValue}>{totalSessions}</Text>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1414',
    padding: 24,
  },
  header: {
    fontFamily: 'BarbieDream-Regular',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheader: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginBottom: 24,
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  kpiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  kpiLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default AdminAnalyticsDashboard;
