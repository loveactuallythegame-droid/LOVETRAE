import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Text, RadialGradientBackground } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaderboardScreen({ navigation }: any) {
    const [period, setPeriod] = useState<'weekly' | 'allTime'>('weekly');
    const [stats, setStats] = useState({
        you: { score: 1247, rank: 1, streak: 3, badges: ['Truth Teller', 'Diplomat'] },
        partner: { score: 1156, rank: 2, streak: 2, badges: ['Listener'] }
    });

    const breakdown = [
        { cat: 'Conflict Resolution', you: 450, partner: 300, color: '#FA1F63' },
        { cat: 'Emotional Connection', you: 300, partner: 450, color: '#00BFFF' },
        { cat: 'Romance & Intimacy', you: 250, partner: 200, color: '#FFD700' },
        { cat: 'Fun & Play', you: 247, partner: 206, color: '#33DEA5' },
    ];

    const recentActivity = [
        { id: 1, text: "You completed 'Truth or Trust'", xp: "+50 XP", time: "2h ago" },
        { id: 2, text: "Partner completed 'Daily Roast'", xp: "+20 XP", time: "4h ago" },
        { id: 3, text: "Couple Goal Reached: 'Date Night'", xp: "+100 XP", time: "1d ago" },
    ];

    return (
        <View style={styles.root}>
            <RadialGradientBackground />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text variant="header" style={styles.title}>Leaderboard</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="filter" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.toggleRow}>
                    <TouchableOpacity onPress={() => setPeriod('weekly')} style={[styles.toggleBtn, period === 'weekly' && styles.activeToggle]}>
                        <Text variant="body" style={period === 'weekly' ? { color: '#000' } : { color: '#fff' }}>Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPeriod('allTime')} style={[styles.toggleBtn, period === 'allTime' && styles.activeToggle]}>
                        <Text variant="body" style={period === 'allTime' ? { color: '#000' } : { color: '#fff' }}>All Time</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>

                    {/* Top Cards */}
                    <View style={styles.topRow}>
                        <GlassCard style={styles.playerCard}>
                            <View style={[styles.avatar, { borderColor: '#33DEA5' }]}><Text variant="header">Y</Text></View>
                            <Text variant="header" style={{ fontSize: 20 }}>You</Text>
                            <Text variant="keyword" style={{ fontSize: 24, color: '#33DEA5' }}>{stats.you.score}</Text>
                            <Text variant="body" style={{ opacity: 0.7 }}>Rank #1</Text>
                            <View style={styles.streakBadge}>
                                <Ionicons name="flame" size={14} color="#FFD700" />
                                <Text variant="body" style={{ fontSize: 12, color: '#FFD700' }}>{stats.you.streak} Day Streak</Text>
                            </View>
                        </GlassCard>

                        <View style={styles.vsContainer}>
                            <Text variant="header" style={{ fontSize: 24, color: 'rgba(255,255,255,0.2)' }}>VS</Text>
                        </View>

                        <GlassCard style={styles.playerCard}>
                            <View style={[styles.avatar, { borderColor: '#FA1F63' }]}><Text variant="header">P</Text></View>
                            <Text variant="header" style={{ fontSize: 20 }}>Partner</Text>
                            <Text variant="keyword" style={{ fontSize: 24, color: '#FA1F63' }}>{stats.partner.score}</Text>
                            <Text variant="body" style={{ opacity: 0.7 }}>Rank #2</Text>
                            <View style={styles.streakBadge}>
                                <Ionicons name="flame" size={14} color="#FFD700" />
                                <Text variant="body" style={{ fontSize: 12, color: '#FFD700' }}>{stats.partner.streak} Day Streak</Text>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Score Breakdown */}
                    <GlassCard style={{ marginTop: 20 }}>
                        <Text variant="header" style={{ marginBottom: 15 }}>Score Breakdown</Text>
                        {breakdown.map((b, i) => (
                            <View key={i} style={styles.breakdownRow}>
                                <View style={{ flex: 1 }}>
                                    <Text variant="body" style={{ fontSize: 12 }}>{b.cat}</Text>
                                    <View style={styles.barBg}>
                                        <View style={[styles.barFill, { width: `${(b.you / (b.you + b.partner)) * 100}%`, backgroundColor: b.color }]} />
                                    </View>
                                </View>
                                <View style={{ paddingLeft: 10, alignItems: 'flex-end' }}>
                                    <Text variant="keyword" style={{ color: b.color }}>{b.you} vs {b.partner}</Text>
                                </View>
                            </View>
                        ))}
                    </GlassCard>

                    {/* Badges */}
                    <GlassCard style={{ marginTop: 20 }}>
                        <Text variant="header" style={{ marginBottom: 10 }}>Your Badges</Text>
                        <View style={styles.badgeRow}>
                            {stats.you.badges.map((badge, i) => (
                                <View key={i} style={styles.badge}>
                                    <Ionicons name="medal" size={24} color="#FFD700" />
                                    <Text variant="body" style={{ fontSize: 10, marginTop: 4 }}>{badge}</Text>
                                </View>
                            ))}
                            <View style={[styles.badge, styles.lockedBadge]}>
                                <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.3)" />
                                <Text variant="body" style={{ fontSize: 10, marginTop: 4, opacity: 0.5 }}>Vulnerability Master</Text>
                            </View>
                        </View>
                    </GlassCard>

                    {/* Recent Activity */}
                    <Text variant="header" style={{ marginTop: 25, marginBottom: 10, paddingHorizontal: 5 }}>Recent Activity</Text>
                    {recentActivity.map((a) => (
                        <GlassCard key={a.id} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text variant="body">{a.text}</Text>
                                <Text variant="body" style={{ fontSize: 10, opacity: 0.5 }}>{a.time}</Text>
                            </View>
                            <Text variant="keyword" style={{ color: '#33DEA5' }}>{a.xp}</Text>
                        </GlassCard>
                    ))}

                    <View style={{ height: 50 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0a0708' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
    title: { fontSize: 20, color: 'white' },
    toggleRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15, gap: 10 },
    toggleBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    activeToggle: { backgroundColor: '#fff' },
    scroll: { paddingHorizontal: 20 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    playerCard: { width: '42%', alignItems: 'center', paddingVertical: 20 },
    vsContainer: { width: '16%', alignItems: 'center' },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 10 },
    streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 215, 0, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 8 },
    breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    barBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    badge: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    lockedBadge: { backgroundColor: 'transparent', borderStyle: 'dashed' }
});
