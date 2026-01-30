
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const CoupleDashboard = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#120810', '#0a0409']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Welcome, Alex</Text>
                    </View>
                    
                    <View style={styles.mainGrid}>
                        {/* Left Column */}
                        <View style={styles.column}>
                            <View style={styles.glassPanel}>
                                <Text style={styles.panelTitle}>Trust Thermometer</Text>
                                <Text style={styles.trustValue}>78%</Text>
                                <View style={styles.thermometer}>
                                    <LinearGradient colors={['#ee2b8c', '#f59e0b', '#00f2fe']} style={[styles.thermometerFill, {height: '78%'}]} />
                                </View>
                            </View>
                        </View>

                        {/* Center Column */}
                        <View style={[styles.column, {flex: 2}]}>
                            <View style={[styles.glassPanel, {backgroundColor: 'rgba(238, 43, 140, 0.1)'}]}>
                                <Text style={styles.panelTitle}>Active Quest: Daily Duel</Text>
                                <Text style={styles.questBody}>"Describe your partner's best quality using only cosmic metaphors."</Text>
                                <TouchableOpacity style={styles.questButton}>
                                    <Text style={styles.questButtonText}>Start Duel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Right Column */}
                        <View style={styles.column}>
                             <View style={styles.glassPanel}>
                                <Text style={styles.panelTitle}>Partner: Jamie</Text>
                                <View style={styles.partnerStatus}>
                                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPq6iJGKU2LkUZZMIC0JPHcJ6s-UZ4kDaLGQOo3pmKidu5F_tVhWvd59kInkafIj9tYb9mw1DDNoiN7vFrNAFc51zZSZw1TTbg-l174KJmaIGBwGoj53HZ5iNyyDFT1WM_H0GGFxLol9-UROxyiS9gzjO_c34JfhHoeyTd0j_LE_DRUaxmNy0GC2qbLAk1PWHuAN-0dntEW7f3PS_5LHXt12JsU5e-lv1dKy98E4xHTKjEGkF4aIvWmP8tllCxYC08p6iSLIzGp1fj' }} style={styles.avatar} />
                                    <Text style={styles.partnerOnline}>Online</Text>
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
    safeArea: { flex: 1, backgroundColor: '#0a0409' },
    container: { flex: 1 },
    scrollView: { padding: 16 },
    header: { paddingBottom: 16 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    mainGrid: { flexDirection: 'row', gap: 12 },
    column: { flex: 1, gap: 12 },
    glassPanel: { backgroundColor: 'rgba(28, 13, 21, 0.6)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 16, minHeight: 150 },
    panelTitle: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
    trustValue: { color: '#fc0c84', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    thermometer: { height: 100, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
    thermometerFill: { width: '100%' },
    questBody: { color: 'rgba(255,255,255,0.8)', fontSize: 14, flex: 1, marginBottom: 16 },
    questButton: { backgroundColor: '#fc0c84', padding: 12, borderRadius: 12, alignItems: 'center' },
    questButtonText: { color: '#fff', fontWeight: 'bold' },
    partnerStatus: { alignItems: 'center', gap: 8 },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#00f2fe' },
    partnerOnline: { color: '#00f2fe', fontWeight: 'bold', marginTop: 4 },
});

export default CoupleDashboard;
