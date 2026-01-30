
import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLogoContainer}>
            <Image source={require('../../../public/logos/logo-symbol.png')} style={styles.headerLogo} />
            <Text style={styles.headerTitleText}>Love Actually...</Text>
        </View>
    </View>
);

const mockLeaderboard = [
    { rank: 1, name: 'You', xp: 1247, avatar: 'Y', highlight: true, streak: 3 },
    { rank: 2, name: 'Partner', xp: 1156, avatar: 'P', highlight: true, streak: 2 },
    { rank: 3, name: 'CoupleName1', xp: 980, avatar: 'C1' },
    { rank: 4, name: 'CoupleName2', xp: 950, avatar: 'C2' },
    { rank: 5, name: 'CoupleName3', xp: 890, avatar: 'C3' },
    { rank: 6, name: 'CoupleName4', xp: 820, avatar: 'C4' },
    { rank: 7, name: 'CoupleName5', xp: 760, avatar: 'C5' },
];

const LeaderboardRow = ({ item }) => (
    <View style={[styles.row, item.highlight && styles.highlightedRow]}>
        <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <View style={[styles.avatar, {borderColor: item.highlight ? '#fc0c84' : 'rgba(255,255,255,0.2)'}]}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
            {item.streak > 0 && 
                <View style={styles.streakBadge}>
                    <MaterialCommunityIcons name="fire" color="#f59e0b" size={14} />
                    <Text style={styles.streakText}>{item.streak} day streak</Text>
                </View>
            }
        </View>
        <View style={styles.xpContainer}>
            <Text style={styles.xpText}>{item.xp} XP</Text>
        </View>
    </View>
);

export default function LeaderboardScreen({ navigation }: any) {
    const [period, setPeriod] = useState('weekly');
    const {width} = useWindowDimensions();

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f19', '#0f0a0c']} style={styles.background} />
            <DashboardHeader />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.pageHeader}>
                    <Text style={styles.mainTitle}>Couple Leaderboard</Text>
                    <Text style={styles.subtitle}>See how your connection stacks up.</Text>
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => setPeriod('weekly')} style={[styles.filterButton, period === 'weekly' && styles.activeFilter]}>
                        <Text style={styles.filterText}>Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPeriod('monthly')} style={[styles.filterButton, period === 'monthly' && styles.activeFilter]}>
                        <Text style={styles.filterText}>Monthly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPeriod('allTime')} style={[styles.filterButton, period === 'allTime' && styles.activeFilter]}>
                        <Text style={styles.filterText}>All-Time</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.leaderboardContainer}>
                    <View style={styles.leaderboardHeader}>
                        <Text style={[styles.headerCol, {flex: 0.5}]}>Rank</Text>
                        <Text style={[styles.headerCol, {flex: 2}]}>Couple</Text>
                        <Text style={[styles.headerCol, {flex: 1, textAlign: 'right'}]}>XP</Text>
                    </View>

                    {mockLeaderboard.map((item) => <LeaderboardRow key={item.rank} item={item} />)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0708' },
  background: { ...StyleSheet.absoluteFillObject },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(34, 16, 25, 0.4)'
  },
  headerLogoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: { width: 24, height: 24, resizeMode: 'contain', tintColor: '#fc0c84' },
  headerTitleText: { fontFamily: 'WorkSans-Bold', textTransform: 'uppercase', fontSize: 18, color: 'white' },
  scrollContent: { padding: 24 },
  pageHeader: { alignItems: 'center', marginBottom: 24 },
  mainTitle: { fontFamily: 'WorkSans-Bold', fontSize: 44, color: 'white', letterSpacing: -1 },
  subtitle: { fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#c992ac' },
  filterContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      gap: 12, 
      marginBottom: 24, 
      padding: 6, 
      borderRadius: 99,
      backgroundColor: 'rgba(255,255,255,0.05)',
      alignSelf: 'center'
  },
  filterButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 99 },
  activeFilter: { backgroundColor: '#fc0c84' },
  filterText: { fontFamily: 'WorkSans-Bold', fontSize: 14, color: 'white' },
  leaderboardContainer: {
      backgroundColor: 'rgba(34, 16, 25, 0.6)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      overflow: 'hidden'
  },
  leaderboardHeader: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerCol: { fontFamily: 'WorkSans-Regular', textTransform: 'uppercase', fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.2 },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  highlightedRow: {
      backgroundColor: 'rgba(252, 12, 132, 0.1)',
      borderLeftWidth: 3, // Highlight bar
      borderLeftColor: '#fc0c84'
  },
  rankContainer: { flex: 0.5, alignItems: 'flex-start' },
  rankText: { fontFamily: 'WorkSans-Bold', fontSize: 18, color: 'white' },
  avatar: {
      width: 40, height: 40, 
      borderRadius: 20, 
      borderWidth: 2, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginRight: 12
  },
  avatarText: { fontFamily: 'WorkSans-Bold', color: 'white' },
  nameContainer: { flex: 2, justifyContent: 'center' },
  nameText: { fontFamily: 'WorkSans-Bold', fontSize: 16, color: 'white' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  streakText: { color: '#f59e0b', fontSize: 12, fontFamily: 'WorkSans-Regular' },
  xpContainer: { flex: 1, alignItems: 'flex-end' },
  xpText: { fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#2dd4bf' }
});
