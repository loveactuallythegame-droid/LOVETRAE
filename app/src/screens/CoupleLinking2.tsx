
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CoupleDashboard = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>WELCOME, ALEX</Text>
                    </View>
                    
                    <View style={styles.mainGrid}>
                        {/* Left Column */}
                        <View style={styles.column}>
                            <View style={styles.card}>
                                <Text style={styles.panelTitle}>TRUST THERMOMETER</Text>
                                <Text style={styles.trustValue}>78%</Text>
                                <View style={styles.thermometer}>
                                    <LinearGradient colors={['#FF4081', '#E040FB']} style={[styles.thermometerFill, {height: '78%'}]} />
                                </View>
                            </View>
                        </View>

                        {/* Center Column */}
                        <View style={[styles.column, {flex: 2}]}>
                            <View style={[styles.card, {backgroundColor: 'rgba(255, 64, 129, 0.2)'}]}>
                                <Text style={styles.panelTitle}>ACTIVE QUEST: DAILY DUEL</Text>
                                <Text style={styles.questBody}>"Describe your partner's best quality using only cosmic metaphors."</Text>
                                <TouchableOpacity style={styles.questButton}>
                                    <Text style={styles.questButtonText}>START DUEL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Right Column */}
                        <View style={styles.column}>
                             <View style={styles.card}>
                                <Text style={styles.panelTitle}>PARTNER: JAMIE</Text>
                                <View style={styles.partnerStatus}>
                                    <Text style={styles.avatar}>😊</Text>
                                    <Text style={styles.partnerOnline}>ONLINE</Text>
                                </View>
                            </View>
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
    scrollView: { padding: 16 },
    header: { paddingBottom: 16, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    mainGrid: { flexDirection: 'row', gap: 12 },
    column: { flex: 1, gap: 12 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', borderRadius: 20, padding: 16, minHeight: 150 },
    panelTitle: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    trustValue: { color: '#FF4081', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    thermometer: { height: 100, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
    thermometerFill: { width: '100%' },
    questBody: { color: '#fff', fontSize: 14, flex: 1, marginBottom: 16 },
    questButton: { backgroundColor: '#FF4081', padding: 12, borderRadius: 12, alignItems: 'center' },
    questButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    partnerStatus: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8 },
    avatar: { fontSize: 50 },
    partnerOnline: { color: '#34d399', fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
});

export default CoupleDashboard;
