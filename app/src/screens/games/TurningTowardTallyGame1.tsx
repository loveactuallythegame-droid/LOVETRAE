
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const recentBids = [
    {
        icon: 'sms',
        title: '"Text 🌧️ u up?"',
        time: 'Received 11:42 PM',
        latency: '22m 14s',
        status: 'Turned Away'
    },
    {
        icon: 'restaurant',
        title: '"What\'s for dinner? 🍝"',
        time: 'Received 6:15 PM',
        latency: '0m 45s',
        status: 'Turned Toward'
    },
    {
        icon: 'visibility',
        title: '"Look at this weird bird! 🦜"',
        time: 'Received 3:30 PM',
        latency: '1m 12s',
        status: 'Turned Toward'
    },
    {
        icon: 'forum',
        title: '"Did you see the news about..."',
        time: 'Received 1:05 PM',
        latency: '4m 59s',
        status: 'Turned Toward'
    }
];

const BidRow = ({ bid }) => (
    <View style={styles.bidRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.bidIconContainer}>
                <MaterialIcons name={bid.icon} size={24} color="#ff0a64" />
            </View>
            <View>
                <Text style={styles.bidTitle}>{bid.title}</Text>
                <Text style={styles.bidTime}>{bid.time}</Text>
            </View>
        </View>
        <View style={[styles.statusContainer, bid.status === 'Turned Toward' ? styles.statusToward : styles.statusAway]}>
            <Text style={[styles.statusText, bid.status === 'Turned Toward' ? { color: '#34d399' } : { color: '#f87171' }]}>{bid.status.toUpperCase()}</Text>
        </View>
    </View>
);

const TurningTowardTallyGame1 = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0f0a16', '#230f16']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerTitle}>Turning Toward Tally</Text>
                    <Text style={styles.headerSubtitle}>Bid Responsiveness Scorecard</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}><Text style={styles.statLabel}>Daily Win Rate</Text><Text style={styles.statValue}>85%</Text></View>
                        <View style={styles.statBox}><Text style={styles.statLabel}>Avg. Bid Latency</Text><Text style={styles.statValue}>2m 14s</Text></View>
                        <View style={styles.statBox}><Text style={styles.statLabel}>Successful Turns</Text><Text style={styles.statValue}>18/21</Text></View>
                    </View>

                    <View style={styles.bidsTable}>
                        <Text style={styles.tableHeader}>Recent Bid Activity</Text>
                        <View>
                            {recentBids.map((bid, index) => <BidRow key={index} bid={bid} />)}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.buttonText}>Initiate Bid for Connection</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f0a16' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center' },
    headerSubtitle: { color: '#ab9db9', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
    statBox: { backgroundColor: 'rgba(35,15,22,0.6)', borderRadius: 12, padding: 12, alignItems: 'center', width: '32%' },
    statLabel: { color: '#ab9db9', fontSize: 12, marginBottom: 4 },
    statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    bidsTable: { backgroundColor: 'rgba(35,15,22,0.6)', borderRadius: 12, marginBottom: 24 },
    tableHeader: { color: '#fff', fontWeight: 'bold', fontSize: 16, padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    bidRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    bidIconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,10,100,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    bidTitle: { color: '#fff', fontWeight: 'bold' },
    bidTime: { color: '#ab9db9', fontSize: 12 },
    statusContainer: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
    statusToward: { backgroundColor: 'rgba(52,211,153,0.1)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)' },
    statusAway: { backgroundColor: 'rgba(248,113,113,0.1)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)' },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    primaryButton: { backgroundColor: '#ff0a64', padding: 18, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default TurningTowardTallyGame1;
