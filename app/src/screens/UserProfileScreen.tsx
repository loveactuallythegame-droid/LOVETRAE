
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const user = {
    name: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtyoVbyt5ofdhPIRZiC2i8t-16kzID9Ttah4b-aAvPuT4tBvM7P-2InkGls2gyh3VTlxZfHGxp_0XLUgkdxGpqbaJa7Vc_nETGZk6vutPRZ2gG_nUFKd32doZoROO2BkDZ_2D1u3r15-PAmYGduurtUJI_UFiQJt5Gy64hSQgRQsc9y5YjTssMH5RlsJXHgnhqMisgFKuokXXPeZmf31Ynxbv9fxWYPFs9p-6e6upmBAxHG_2PPj6rjlPC32La0Z91P3OOz-C0JiBD',
    quest: 'Deepening Connection',
    memberSince: 'February 2024',
    badges: [
        { icon: 'favorite', text: 'Words of Affirmation', color: '#fc0c84' },
        { icon: 'verified-user', text: 'Secure Attachment', color: '#3b82f6' },
        { icon: 'military-tech', text: 'Vulnerability Veteran', color: '#a855f7' }
    ]
};

const stats = [
    { label: 'Games Played', value: '128', trend: '+12%' },
    { label: 'Daily Streak', value: '15 Days', trend: 'New Record' },
    { label: 'Milestones', value: '24', trend: 'Gold Tier' },
];

const Badge = ({ badge }) => (
    <View style={[styles.badge, { backgroundColor: `${badge.color}20`, borderColor: `${badge.color}50` }]}>
        <MaterialIcons name={badge.icon} size={14} color={badge.color} />
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
            <LinearGradient colors={['#101012', '#230f19']} style={styles.container}>
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
                        <Text style={styles.sectionTitle}>Journey Summary</Text>
                        <Text style={styles.summaryText}>
                            Alex and Sarah have been playing since February 2024. Together, they have unlocked over 40 deep-conversation cards and completed 5 adventure quests. Their current focus is on "Deepening Connection" through daily gratitude exercises.
                        </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialIcons name="edit" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#101012' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    profileHeader: { backgroundColor: 'rgba(34,16,28,0.7)', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fc0c84', marginBottom: 12 },
    name: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    quest: { color: '#fc0c84', fontWeight: '600', marginVertical: 4 },
    badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, margin: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 6, textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statBox: { backgroundColor: 'rgba(34,16,28,0.7)', borderRadius: 16, padding: 16, alignItems: 'center', width: '32%' },
    statLabel: { color: '#ffffff80', fontSize: 12 },
    statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
    statTrend: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
    summaryCard: { backgroundColor: 'rgba(34,16,28,0.7)', borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    summaryText: { color: '#ffffffb3', lineHeight: 22 },
    editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fc0c84', padding: 16, borderRadius: 12 },
    editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }
});

export default UserProfileScreen;
