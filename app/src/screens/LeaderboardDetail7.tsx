
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PodiumItem = ({ rank, name, score, color, size }) => (
    <View style={styles.podiumItem}>
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
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView>
                <Text style={styles.title}>GALACTIC COUPLE RANKINGS</Text>
                <Text style={styles.subtitle}>Celebrating the strongest bonds across the nebula</Text>

                <View style={styles.podiumContainer}>
                    <PodiumItem rank={2} name="LEO & MIA" score="12,450" color="#00FFFF" size={32}/>
                    <PodiumItem rank={1} name="SARAH & TOM" score="15,820" color="#FFD700" size={40}/>
                    <PodiumItem rank={3} name="CHLOE & SAM" score="11,200" color="#FF4081" size={32}/>
                </View>

                <View style={styles.leaderboardContainer}>
                    <Text style={styles.leaderboardTitle}>RISING COUPLES</Text>
                    <LeaderboardRow rank={4} name="JADE & MARCUS" level={42} trend={120} points="10,890" />
                    <LeaderboardRow rank={5} name="EMMA & RILEY" level={38} trend={85} points="9,420" />
                    <LeaderboardRow rank={6} name="JORDAN & CASEY" level={40} trend={-12} points="9,110" />
                    <LeaderboardRow rank={7} name="SOPHIE & DAN" level={35} trend={240} points="8,950" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 24, marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 24 },
    podiumContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 24, marginBottom: 32 },
    podiumItem: { alignItems: 'center', gap: 8 },
    podiumRank: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
    podiumName: { color: '#FFF', fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase' },
    podiumScore: { fontWeight: 'bold' },
    leaderboardContainer: { marginHorizontal: 16, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    leaderboardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', textTransform: 'uppercase' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    rowRank: { color: '#D1C4E9', fontWeight: 'bold', fontSize: 16 },
    rowName: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    rowLevel: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
    rowTrend: { fontSize: 12, fontWeight: 'bold' },
    trendUp: { color: '#34d399' },
    trendDown: { color: '#ef4444' },
    rowPoints: { color: '#FF4081', fontWeight: 'bold' },
});

export default LeaderboardDetail7Screen;
