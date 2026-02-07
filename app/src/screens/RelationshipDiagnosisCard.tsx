
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const diagnosisData = {
    overallScore: 84,
    frequency: 'Harmonious',
    metrics: {
        trust: 88,
        communication: 72,
        intimacy: 94,
        joy: 81,
        conflict: 60,
        sharedGoals: 75,
    },
    colors: {
        fun: '#FFD700',
        trust: '#00FFFF',
        intimacy: '#FF4081',
        communication: '#34d399',
        conflict: '#E040FB',
        sharedGoals: '#FF9100'
    }
};

const StatRing = ({ data }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const segmentAngle = 360 / Object.keys(data.metrics).length;

    return (
        <View style={styles.ringContainer}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r={radius} stroke="rgba(0,0,0,0.3)" strokeWidth="8" fill="transparent" />
                {Object.entries(data.metrics).map(([key, value], index) => {
                    const strokeDasharray = `${(value / 100) * (circumference / 6)} ${circumference}`;
                    const rotation = -90 + (index * segmentAngle);
                    return (
                        <Circle
                            key={key}
                            cx="50" cy="50" r={radius} stroke={data.colors[key.toLowerCase()] || '#fff'}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-(circumference / 6) * index}
                            originX="50" originY="50"
                            rotation={rotation}
                            strokeLinecap="round"
                        />
                    );
                })}
            </Svg>
            <View style={styles.ringCenterText}>
                <Text style={styles.ringCenterLabel}>OVERALL</Text>
                <Text style={styles.ringCenterScore}>{data.overallScore}<Text style={styles.percentSign}>%</Text></Text>
            </View>
        </View>
    );
};

const RelationshipDiagnosisCard = () => {

    return (
        <SafeAreaView style={styles.safeArea}>
             <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <Text style={styles.headerTitle}>RELATIONSHIP SYNTHESIS</Text>
                <Text style={styles.headerSubtitle}>DIAGNOSTIC SCAN #8821-B</Text>

                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <StatRing data={diagnosisData} />
                        <View style={styles.analysisSection}>
                             <Text style={styles.analysisTitle}>CURRENT FREQUENCY: {diagnosisData.frequency.toUpperCase()}</Text>
                            <Text style={styles.analysisText}>
                                Your connection is resonating at a high level. Focus on <Text style={{color: diagnosisData.colors.communication}}>COMMUNICATION</Text> could deepen the bond.
                            </Text>
                        </View>
                    </View>
                     <View style={styles.cardFooter}>
                       <Text style={styles.footerText}>JOURNEY BEGINS</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>COMMENCE JOURNEY</Text>
                    <Text style={{fontSize: 22}}>🚀</Text>
                </TouchableOpacity>
             </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, textAlign: 'center', marginBottom: 24, fontWeight: 'bold' },
    card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 960, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    cardContent: { flexDirection: 'row', padding: 24, alignItems: 'center' },
    ringContainer: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
    ringCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    ringCenterLabel: { color: '#D1C4E9', textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, fontWeight: 'bold' },
    ringCenterScore: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    percentSign: { color: '#FF4081', fontSize: 20 },
    analysisSection: { flex: 1, marginLeft: 24 },
    analysisTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' },
    analysisText: { color: '#D1C4E9', fontSize: 16, marginTop: 8 },
    cardFooter: { backgroundColor: 'rgba(0,0,0,0.3)', borderTopWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', padding: 16, flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
    ctaButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD700', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20, marginTop: 32 },
    ctaButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18, marginRight: 8, textTransform: 'uppercase' },
});

export default RelationshipDiagnosisCard;
