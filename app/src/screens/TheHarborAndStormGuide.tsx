
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ToolCard = ({ icon, title, description, color }) => (
    <TouchableOpacity style={styles.toolCard}>
        <MaterialIcons name={icon} size={24} color={color} style={{ marginBottom: 8 }} />
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDescription}>{description}</Text>
    </TouchableOpacity>
);

const TheHarborAndStormGuide = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#121015', '#230f16']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Navigate Your Connection</Text>
                        <Text style={styles.headerSubtitle}>Dr. Marcie Liss is here to guide your journey.</Text>
                    </View>

                    <View style={styles.dashboardContainer}>
                        {/* The Storm Section */}
                        <View style={[styles.section, styles.stormSection]}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="bolt" size={32} color="#f97316" />
                                <Text style={styles.sectionTitle}>THE STORM</Text>
                            </View>
                            <ToolCard icon="timer" title="The 5-Minute Pause" description="Instant de-escalation protocol." color="#f97316" />
                            <ToolCard icon="map" title="Conflict Mapping" description="Identify argument patterns." color="#ec4899" />
                        </View>

                        {/* The Harbor Section */}
                        <View style={[styles.section, styles.harborSection]}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="anchor" size={32} color="#2dd4bf" />
                                <Text style={styles.sectionTitle}>THE HARBOR</Text>
                            </View>
                            <ToolCard icon="visibility" title="Eye-Contact Meditation" description="2-minute grounding exercise." color="#2dd4bf" />
                            <ToolCard icon="favorite" title="Appreciation Anchor" description="Log your gratitude." color="#a78bfa" />
                        </View>
                    </View>

                    <View style={styles.signalFlareContainer}>
                        <TouchableOpacity style={styles.signalFlareButton}>
                            <MaterialIcons name="flare" size={40} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.signalFlareText}>SIGNAL FLARE</Text>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121015' },
    container: { flex: 1 },
    scrollContent: { padding: 24 },
    header: { marginBottom: 24 },
    headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 8 },
    dashboardContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
    section: {
        flex: 1,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
    },
    stormSection: {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgba(249, 115, 22, 0.3)',
    },
    harborSection: {
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    toolCard: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    toolTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    toolDescription: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
    signalFlareContainer: { alignItems: 'center', marginVertical: 40 },
    signalFlareButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ff0055',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ff0055',
        shadowRadius: 15,
        shadowOpacity: 0.7,
    },
    signalFlareText: { color: '#ff0055', fontWeight: 'bold', marginTop: 12, textTransform: 'uppercase' },
    
});

export default TheHarborAndStormGuide;
