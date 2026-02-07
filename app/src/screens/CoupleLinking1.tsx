
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TrustThermometer = () => {
    const trustLevel = 80;

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.headerTitle}>TRUST THERMOMETER</Text>
                    <Text style={styles.headerSubtitle}>Visualizing your connection's foundation.</Text>

                    <View style={styles.mainContent}>
                        {/* Thermometer Display */}
                        <View style={styles.thermometerContainer}>
                            <View style={styles.thermometerGlass}>
                                <LinearGradient colors={['#FF4081', '#E040FB']} style={[styles.thermometerFill, { height: `${trustLevel}%` }]} />
                            </View>
                            <View style={styles.thermometerBase}><Text>❤️</Text></View>
                        </View>

                        {/* Info Cards */}
                        <View style={styles.infoContainer}>
                             <View style={styles.levelCard}>
                                <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
                                <Text style={styles.levelValue}>{trustLevel}%</Text>
                                <Text style={styles.levelChange}>+5% from last week</Text>
                            </View>
                             <View style={styles.trendCard}>
                                <Text style={styles.trendTitle}>SYNCHRONIZATION</Text>
                                <Text style={styles.trendBody}>The gap in perception has narrowed by 12% this week.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.questCard}>
                         <Text style={{fontSize: 24}}>🚀</Text>
                        <View style={{flex: 1}}>
                            <Text style={styles.questTitle}>RECOMMENDED: THE DEEP DIVE</Text>
                            <Text style={styles.questSubtitle}>A vulnerability exercise to reach 85% trust.</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollView: { padding: 24 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
    headerSubtitle: { color: '#D1C4E9', fontSize: 16, marginBottom: 32, textAlign: 'center' },
    mainContent: { flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'space-around', marginBottom: 32 },
    thermometerContainer: { alignItems: 'center', width: 80 },
    thermometerGlass: { width: 50, height: 250, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 2, borderColor: 'rgba(255, 64, 129, 0.5)', borderRadius: 25, justifyContent: 'flex-end', overflow: 'hidden' },
    thermometerFill: { width: '100%' },
    thermometerBase: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 2, borderColor: 'rgba(255, 64, 129, 0.5)', justifyContent: 'center', alignItems: 'center', marginTop: -10 },
    infoContainer: { flex: 1, gap: 16 },
    levelCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    levelLabel: { color: '#FF4081', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' },
    levelValue: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    levelChange: { color: '#FF4081', fontSize: 12, fontWeight: 'bold' },
    trendCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    trendTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    trendBody: { color: '#D1C4E9', fontSize: 12 },
    questCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255, 64, 129, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.2)', padding: 16, borderRadius: 20 },
    questTitle: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    questSubtitle: { color: '#D1C4E9', fontSize: 12, marginTop: 4 },
});

export default TrustThermometer;
