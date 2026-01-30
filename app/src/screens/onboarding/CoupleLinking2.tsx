
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const CoupleLinkingDashboardScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120810', '#230f19']} style={styles.background} />
            <Header title="Love Actually..." />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainGrid}>
                    <View style={styles.leftColumn}>
                        {/* Trust Thermometer */}
                        <View style={[styles.glassPanel, styles.thermometerPanel]}>
                             <Text style={styles.panelTitle}>Trust Thermometer</Text>
                             <View style={styles.thermometerContainer}>
                                <View style={[styles.thermometerTrack, { height: `${78}%` }]} />
                             </View>
                             <Text style={styles.thermometerValue}>78%</Text>
                             <Text style={styles.thermometerLabel}>Synchronized</Text>
                        </View>
                    </View>
                    <View style={styles.centerColumn}>
                        {/* Active Quest */}
                        <View style={[styles.glassPanel, styles.questPanel]}>
                            <Text style={styles.questPill}>Active Quest</Text>
                            <Text style={styles.questTitle}>Daily Duel</Text>
                            <Text style={styles.questDescription}>"The Mirror Effect: Describe your partner's best quality..."</Text>
                            <TouchableOpacity style={styles.questButton}>
                               <Text style={styles.questButtonText}>Start Duel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rightColumn}>
                         {/* Partner Status */}
                        <View style={[styles.glassPanel, styles.partnerPanel]}>
                            <Text style={styles.panelTitle}>Partner Status</Text>
                             <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPq6iJGKU2LkUZZMIC0JPHcJ6s-UZ4kDaLGQOo3pmKidu5F_tVhWvd59kInkafIj9tYb9mw1DDNoiN7vFrNAFc51zZSZw1TTbg-l174KJmaIGBwGoj53HZ5iNyyDFT1WM_H0GGFxLol9-UROxyiS9gzjO_c34JfhHoeyTd0j_LE_DRUaxmNy0GC2qbLAk1PWHuAN-0dntEW7f3PS_5LHXt12JsU5e-lv1dKy98E4xHTKjEGkF4aIvWmP8tllCxYC08p6iSLIzGp1fj' }} style={styles.avatar} />
                            <Text style={styles.partnerName}>Jamie Smith</Text>
                            <Text style={styles.partnerStatus}>Online & Thinking of You</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#120810' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 10 },
    mainGrid: { flexDirection: 'row' },
    leftColumn: { flex: 1, padding: 5 },
    centerColumn: { flex: 2, padding: 5 },
    rightColumn: { flex: 1, padding: 5 },
    glassPanel: {
        backgroundColor: 'rgba(28, 13, 21, 0.6)',
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 10,
    },
    panelTitle: { fontFamily: 'WonderfulSometimes-Regular', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 10 },
    thermometerPanel: { alignItems: 'center' },
    thermometerContainer: { height: 200, width: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'flex-end' },
    thermometerTrack: { width: '100%', backgroundColor: '#fc0c84', borderRadius: 10 },
    thermometerValue: { fontFamily: 'BarbieDream-Regular', fontSize: 24, color: '#fc0c84', marginTop: 10 },
    thermometerLabel: { fontFamily: 'SweetPink-Regular', fontSize: 10, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' },
    questPanel: { alignItems: 'center', backgroundColor: 'rgba(252, 12, 132, 0.1)' },
    questPill: { backgroundColor: 'rgba(252, 12, 132, 0.2)', color: '#fc0c84', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', textTransform: 'uppercase', marginBottom: 15 },
    questTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 28, color: '#FFF', marginBottom: 5 },
    questDescription: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 20 },
    questButton: { backgroundColor: '#fc0c84', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    questButtonText: { fontFamily: 'BarbieDream-Regular', color: '#1c0d15', fontSize: 16 },
    partnerPanel: { alignItems: 'center' },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#4facfe', marginBottom: 10 },
    partnerName: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF' },
    partnerStatus: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: '#4facfe' },
});

export default CoupleLinkingDashboardScreen;
