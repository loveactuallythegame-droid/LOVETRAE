
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const user = {
    name: 'ALEX RIVERA',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtyoVbyt5ofdhPIRZiC2i8t-16kzID9Ttah4b-aAvPuT4tBvM7P-2InkGls2gyh3VTlxZfHGxp_0XLUgkdxGpqbaJa7Vc_nETGZk6vutPRZ2gG_nUFKd32doZoROO2BkDZ_2D1u3r15-PAmYGduurtUJI_UFiQJt5Gy64hSQgRQsc9y5YjTssMH5RlsJXHgnhqMisgFKuokXXPeZmf31Ynxbv9fxWYPFs9p-6e6upmBAxHG_2PPj6rjlPC32La0Z91P3OOz-C0JiBD',
    quest: 'DEEPENING CONNECTION',
    badges: [
        { icon: '💖', text: 'WORDS OF AFFIRMATION', color: '#FF4081' },
        { icon: '🛡️', text: 'SECURE ATTACHMENT', color: '#00FFFF' },
        { icon: '🏆', text: 'VULNERABILITY VETERAN', color: '#E040FB' }
    ]
};

const stats = [
    { label: 'GAMES PLAYED', value: '128', trend: '+12%' },
    { label: 'DAILY STREAK', value: '15 DAYS', trend: 'NEW RECORD' },
    { label: 'MILESTONES', value: '24', trend: 'GOLD TIER' },
];

const Badge = ({ badge }) => (
    <View style={[styles.badge, { backgroundColor: `${badge.color}20`, borderColor: `${badge.color}50` }]}>
        <Text>{badge.icon}</Text>
        <Text style={styles.badgeText}>{badge.text}</Text>
    </View>
);

const StatBox = ({ stat }) => (
    <View style={styles.statBox}>
        <Text style={styles.statLabel}>{stat.label}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTrend}>{stat.trend}</Text>
    </View>
);


const UserProfileScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.quest}>{user.quest}</Text>
                        <View style={styles.badgeContainer}>
                            {user.badges.map((badge, i) => <Badge key={i} badge={badge} />)}
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        {stats.map((stat, i) => <StatBox key={i} stat={stat} />)}
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.sectionTitle}>JOURNEY SUMMARY</Text>
                        <Text style={styles.summaryText}>
                            Alex and Sarah have been playing since February 2024. Together, they have unlocked over 40 deep-conversation cards and completed 5 adventure quests. Their current focus is on "Deepening Connection" through daily gratitude exercises.
                        </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={{fontSize: 20}}>✏️</Text>
                        <Text style={styles.editButtonText}>EDIT PROFILE</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    profileHeader: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FF4081', marginBottom: 12 },
    name: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    quest: { color: '#FF4081', fontWeight: 'bold', marginVertical: 4, textTransform: 'uppercase' },
    badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, margin: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 6, textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 8 },
    statBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, alignItems: 'center', flex: 1, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    statLabel: { color: '#D1C4E9', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
    statTrend: { color: '#34d399', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    summaryCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    summaryText: { color: '#D1C4E9', lineHeight: 22 },
    editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF4081', padding: 16, borderRadius: 20 },
    editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8, textTransform: 'uppercase' }
});

export default UserProfileScreen;
