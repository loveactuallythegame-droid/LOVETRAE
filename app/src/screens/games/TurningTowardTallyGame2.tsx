
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const timelineEvents = [
    { icon: 'touch-app', color: '#00f2ff', title: 'Physical Bid', subtitle: '2m response time', status: 'Synchronized' },
    { icon: 'chat-bubble', color: '#f90248', title: 'Verbal Bid', subtitle: 'Instant turn-toward', status: '+50pts' },
    { icon: 'volunteer-activism', color: '#32ff00', title: 'Service Bid', subtitle: '15m response time', status: 'Processed' },
    { icon: 'error', color: '#ff007f', title: 'Failed Sync', subtitle: 'Turned away', status: 'Missed bid penalty' },
    { icon: 'hotel-class', color: '#8f00ff', title: 'Quality Time Bid', subtitle: 'Ongoing Session', status: 'Active' },
];

const StatCard = ({ label, value, trend }) => (
    <View style={styles.statCard}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTrend}>{trend}</Text>
    </View>
);

const TimelineItem = ({ event }) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineIconContainer}>
            <MaterialIcons name={event.icon} size={24} color={event.color} />
        </View>
        <View style={styles.timelineTextContainer}>
            <Text style={styles.timelineTitle}>{event.title}</Text>
            <Text style={styles.timelineSubtitle}>{event.subtitle} <Text style={{ color: event.color }}>{event.status}</Text></Text>
        </View>
    </View>
);


const TurningTowardTallyGame2 = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#101322', '#1a1e3a']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerTitle}>Turning Toward Tally</Text>
                    <Text style={styles.headerSubtitle}>Live audit of your connection bids.</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
                        <StatCard label="Days in Sync" value="12 Days" trend="+2%" />
                        <StatCard label="Emotional Currency" value="4,250" trend="+540" />
                        <StatCard label="Response Rate" value="92%" trend="+5%" />
                    </ScrollView>

                    <View style={styles.timelineContainer}>
                        <Text style={styles.sectionHeader}>24-Hour Bid Timeline</Text>
                        {timelineEvents.map((event, index) => <TimelineItem key={index} event={event} />)}
                    </View>

                    <View style={styles.auditorTip}>
                        <MaterialIcons name="lightbulb" size={24} color="#ffbf00" style={{marginRight: 10}}/>
                        <Text style={styles.auditorText}>Decrease screen time during dinner to boost Emotional Currency by <Text style={{color: '#32ff00'}}>+25%</Text>.</Text>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#101322' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center' },
    headerSubtitle: { color: '#929bc9', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    statsRow: { marginBottom: 24 },
    statCard: { backgroundColor: 'rgba(26,30,58,0.7)', borderRadius: 12, padding: 16, marginRight: 12, width: 160 },
    statLabel: { color: '#929bc9', fontSize: 12, textTransform: 'uppercase' },
    statValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 4 },
    statTrend: { color: '#0bda65', fontSize: 12 },
    timelineContainer: { backgroundColor: 'rgba(26,30,58,0.7)', borderRadius: 12, padding: 16, marginBottom: 24 },
    sectionHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    timelineIconContainer: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    timelineTextContainer: { flex: 1 },
    timelineTitle: { color: '#fff', fontWeight: 'bold' },
    timelineSubtitle: { color: '#929bc9' },
    auditorTip: { flexDirection: 'row', backgroundColor: 'rgba(26,30,58,0.7)', borderRadius: 12, padding: 16, alignItems: 'center' },
    auditorText: { color: '#fff', flex: 1, lineHeight: 20 }

});

export default TurningTowardTallyGame2;
