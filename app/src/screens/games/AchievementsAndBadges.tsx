
import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const achievements = [
    { id: '1', title: 'Communication King', desc: 'Unlock 10 deep conversations', unlocked: true, icon: 'forum', date: '2d ago' },
    { id: '2', title: 'Conflict Crusher', desc: 'Resolve a Tier 3 argument', unlocked: true, icon: 'shield', date: '1w ago' },
    { id: '3', title: 'First Date Redux', desc: 'Recreate your very first date', unlocked: false, icon: 'lock', progress: 0.4 },
    { id: '4', title: 'Golden Anniversary', desc: 'Maintain a 365-day streak', unlocked: false, icon: 'lock', progress: 0.12 },
    { id: '5', title: 'True Empath', desc: 'Identify 5 unstated emotions', unlocked: true, icon: 'volunteer-activism', date: 'Yesterday' },
    { id: '6', title: 'World Travelers', desc: 'Unlock 5 destination quests', unlocked: false, icon: 'lock', progress: 0.6 },
];

const AchievementCard = ({ item }) => {
    if (item.unlocked) {
        return (
            <View style={[styles.card, styles.unlockedCard]}>
                <View style={styles.unlockedIconContainer}>
                    <MaterialIcons name={item.icon} size={32} color="#13ecec" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.card, styles.lockedCard]}>
            <View style={styles.lockedIconContainer}>
                <MaterialIcons name="lock" size={32} color="rgba(255,255,255,0.3)" />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
            </View>
        </View>
    );
};

const AchievementsAndBadgesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#102222', '#1a2e2e']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Achievements</Text>
                    <Text style={styles.headerSubtitle}>12 / 40 Collected</Text>
                </View>

                <FlatList
                    data={achievements}
                    renderItem={({ item }) => <AchievementCard item={item} />}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    ListHeaderComponent={() => (
                         <View style={styles.statsContainer}>
                            <View style={styles.statBox}><Text style={styles.statValue}>2,450</Text><Text style={styles.statLabel}>XP</Text></View>
                            <View style={styles.statBox}><Text style={styles.statValue}>Top 15%</Text><Text style={styles.statLabel}>Rank</Text></View>
                            <View style={styles.statBox}><Text style={styles.statValue}>14</Text><Text style={styles.statLabel}>Streak</Text></View>
                        </View>
                    )}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#102222' },
    container: { flex: 1 },
    header: { padding: 24, alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    headerSubtitle: { color: '#fc0c84', fontSize: 16, marginTop: 4 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginBottom: 24 },
    statBox: { alignItems: 'center', backgroundColor: 'rgba(26, 46, 46, 0.8)', padding: 12, borderRadius: 12, width: 100 },
    statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
    grid: { paddingHorizontal: 12 },
    card: { flex: 1, margin: 8, borderRadius: 16, padding: 16, alignItems: 'center', minHeight: 180 },
    unlockedCard: { backgroundColor: '#1a2e2e', borderWidth: 1, borderColor: '#13ecec', shadowColor: '#13ecec', shadowRadius: 5, elevation: 5 },
    lockedCard: { backgroundColor: 'rgba(26, 46, 46, 0.5)', borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)' },
    unlockedIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#13ecec20', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    lockedIconContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    cardTitle: { color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
    cardDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', marginBottom: 8 },
    cardDate: { color: '#fc0c84', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    progressBar: { height: 6, backgroundColor: 'rgba(0,0,0,0.3)', width: '80%', borderRadius: 3, overflow: 'hidden', marginTop: 'auto' },
    progressFill: { height: '100%', backgroundColor: '#A855F7' },
});

export default AchievementsAndBadgesScreen;
