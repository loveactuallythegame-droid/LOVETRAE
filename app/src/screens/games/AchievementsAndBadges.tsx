import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image
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
            <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, styles.unlockedCard]}
            >
                <View style={styles.cardInner}>
                    <View style={styles.unlockedIconContainer}>
                        <MaterialIcons name={item.icon} size={32} color="#ffffff" />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#a22ac4', '#9056ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.lockedCard]}
        >
            <View style={styles.cardInner}>
                <View style={styles.lockedIconContainer}>
                    <MaterialIcons name="lock" size={32} color="rgba(255,255,255,0.7)" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <View style={styles.progressBar}>
                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.progressFill}
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

const AchievementsAndBadgesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#102222', '#1a2e2e']} style={styles.container}>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>Achievements and badges celebrate your growth as a couple! Each milestone represents real progress in your relationship.</Text>
                    </View>
                </View>

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
                            <LinearGradient
                                colors={['#db147c', '#f05d68']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statBox}
                            >
                                <Text style={styles.statValue}>2,450</Text>
                                <Text style={styles.statLabel}>XP</Text>
                            </LinearGradient>
                            <LinearGradient
                                colors={['#37cf97', '#b37dec']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statBox}
                            >
                                <Text style={styles.statValue}>Top 15%</Text>
                                <Text style={styles.statLabel}>Rank</Text>
                            </LinearGradient>
                            <LinearGradient
                                colors={['#ff7600', '#ffef1f']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statBox}
                            >
                                <Text style={styles.statValue}>14</Text>
                                <Text style={styles.statLabel}>Streak</Text>
                            </LinearGradient>
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
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    header: { padding: 24, alignItems: 'center' },
    headerTitle: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff',
        textShadowColor: 'rgba(219, 20, 124, 0.7)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    headerSubtitle: { 
        color: '#db147c', 
        fontSize: 16, 
        marginTop: 4,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginBottom: 24 },
    statBox: { 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 12, 
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
    grid: { paddingHorizontal: 12 },
    card: { 
        flex: 1, 
        margin: 8, 
        borderRadius: 16, 
        padding: 16, 
        alignItems: 'center', 
        minHeight: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    cardInner: {
        flex: 1,
        alignItems: 'center',
    },
    unlockedCard: { 
        borderWidth: 2, 
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    lockedCard: { 
        borderWidth: 2, 
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    unlockedIconContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    lockedIconContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    cardTitle: { 
        color: '#fff', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 4,
        fontSize: 16,
    },
    cardDesc: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 12, 
        textAlign: 'center', 
        marginBottom: 8,
        lineHeight: 16,
    },
    cardDate: { 
        color: '#ffffff', 
        fontSize: 10, 
        fontWeight: 'bold', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    progressBar: { 
        height: 8, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        width: '80%', 
        borderRadius: 4, 
        overflow: 'hidden', 
        marginTop: 'auto',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressFill: { 
        height: '100%', 
    },
});

export default AchievementsAndBadgesScreen;