
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

// Data would be fetched from session's aggregate data
const diagnosisData = {
    overallScore: 84,
    frequency: 'Harmonious',
    growthPhase: 'Expansion',
    stabilityRate: '9.2 / 10',
    metrics: {
        trust: 88,
        communication: 72,
        intimacy: 94,
        joy: 81,
        conflict: 60, // Placeholder
        sharedGoals: 75, // Placeholder
    },
    colors: {
        fun: '#fbbf24',
        trust: '#2dd4bf',
        intimacy: '#ff0d74',
        communication: '#14b8a6',
        conflict: '#a855f7',
        sharedGoals: '#ec4899'
    }
};

const StatRing = ({ data }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const segmentAngle = 360 / Object.keys(data.metrics).length;
    let offset = 0;

    return (
        <View style={styles.ringContainer}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                {Object.entries(data.metrics).map(([key, value], index) => {
                    const strokeDasharray = `${(value / 100) * (circumference / 6)} ${circumference}`;
                    const rotation = -90 + (index * segmentAngle);
                    return (
                        <Circle
                            key={key}
                            cx="50" cy="50" r={radius} stroke={data.colors[key.replace(/([A-Z])/g, ' $1').split(' ')[0].toLowerCase()] || '#fff'}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-(circumference / 6) * index}
                            originX="50" originY="50"
                            rotation={rotation}
                        />
                    );
                })}
            </Svg>
            <View style={styles.ringCenterText}>
                <Text style={styles.ringCenterLabel}>Overall</Text>
                <Text style={styles.ringCenterScore}>{data.overallScore}<Text style={styles.percentSign}>%</Text></Text>
            </View>
        </View>
    );
};

const RelationshipDiagnosisCard = () => {

    return (
        <SafeAreaView style={styles.safeArea}>
             <LinearGradient colors={['#230f17', '#120e0a']} style={styles.container}>
                <Text style={styles.headerTitle}>Relationship Synthesis</Text>
                <Text style={styles.headerSubtitle}>Diagnostic Scan #8821-B</Text>

                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <StatRing data={diagnosisData} />
                        <View style={styles.analysisSection}>
                             <Text style={styles.analysisTitle}>Current Frequency: {diagnosisData.frequency}</Text>
                            <Text style={styles.analysisText}>
                                Your connection is resonating at a high level. Focus on <Text style={{color: diagnosisData.colors.communication}}>Communication</Text> could deepen the bond.
                            </Text>
                        </View>
                    </View>
                     <View style={styles.cardFooter}>
                       {/* Footer Icons and Stats Here */}
                    </View>
                </View>
                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>Commence Journey</Text>
                    <MaterialIcons name="arrow-forward" size={22} color="#1c1814" />
                </TouchableOpacity>
             </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#120e0a' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    headerSubtitle: { color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, textAlign: 'center', marginBottom: 24 },
    card: { backgroundColor: '#1c1814', borderRadius: 16, width: '100%', maxWidth: 960, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardContent: { flexDirection: 'row', padding: 24, alignItems: 'center' },
    ringContainer: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
    ringCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    ringCenterLabel: { color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 2, fontSize: 10 },
    ringCenterScore: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    percentSign: { color: '#ff0d74', fontSize: 20 },
    analysisSection: { flex: 1, marginLeft: 24 },
    analysisTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    analysisText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 8 },
    cardFooter: { backgroundColor: 'rgba(0,0,0,0.2)', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 16, flexDirection: 'row', justifyContent: 'space-around' },
    ctaButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbbf24', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, marginTop: 32 },
    ctaButtonText: { color: '#1c1814', fontWeight: 'bold', fontSize: 18, marginRight: 8 },
});

export default RelationshipDiagnosisCard;
