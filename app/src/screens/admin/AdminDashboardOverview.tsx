
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';

const kpiData = [
  { id: '1', title: 'Total Galactic Users', value: '128,402', change: '+5.2% this cycle', color: '#13ecec' },
  { id: '2', title: 'Active SOS Alerts', value: '14', change: '3 critical status', color: '#fa5c38' },
  { id: '3', title: 'Cosmic Subscriptions', value: '+12.5%', change: '$142k New ARR', color: '#a855f7' },
  { id: '4', title: 'Avg. Session Duration', value: '42m 15s', change: '+1.5% retention', color: '#facc15' },
];

const activityData = [
    { id: '1', icon: 'warning', title: 'SOS Triggered: Sector 7G', description: 'Couple #8402 reported high emotional turbulence.', time: '2 MINUTES AGO', color: '#fa5c38' },
    { id: '2', icon: 'workspace_premium', title: 'New Star Subscription', description: "User 'Vega_Lover' upgraded to Cosmic Tier.", time: '12 MINUTES AGO', color: '#fc0c84' },
    { id: '3', icon: 'auto_awesome', title: 'Milestone Reached', description: "Couple 'Orion' completed the 'Nebula Trust' trial.", time: '45 MINUTES AGO', color: '#a855f7' },
    { id: '4', icon: 'person_add', title: 'System Entrance', description: "New couple 'Starlight' initialized connection.", time: '1 HOUR AGO', color: '#fc0c84' },
    { id: '5', icon: 'check_circle', title: 'SOS Resolved', description: 'AI Mediator closed Ticket #2041 successfully.', time: '2 HOURS AGO', color: '#0bda50' },
];

const AdminDashboardOverview = () => {

  const renderKpiItem = ({ item }) => (
    <View style={[styles.kpiCard, { borderTopColor: item.color }]}>
      <Text style={styles.kpiTitle}>{item.title}</Text>
      <Text style={styles.kpiValue}>{item.value}</Text>
      <Text style={[styles.kpiChange, { color: item.change.startsWith('+') ? '#0bda50' : '#fa5c38' }]}>{item.change}</Text>
    </View>
  );

  const renderActivityItem = ({ item }) => (
      <View style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: `${item.color}1A` }]}>
            {/* Using a text placeholder for icon */}
            <Text style={{color: item.color, fontSize: 24}}>{item.icon.charAt(0)}</Text>
        </View>
        <View style={styles.activityDetails}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDescription}>{item.description}</Text>
            <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Cosmic Overview</Text>
        <Text style={styles.headerSubtitle}>Real-time performance tracking for Love Actually system nodes.</Text>
      </View>

      <FlatList
        data={kpiData}
        renderItem={renderKpiItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.kpiRow}
        scrollEnabled={false}
      />

        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>User Engagement Trend</Text>
            <View style={styles.chartPlaceholder}>
                <Text style={{color: '#9db9b9'}}>Chart Placeholder</Text>
            </View>
        </View>

        <View style={styles.activityFeedContainer}>
            <Text style={styles.activityFeedTitle}>Live Activity</Text>
            <FlatList
                data={activityData}
                renderItem={renderActivityItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
            />
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0d1a',
  },
  headerContainer: {
      padding: 24,
  },
  headerTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  headerSubtitle: {
      color: '#9db9b9',
      fontSize: 14,
      marginTop: 4,
  },
  kpiRow: {
      justifyContent: 'space-between',
      paddingHorizontal: 16,
  },
  kpiCard: {
    backgroundColor: '#111818',
    borderWidth: 1,
    borderColor: '#3b5454',
    borderTopWidth: 3,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '48%',
  },
  kpiTitle: {
    color: '#9db9b9',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  kpiChange: {
    fontSize: 12,
    marginTop: 4,
  },
  chartContainer: {
      backgroundColor: '#111818',
      borderWidth: 1,
      borderColor: '#3b5454',
      borderRadius: 16,
      margin: 16,
      padding: 20,
  },
  chartTitle: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
  },
  chartPlaceholder: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#283939',
      borderRadius: 12,
  },
  activityFeedContainer: {
      padding: 16,
  },
  activityFeedTitle: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 16,
  },
  activityItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#1a111a',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#3b5454'
  },
  activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
  },
  activityDetails: {
      flex: 1,
  },
  activityTitle: {
      color: '#ffffff',
      fontWeight: 'bold',
  },
  activityDescription: {
      color: '#9db9b9',
      fontSize: 12,
      marginTop: 2,
  },
  activityTime: {
      color: '#fc0c84',
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 8,
  },
});

export default AdminDashboardOverview;
