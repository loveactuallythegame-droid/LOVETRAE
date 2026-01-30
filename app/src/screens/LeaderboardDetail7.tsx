
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PodiumItem = ({ rank, name, score, color, size }) => (
    <View style={styles.podiumItem}>
        {/* User avatar would go here */}
        <Text style={[styles.podiumRank, { backgroundColor: color, width: size, height: size, borderRadius: size / 2, lineHeight: size }]}>{rank}</Text>
        <Text style={styles.podiumName}>{name}</Text>
        <Text style={[styles.podiumScore, { color }]}>{score} HP</Text>
    </View>
);

const LeaderboardRow = ({ rank, name, level, trend, points }) => (
    <View style={styles.row}>
        <Text style={styles.rowRank}>#{rank}</Text>
        <Text style={styles.rowName}>{name}</Text>
        <Text style={styles.rowLevel}>LVL {level}</Text>
        <Text style={[styles.rowTrend, trend > 0 ? styles.trendUp : styles.trendDown]}>{trend > 0 ? `+${trend}` : trend}</Text>
        <Text style={styles.rowPoints}>{points}</Text>
    </View>
);

const LeaderboardDetail7Screen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#12080d', '#1a1317']} style={styles.background} />
            <ScrollView>
                <Text style={styles.title}>Galactic Couple Rankings</Text>
                <Text style={styles.subtitle}>Celebrating the strongest bonds across the nebula</Text>

                <View style={styles.podiumContainer}>
                    <PodiumItem rank={2} name="Leo & Mia" score="12,450" color="#40E0D0" size={24}/>
                    <PodiumItem rank={1} name="Sarah & Tom" score="15,820" color="#FFD700" size={32}/>
                    <PodiumItem rank={3} name="Chloe & Sam" score="11,200" color="#FF8C00" size={24}/>
                </View>

                <View style={styles.leaderboardContainer}>
                    <Text style={styles.leaderboardTitle}>Rising Couples</Text>
                    <LeaderboardRow rank={4} name="Jade & Marcus" level={42} trend={120} points="10,890" />
                    <LeaderboardRow rank={5} name="Emma & Riley" level={38} trend={85} points="9,420" />
                    <LeaderboardRow rank={6} name="Jordan & Casey" level={40} trend={-12} points="9,110" />
                    <LeaderboardRow rank={7} name="Sophie & Dan" level={35} trend={240} points="8,950" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1317' },
    background: { ...StyleSheet.absoluteFillObject },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 24, marginBottom: 8 },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24 },
    podiumContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 24, marginBottom: 32 },
    podiumItem: { alignItems: 'center', gap: 8 },
    podiumRank: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
    podiumName: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    podiumScore: { fontWeight: 'medium' },
    leaderboardContainer: { marginHorizontal: 16, backgroundColor: 'rgba(26, 19, 23, 0.8)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    leaderboardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    rowRank: { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: 16 },
    rowName: { color: '#FFF', fontWeight: 'medium' },
    rowLevel: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10 },
    rowTrend: { fontSize: 12, fontWeight: 'bold' },
    trendUp: { color: '#22c55e' },
    trendDown: { color: '#ef4444' },
    rowPoints: { color: '#fc0c84', fontWeight: 'bold' },
});

export default LeaderboardDetail7Screen;
