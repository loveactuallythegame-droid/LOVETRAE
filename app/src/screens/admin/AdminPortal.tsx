import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../state/store';

// Basic admin portal stub
export default function AdminPortal({ navigation }: any) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const theme = useAppStore(s => s.theme);

    useEffect(() => {
        checkAdmin();
    }, []);

    async function checkAdmin() {
        const { data } = await supabase.auth.getSession();
        // In real app, check a specific 'admin' role or claim
        // For now, allow anyone for dev/demo purposes if they know the route
        const user = data.session?.user;
        if (user?.email?.includes('admin') || true) {
            setIsAdmin(true);
        }
        setLoading(false);
    }

    if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
    if (!isAdmin) return <View style={styles.center}><Text variant="header">Access Denied</Text></View>;

    return (
        <View style={styles.root}>
            <LinearGradient colors={['#1a0a1f', '#000']} style={StyleSheet.absoluteFill} />
            <View style={styles.header}>
                <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Exit</Text></SquishyButton>
                <Text variant="header">God Mode</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <GlassCard style={styles.section}>
                    <Text variant="header" style={{ marginBottom: 12 }}>System Status</Text>
                    <View style={styles.row}>
                        <Text variant="body">Maintenance Mode</Text>
                        <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} trackColor={{ false: '#444', true: '#FA1F63' }} />
                    </View>
                    <View style={styles.row}>
                        <Text variant="body">Active Users</Text>
                        <Text variant="keyword">1,337</Text>
                    </View>
                    <View style={styles.row}>
                        <Text variant="body">Active Fights</Text>
                        <Text variant="keyword" style={{ color: '#FA1F63' }}>42</Text>
                    </View>
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text variant="header" style={{ marginBottom: 12 }}>Quick Actions</Text>
                    <View style={styles.grid}>
                        <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Sent', 'Push notif sent')}>
                            <Text variant="body">Push Blast</Text>
                        </SquishyButton>
                        <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Cleared', 'Cache cleared')}>
                            <Text variant="body">Clear Cache</Text>
                        </SquishyButton>
                        <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Reset', 'Leaderboard reset')}>
                            <Text variant="body">Reset Ranks</Text>
                        </SquishyButton>
                        <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Exported', 'DB Dumped')}>
                            <Text variant="body">Dump DB</Text>
                        </SquishyButton>
                    </View>
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text variant="header" style={{ marginBottom: 12 }}>Recent Flags</Text>
                    <View style={styles.flag}>
                        <Text variant="keyword" style={{ color: 'yellow' }}>WARN</Text>
                        <Text variant="body">High conflict detected in Session #994</Text>
                    </View>
                    <View style={styles.flag}>
                        <Text variant="keyword" style={{ color: 'red' }}>CRIT</Text>
                        <Text variant="body">API Rate Limit exceeded (OpenAI)</Text>
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60 },
    back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#333', borderRadius: 8 },
    scroll: { padding: 16 },
    section: { marginBottom: 20, padding: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    actionBtn: { width: '48%', backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8, alignItems: 'center' },
    flag: { flexDirection: 'row', gap: 10, marginBottom: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6 }
});
