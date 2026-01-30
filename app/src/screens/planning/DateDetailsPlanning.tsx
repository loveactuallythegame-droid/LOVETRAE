
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PlanItem = ({ text, completed, urgent }: { text: string, completed?: boolean, urgent?: boolean }) => (
    <View style={styles.planItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={[styles.checkbox, completed && styles.completedCheckbox]}>
                {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planText}>{text}</Text>
        </View>
        {urgent && <Text style={styles.urgentTag}>Urgent</Text>}
    </View>
);

const VibeTag = ({ text, color }: { text: string, color: string }) => (
    <View style={[styles.vibeTag, { backgroundColor: `${color}30`, borderColor: `${color}50` }]}>
        <Text style={[styles.vibeTagText, { color }]}>{text}</Text>
    </View>
);


const DateDetailsPlanningScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0a1412', '#230f19']}
                style={styles.background}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Date Details</Text>
                    <Text style={styles.headerSubtitle}>Activity: Starlit Dinner & Deep Dive</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Sidebar */}
                    <View style={styles.sidebar}>
                        <View style={styles.glassPanel}>
                            <Text style={styles.sidebarTitle}>Planning Menu</Text>
                            <TouchableOpacity style={[styles.sidebarLink, styles.activeLink]}>
                                <Text style={styles.sidebarLinkText}>Plan Logistics</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarLink}>
                                <Text style={styles.sidebarLinkText}>Mood Board</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarLink}>
                                <Text style={styles.sidebarLinkText}>Preparation</Text>
                            </TouchableOpacity>
                             <TouchableOpacity style={styles.sidebarLink}>
                                <Text style={styles.sidebarLinkText}>Memories</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        {/* Logistics */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>The Plan (Logistics)</Text>
                            <View style={styles.logisticsGrid}>
                                <View style={[styles.glassPanel, styles.logisticsCard, { borderLeftColor: '#facc15'}]}>
                                    <Text style={styles.logisticsTitle}>Time & Duration</Text>
                                    <Text style={styles.logisticsText}>7:00 PM • 3 Hours</Text>
                                </View>
                                <View style={[styles.glassPanel, styles.logisticsCard, { borderLeftColor: '#f97316'}]}>
                                    <Text style={styles.logisticsTitle}>Location</Text>
                                    <Text style={styles.logisticsText}>Celestial Rooftop Lounge</Text>
                                </View>
                                <View style={[styles.glassPanel, styles.logisticsCard, { borderLeftColor: '#a855f7'}]}>
                                    <Text style={styles.logisticsTitle}>Dress Code</Text>
                                    <Text style={styles.logisticsText}>Smart Casual / Cosmic Chic</Text>
                                </View>
                            </View>
                        </View>

                        {/* Preparation */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Preparation Tasks</Text>
                            <View style={[styles.glassPanel, { paddingHorizontal: 0 }]}>
                               <PlanItem text="Confirm table reservation for two" completed />
                               <PlanItem text="Download 'Deep Dive' question pack" completed />
                               <PlanItem text="Order surprise floral arrangement" urgent />
                               <PlanItem text="Charge Polaroid camera & check film" />
                            </View>
                        </View>

                        {/* Vibe & Notes */}
                        <View style={styles.grid}>
                             <View style={styles.section}>
                                <Text style={styles.sectionTitle}>The Vibe</Text>
                                <View style={[styles.glassPanel, styles.vibeContainer]}>
                                    <VibeTag text="Intimate" color="#ec4899" />
                                    <VibeTag text="Conversational" color="#a855f7" />
                                    <VibeTag text="Mystical" color="#3b82f6" />
                                </View>
                            </View>
                             <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Special Touches</Text>
                                <View style={styles.glassPanel}>
                                    <Text style={styles.notesText}>"Remember to mention the dream we talked about last Tuesday..."</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { fontSize: 40, fontWeight: '900', color: '#FFF', textAlign: 'center' },
    headerSubtitle: { fontSize: 18, color: '#fc0c84', fontWeight: '500', marginTop: 4 },
    mainLayout: { flexDirection: 'row', gap: 16 },
    sidebar: { width: 200 },
    mainContent: { flex: 1 },
    glassPanel: { backgroundColor: 'rgba(22, 39, 36, 0.7)', borderColor: 'rgba(59, 84, 79, 0.5)', borderWidth: 1, borderRadius: 16, padding: 16 },
    sidebarTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 16 },
    sidebarLink: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 8 },
    activeLink: { backgroundColor: 'rgba(252, 12, 132, 0.1)', borderColor: 'rgba(252, 12, 132, 0.2)', borderWidth: 1 },
    sidebarLinkText: { color: '#FFFFFFa0', fontSize: 14, fontWeight: '500' },
    section: { marginBottom: 24 },
    sectionTitle: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12, marginLeft: 8 },
    logisticsGrid: { gap: 12 },
    logisticsCard: { borderLeftWidth: 4, gap: 8 },
    logisticsTitle: { color: '#FFFFFFe0', fontSize: 14, fontWeight: '700' },
    logisticsText: { color: '#FFFFFFa0', fontSize: 14 },
    planItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#FFFFFF30' },
    completedCheckbox: { backgroundColor: '#13ecc8', borderColor: '#13ecc8' },
    checkmark: { color: '#0a1412', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    planText: { color: '#FFFFFFd0', fontWeight: '500' },
    urgentTag: { color: '#f472b6', backgroundColor: 'rgba(236, 72, 153, 0.2)', borderColor: 'rgba(236, 72, 153, 0.3)', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 10, fontWeight: 'bold' },
    grid: { flexDirection: 'row', gap: 16 },
    vibeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    vibeTag: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 99 },
    vibeTagText: { fontSize: 14, fontWeight: '500' },
    notesText: { color: '#FFFFFFa0', fontStyle: 'italic', lineHeight: 20 },
});

export default DateDetailsPlanningScreen;
