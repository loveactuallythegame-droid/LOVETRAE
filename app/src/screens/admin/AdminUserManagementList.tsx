
import React from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const users = [
    { id: '#LA-9821-XP', username: '@stardust_lover', status: 'Active Now', tier: 'ETERNAL COSMOS', sos: '2h ago', progress: 0.75 },
    { id: '#LA-4412-ZY', username: '@nebula_jumper', status: 'Idle', tier: 'STAR-CROSSED', sos: '14m ago (URGENT)', progress: 0.25 },
    { id: '#LA-1029-QM', username: '@cosmic_queen', status: 'Active Now', tier: 'TRIAL PATHWAY', sos: 'Never', progress: 0.5 },
    { id: '#LA-2256-PV', username: '@solar_luna', status: 'Active Now', tier: 'ETERNAL COSMOS', sos: '5d ago', progress: 0.9 },
    { id: '#LA-0043-KX', username: '@void_zen', status: 'Offline', tier: 'STAR-CROSSED', sos: '1h ago', progress: 0.66 },
];

const StatCard = ({ title, value, change, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {change && <Text style={[styles.statChange, {color}]}>{change}</Text>}
    </View>
);

const UserRow = ({ item }) => (
    <View style={styles.userRow}>
        <View style={styles.userInfo}>
            <View style={[styles.avatar, {backgroundColor: 'rgba(252, 12, 132, 0.2)'}]}><Text style={{color: '#fc0c84'}}>{item.username.substring(1,3).toUpperCase()}</Text></View>
            <View>
                <Text style={styles.userId}>{item.id}</Text>
                <Text style={styles.username}>{item.username}</Text>
            </View>
        </View>
        <View style={{flex: 1}}><Text style={styles.statusText}>{item.status}</Text></View>
        <View style={{flex: 1}}><Text style={styles.tierText}>{item.tier}</Text></View>
         <TouchableOpacity>
            <LinearGradient colors={['#a855f7', '#ec4899']} style={styles.detailButton}>
                <Text style={styles.detailButtonText}>VIEW</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

const AdminUserManagementList = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#102222', '#1a3a3a']} style={styles.container}>
                <View style={styles.header}>
                    <TextInput style={styles.searchInput} placeholder="Search User ID, Username..." placeholderTextColor="rgba(255,255,255,0.4)" />
                </View>
                
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.statsGrid}>
                        <StatCard title="Total Users" value="24,592" change="+4.2%" color="#fc0c84" />
                        <StatCard title="Active Now" value="1,842" change="Live" color="#13ecec" />
                        <StatCard title="Premium Tier" value="8,210" change="33%" color="#a855f7" />
                        <StatCard title="Pending SOS" value="12" change="Urgent" color="#ef4444" />
                    </View>

                    <View style={styles.tableContainer}>
                         <FlatList
                            data={users}
                            renderItem={({item}) => <UserRow item={item} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#102222' },
    container: { flex: 1 },
    header: { padding: 16, backgroundColor: 'rgba(40, 57, 57, 0.4)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    searchInput: { backgroundColor: 'rgba(40, 57, 57, 0.8)', color: 'white', borderRadius: 12, padding: 12, paddingLeft: 40 },
    scrollView: { padding: 16 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 12 },
    statCard: { flex: 1, backgroundColor: 'rgba(40, 57, 57, 0.6)', padding: 12, borderRadius: 12, borderLeftWidth: 4 },
    statTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase' },
    statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
    statChange: { fontSize: 12, fontWeight: 'bold' },
    tableContainer: { backgroundColor: 'rgba(40, 57, 57, 0.6)', borderRadius: 12 },
    userRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 2 },
    avatar: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    userId: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    username: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
    statusText: { color: '#fff', fontSize: 12 },
    tierText: { color: '#fff', fontSize: 10, flexShrink: 1, backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, overflow: 'hidden', textAlign: 'center' },
    detailButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    detailButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

export default AdminUserManagementList;
