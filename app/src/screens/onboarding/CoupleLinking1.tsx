
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';

const TrustScoreCircle = ({ score, radius, strokeWidth }: { score: number, radius: number, strokeWidth: number }) => {
    const size = radius * 2;
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg height={size} width={size}>
                <Circle
                    stroke="rgba(255, 255, 255, 0.1)"
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke="#00f2fe" // turquoise-accent
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
            </Svg>
            <View style={StyleSheet.absoluteFill}>
                <Text style={styles.trustScoreText}>{score}</Text>
                <Text style={styles.trustScoreLabel}>Trust Score</Text>
            </View>
        </View>
    );
};

const CoupleLinkingTrustThermometerScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2a1120', '#120810']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.pageTitle}>Trust Thermometer</Text>
                <Text style={styles.pageSubtitle}>Visualizing the foundation of your connection.</Text>

                <View style={styles.dashboardGrid}>
                    <View style={styles.mainDisplay}>
                         <TrustScoreCircle score={80} radius={120} strokeWidth={20} />
                    </View>
                    <View style={styles.sidePanels}>
                        <View style={styles.panel}>
                            <Text style={styles.panelTitle}>Historical Data</Text>
                             <Text style={styles.panelText}>Partner A: 82%</Text>
                             <Text style={styles.panelText}>Partner B: 78%</Text>
                        </View>
                        <View style={styles.panel}>
                            <Text style={styles.panelTitle}>Growth Streak</Text>
                             <Text style={styles.panelText}>14 Days</Text>
                        </View>
                        <View style={styles.panel}>
                            <Text style={styles.panelTitle}>Analytics</Text>
                             <Text style={styles.panelText}>Stability Boost</Text>
                             <Text style={styles.panelText}>Synchronization</Text>
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
    scrollContainer: { padding: 20, alignItems: 'center' },
    pageTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF', textAlign: 'center', marginBottom: 5 },
    pageSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#c992ad', textAlign: 'center', marginBottom: 30 },
    dashboardGrid: { flexDirection: 'row', width: '100%' },
    mainDisplay: { flex: 3, justifyContent: 'center', alignItems: 'center', padding: 20 },
    trustScoreText: { fontFamily: 'BarbieDream-Regular', fontSize: 90, color: '#FFF', textAlign: 'center' },
    trustScoreLabel: { fontFamily: 'SweetPink-Regular', fontSize: 18, color: '#c992ad', textAlign: 'center', marginTop: -15 },
    sidePanels: { flex: 2, justifyContent: 'space-around' },
    panel: {
        backgroundColor: 'rgba(28, 13, 21, 0.85)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    panelTitle: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 18, color: '#00f2fe', marginBottom: 10, textTransform: 'uppercase' },
    panelText: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#FFF', marginBottom: 5 },
});

export default CoupleLinkingTrustThermometerScreen;
