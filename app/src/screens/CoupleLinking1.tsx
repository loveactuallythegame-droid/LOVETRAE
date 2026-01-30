
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// A library like react-native-svg would be needed for the line charts

const TrustThermometer = () => {
    const trustLevel = 80;

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#120810', '#2a1120']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.headerTitle}>Trust Thermometer</Text>
                    <Text style={styles.headerSubtitle}>Visualizing your connection's foundation.</Text>

                    <View style={styles.mainContent}>
                        {/* Thermometer Display */}
                        <View style={styles.thermometerContainer}>
                            <View style={styles.thermometerGlass}>
                                <LinearGradient colors={['#00f2fe', '#4facfe', '#f093fb', '#ee2b8c']} style={[styles.thermometerFill, { height: `${trustLevel}%` }]} />
                            </View>
                            <View style={styles.thermometerBase}><MaterialIcons name="favorite" size={24} color="#ee2b8c" /></View>
                        </View>

                        {/* Info Cards */}
                        <View style={styles.infoContainer}>
                             <View style={styles.levelCard}>
                                <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
                                <Text style={styles.levelValue}>{trustLevel}%</Text>
                                <Text style={styles.levelChange}>+5% from last week</Text>
                            </View>
                             <View style={styles.trendCard}>
                                <Text style={styles.trendTitle}>Synchronization</Text>
                                <Text style={styles.trendBody}>The gap in perception has narrowed by 12% this week.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.questCard}>
                         <MaterialIcons name="explore" size={24} color="#ee2b8c" />
                        <View style={{flex: 1}}>
                            <Text style={styles.questTitle}>Recommended: The Deep Dive</Text>
                            <Text style={styles.questSubtitle}>A vulnerability exercise to reach 85% trust.</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#120810' },
    container: { flex: 1 },
    scrollView: { padding: 24 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { color: '#c992ad', fontSize: 16, marginBottom: 32 },
    mainContent: { flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'space-around', marginBottom: 32 },
    thermometerContainer: { alignItems: 'center', width: 80 },
    thermometerGlass: { width: 50, height: 250, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 25, justifyContent: 'flex-end', overflow: 'hidden' },
    thermometerFill: { width: '100%' },
    thermometerBase: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1c0d15', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginTop: -10 },
    infoContainer: { flex: 1, gap: 16 },
    levelCard: { backgroundColor: 'rgba(28, 13, 21, 0.85)', padding: 16, borderRadius: 16, alignItems: 'center' },
    levelLabel: { color: '#00f2fe', textTransform: 'uppercase', fontSize: 12 },
    levelValue: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    levelChange: { color: '#00f2fe', fontSize: 12 },
    trendCard: { backgroundColor: 'rgba(28, 13, 21, 0.85)', padding: 16, borderRadius: 16 },
    trendTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
    trendBody: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    questCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(238, 43, 140, 0.1)', borderWidth: 1, borderColor: 'rgba(238, 43, 140, 0.2)', padding: 16, borderRadius: 16 },
    questTitle: { color: '#fff', fontWeight: 'bold' },
    questSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
});

export default TrustThermometer;
