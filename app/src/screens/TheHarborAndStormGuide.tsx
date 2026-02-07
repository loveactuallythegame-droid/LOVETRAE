
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ToolCard = ({ icon, title, description, color }) => (
    <TouchableOpacity style={styles.toolCard}>
        <Text style={{fontSize: 24, marginBottom: 8}}>{icon}</Text>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDescription}>{description}</Text>
    </TouchableOpacity>
);

const TheHarborAndStormGuide = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>NAVIGATE YOUR CONNECTION</Text>
                        <Text style={styles.headerSubtitle}>DR. MARCIE LISS IS HERE TO GUIDE YOUR JOURNEY.</Text>
                    </View>

                    <View style={styles.dashboardContainer}>
                        {/* The Storm Section */}
                        <View style={[styles.section, styles.stormSection]}>
                            <View style={styles.sectionHeader}>
                                <Text style={{fontSize: 32}}>⚡️</Text>
                                <Text style={styles.sectionTitle}>THE STORM</Text>
                            </View>
                            <ToolCard icon="⏱️" title="THE 5-MINUTE PAUSE" description="Instant de-escalation protocol." />
                            <ToolCard icon="🗺️" title="CONFLICT MAPPING" description="Identify argument patterns." />
                        </View>

                        {/* The Harbor Section */}
                        <View style={[styles.section, styles.harborSection]}>
                            <View style={styles.sectionHeader}>
                                <Text style={{fontSize: 32}}>⚓</Text>
                                <Text style={styles.sectionTitle}>THE HARBOR</Text>
                            </View>
                            <ToolCard icon="👁️" title="EYE-CONTACT MEDITATION" description="2-minute grounding exercise." />
                            <ToolCard icon="💖" title="APPRECIATION ANCHOR" description="Log your gratitude." />
                        </View>
                    </View>

                    <View style={styles.signalFlareContainer}>
                        <TouchableOpacity style={styles.signalFlareButton}>
                            <Text style={{fontSize: 40}}>🚨</Text>
                        </TouchableOpacity>
                        <Text style={styles.signalFlareText}>SIGNAL FLARE</Text>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollContent: { padding: 24 },
    header: { marginBottom: 24 },
    headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', textTransform: 'uppercase' },
    headerSubtitle: { fontSize: 16, color: '#D1C4E9', textAlign: 'center', marginTop: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    dashboardContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
    section: {
        flex: 1,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
    },
    stormSection: {
        backgroundColor: 'rgba(255, 145, 0, 0.2)',
        borderColor: 'rgba(255, 145, 0, 0.5)',
    },
    harborSection: {
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' },
    toolCard: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    toolTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' },
    toolDescription: { fontSize: 12, color: '#D1C4E9', marginTop: 4 },
    signalFlareContainer: { alignItems: 'center', marginVertical: 40 },
    signalFlareButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF4081',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF4081',
        shadowRadius: 15,
        shadowOpacity: 0.7,
    },
    signalFlareText: { color: '#FF4081', fontWeight: 'bold', marginTop: 12, textTransform: 'uppercase' },
});

export default TheHarborAndStormGuide;
