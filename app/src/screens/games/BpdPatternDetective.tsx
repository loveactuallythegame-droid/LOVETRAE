
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const evidenceData = [
    'Fear of Abandonment', 'Sudden Mood Shift', 'Intense Anger', 'Identity Confusion', 'Impulsive Action'
];

const patternCloudsData = [
    { title: 'The Spark', description: 'The initial catalyst that sets the emotional engine in motion.' },
    { title: 'The Vortex', description: 'Where emotions swirl and intensify, gaining uncontrollable momentum.' },
    { title: 'The Mirage', description: 'The distorted reality we perceive during peak emotional distress.' },
];

const BpdPatternDetectiveScreen = () => {
    // This would be a more complex drag-and-drop state in a real app
    const [unclassifiedEvidence, setUnclassifiedEvidence] = useState(evidenceData);
    const [classifiedEvidence, setClassifiedEvidence] = useState<{[key: string]: string[]}>({});

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#11211f', '#1a2e2b']} style={styles.background} />
            <Header title="BPD Pattern Detective" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.workspace}>
                    <Text style={styles.pageTitle}>The BPD Pattern Detective</Text>
                    <Text style={styles.pageSubtitle}>Identify cycles and uncover hidden connections.</Text>

                    <View style={styles.patternCloudsContainer}>
                        {patternCloudsData.map(cloud => (
                            <View key={cloud.title} style={styles.patternCloud}>
                                <Text style={styles.cloudTitle}>{cloud.title}</Text>
                                <Text style={styles.cloudDescription}>{cloud.description}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.evidenceTray}>
                        <Text style={styles.trayTitle}>Unclassified Evidence</Text>
                        <View style={styles.evidenceItems}>
                            {unclassifiedEvidence.map(item => (
                                <TouchableOpacity key={item} style={styles.evidenceCard}>
                                    <Text style={styles.evidenceText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.sidebar}>
                    <View style={styles.caseInfo}>
                        <Text style={styles.caseTitle}>Case #101</Text>
                        <Text style={styles.caseStatus}>Active Investigation</Text>
                    </View>
                     <View style={styles.detectiveInfo}>
                        <Text style={styles.detectiveName}>Dr. Marcie Liss</Text>
                        <Text style={styles.detectiveQuote}>"Let's find the ghost in the machine."</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressTitle}>Case Statistics</Text>
                        <Text style={styles.progressText}>Pattern Matched: 40%</Text>
                        <Text style={styles.progressText}>Evidence Found: 2/9</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#11211f' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flexDirection: 'row', padding: 20 },
    workspace: { flex: 3, marginRight: 20 },
    sidebar: { flex: 1, backgroundColor: '#242d2c', borderRadius: 16, padding: 20, borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 },
    pageTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 28, color: '#FFF', marginBottom: 5 },
    pageSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
    patternCloudsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    patternCloud: { flex: 1, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', borderRadius: 24, padding: 20, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
    cloudTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 10 },
    cloudDescription: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
    evidenceTray: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 20 },
    trayTitle: { fontFamily: 'SweetPink-Regular', color: '#ff005e', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
    evidenceItems: { flexDirection: 'row', flexWrap: 'wrap' },
    evidenceCard: { backgroundColor: '#242d2c', borderRadius: 12, padding: 15, margin: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    evidenceText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 14 },
    caseInfo: { marginBottom: 30, alignItems: 'center' },
    caseTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 22, color: '#FFF' },
    caseStatus: { fontFamily: 'SweetPink-Regular', color: '#ff005e', textTransform: 'uppercase' },
    detectiveInfo: { marginBottom: 30, alignItems: 'center' },
    detectiveName: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF' },
    detectiveQuote: { fontFamily: 'SweetPink-Regular', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
    progressContainer: { marginTop: 20, alignItems: 'center' },
    progressTitle: { fontFamily: 'SweetPink-Regular', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 10 },
    progressText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 16 },
});

export default BpdPatternDetectiveScreen;
