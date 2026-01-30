
import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const achievements = [
    { id: '1', title: 'Communication King', description: 'Unlock 10 deep conversations without interruption', unlocked: true, date: '2d ago', icon: 'forum', category: 'Communication' },
    { id: '2', title: 'Conflict Crusher', description: 'Resolve a Tier 3 argument with perfect empathy', unlocked: true, date: '1w ago', icon: 'shield_with_heart', category: 'Conflict' },
    { id: '3', title: 'Zen Master', description: 'Complete a 20-minute guided partner meditation', unlocked: true, date: 'Oct 12', icon: 'spa', category: 'Intimacy' },
    { id: '4', title: 'First Date Redux', description: 'Recreate your very first date in the Metaverse', unlocked: false, progress: 40, icon: 'lock', category: 'Milestones' },
    { id: '5', title: 'Golden Anniversary', description: 'Maintain a 365-day relationship streak', unlocked: false, progress: 12, icon: 'celebration', category: 'Milestones' },
    { id: '6', title: 'World Travelers', description: 'Unlock 5 destination-based quest lines', unlocked: false, progress: 60, icon: 'explore', category: 'Milestones' },
     { id: '7', title: 'True Empath', description: 'Identify 5 unstated partner emotions correctly', unlocked: true, date: 'Yesterday', icon: 'volunteer_activism', category: 'Communication' },
    { id: '8', title: 'Soul Resonance', description: 'Reach Level 50 Sync with your partner', unlocked: false, progress: 80, icon: 'loyalty', category: 'Intimacy' },
];

const StatCard = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
)

const AchievementCard = ({ item }: { item: any }) => {
    if (item.unlocked) {
        return (
            <View style={[styles.card, styles.unlockedCard]}>
                <View style={[styles.badgeIconContainer, styles.unlockedBadge]}>
                   <Text style={styles.badgeIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>
        )
    }

    return (
        <View style={[styles.card, styles.lockedCard]}>
            <View style={[styles.badgeIconContainer, styles.lockedBadge]}>
                <Text style={styles.badgeIcon}>{item.icon}</Text>
            </View>
            <Text style={[styles.cardTitle, styles.lockedText]}>{item.title}</Text>
            <Text style={[styles.cardDescription, styles.lockedText, { opacity: 0.4 }]}>{item.description}</Text>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}% COMPLETE</Text>
        </View>
    )
}

const AchievementsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#102222', '#1a2e2e']} style={styles.background} />
      {/* Simplified Header for the context of the app screen */}
      <ScrollView>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Achievements & Badges</Text>
            <Text style={styles.headerSubtitle}>Track your relationship evolution across the cosmos.</Text>
            <View style={styles.headerProgress}>
                <Text style={styles.progressTextLabel}>12 / 40 Relics Collected</Text>
                <View style={styles.headerProgressBarContainer}>
                    <View style={styles.headerProgressBar} />
                </View>
            </View>
        </View>

        <View style={styles.statsGrid}>
            <StatCard icon="workspace_premium" label="Total Points" value="2,450 XP"/>
            <StatCard icon="leaderboard" label="Global Rank" value="Top 15%"/>
            <StatCard icon="bolt" label="Current Streak" value="14 Days"/>
        </View>

        {/* Filters would have state and logic */}
        <View style={styles.filterContainer}>
            <Text style={[styles.filterText, styles.activeFilter]}>All Badges</Text>
            <Text style={styles.filterText}>Communication</Text>
            <Text style={styles.filterText}>Intimacy</Text>
            <Text style={styles.filterText}>Conflict</Text>
        </View>

        <FlatList 
            data={achievements}
            renderItem={({item}) => <AchievementCard item={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-around'}}
            contentContainerStyle={styles.grid}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a2e2e' },
  background: { ...StyleSheet.absoluteFillObject },
  header: {
      padding: 20,
      paddingTop: 40,
      alignItems: 'center',
  },
  headerTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF', textAlign: 'center' },
  headerSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 5 },
  headerProgress: { width: '100%', marginTop: 20 },
  progressTextLabel: { fontFamily: 'HolidayChristmas-Regular', fontSize: 12, color: '#fc0c84', textAlign: 'right', marginBottom: 5 },
  headerProgressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  headerProgressBar: { width: '30%', height: '100%', backgroundColor: '#13ecec', borderRadius: 2, shadowColor: '#13ecec', shadowRadius: 5, shadowOpacity: 1 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 20 },
  statCard: { backgroundColor: 'rgba(26, 46, 46, 0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 5 },
  statIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(252, 12, 132, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  statIcon: { fontFamily: 'Material Icons', fontSize: 24, color: '#fc0c84' },
  statLabel: { fontFamily: 'HolidayChristmas-Regular', color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase' },
  statValue: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 18 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, marginBottom: 20 },
  filterText: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.5)', paddingBottom: 10, fontSize: 14 }, 
  activeFilter: { color: '#fc0c84', borderBottomWidth: 2, borderBottomColor: '#fc0c84', fontWeight: 'bold' },
  grid: { paddingHorizontal: 10 },
  card: { borderRadius: 16, padding: 20, alignItems: 'center', margin: 10, flex: 1, minHeight: 220, justifyContent: 'space-between' },
  unlockedCard: { backgroundColor: '#1a2e2e', borderWidth: 1, borderColor: 'rgba(19, 236, 236, 0.3)', shadowColor: 'rgba(19, 236, 236, 0.3)', shadowRadius: 10 },
  lockedCard: { backgroundColor: 'rgba(26, 46, 46, 0.5)', borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)', opacity: 0.7 },
  badgeIconContainer: { width: 80, height: 80, borderRadius: 40, marginBottom: 15, justifyContent: 'center', alignItems: 'center' },
  unlockedBadge: { backgroundColor: '#1a2e2e', borderWidth: 2, borderColor: '#fc0c84' },
  lockedBadge: { borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  badgeIcon: { fontFamily: 'Material Icons', fontSize: 40, color: '#fc0c84' },
  cardTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF', textAlign: 'center' },
  cardDescription: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 5 },
  cardDate: { fontFamily: 'HolidayChristmas-Regular', fontSize: 10, textTransform: 'uppercase', color: '#fc0c84', backgroundColor: 'rgba(252, 12, 132, 0.1)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, marginTop: 10 },
  lockedText: { color: 'rgba(255,255,255,0.4)' },
  progressBarContainer: { height: 4, width: '80%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 10 },
  progressBar: { height: '100%', backgroundColor: '#A855F7', borderRadius: 2 },
  progressText: { fontFamily: 'HolidayChristmas-Regular', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 5 },
});

export default AchievementsScreen;
