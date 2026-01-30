
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; // Generic Header

const LegacyMilestone = ({ title, status, active, last }: { title: string, status: string, active?: boolean, last?: boolean }) => (
    <View style={styles.milestone}>
        <View style={styles.milestoneIconContainer}>
            <Text style={styles.milestoneIcon}>{active ? 'play_circle' : (status === 'Completed' ? 'check_circle' : 'lock')}</Text>
            {!last && <View style={[styles.milestoneConnector, active && {backgroundColor: '#ff0055'}]} />}
        </View>
        <View style={styles.milestoneDetails}>
            <Text style={[styles.milestoneTitle, !active && status !== 'Completed' && {color: 'rgba(255,255,255,0.4)'}]}>{title}</Text>
            <Text style={[styles.milestoneStatus, active && {color: '#ff0055'}]}>{status}</Text>
        </View>
    </View>
)

const AmazingRaceLegacyDashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#120a08', '#221410']} style={styles.background} />
      <Header title="Amazing Race: Legacy Dash" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Overall Team Progress</Text>
                <Text style={styles.progressPercentage}>65%</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <LinearGradient 
                    colors={['#f45925', '#f4a225', '#f4da25', '#25f48e', '#25baf4', '#a225f4']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[styles.progressBar, {width: '65%'}]}/>
            </View>
            <Text style={styles.milestoneCounter}>6/9 Milestones Completed</Text>
        </View>

        <View style={styles.mainGrid}>
            <View style={styles.milestoneList}>
                 <LegacyMilestone title="Foundation: De-escalation" status="Completed - Day 4" />
                 <LegacyMilestone title="Trust Rebuild: Transparency" status='Active Milestone: "The Shared Calendar Challenge"' active />
                 <LegacyMilestone title="Communication Hub: New Rules" status="Unlocks at 75%" />
                 <LegacyMilestone title="Future Vision: Legacy Planning" status="Final Stretch" last />
            </View>
             {/* Map section would be a more complex component */}
            <View style={styles.mapContainer}>
                <Text style={styles.mapPlaceholderText}>Race Map Area</Text>
            </View>
        </View>

        <View style={styles.moderatorCard}>
             <Text style={styles.moderatorTitle}>Race Moderator</Text>
             <Text style={styles.moderatorName}>Dr. Marcie Liss</Text>
            <Text style={styles.moderatorQuote}>"You're gaining speed on the Trust Rebuild! Keep pushing together."</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollViewContent: { padding: 20 },
    progressCard: {
        backgroundColor: 'rgba(18, 10, 8, 0.6)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
    progressTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF' },
    progressPercentage: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 24, color: '#FFF', fontStyle: 'italic' },
    progressBarContainer: { height: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 8 },
    milestoneCounter: { fontFamily: 'SweetPink-Regular', color: '#ff0055', marginTop: 10 },
    mainGrid: { flexDirection: 'row', gap: 20 },
    milestoneList: { flex: 1, backgroundColor: 'rgba(18, 10, 8, 0.6)', borderRadius: 16, padding: 20 },
    milestone: { flexDirection: 'row', marginBottom: 15 },
    milestoneIconContainer: { alignItems: 'center', marginRight: 15 },
    milestoneIcon: { fontFamily: 'Material Icons', fontSize: 24, color: '#ff0055' },
    milestoneConnector: { flex: 1, width: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed' },
    milestoneDetails: { flex: 1 },
    milestoneTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 16, color: '#FFF' },
    milestoneStatus: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)' },
    mapContainer: { flex: 2, backgroundColor: 'rgba(18, 10, 8, 0.6)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    mapPlaceholderText: { fontFamily: 'BarbieDream-Regular', color: 'rgba(255,255,255,0.3)', fontSize: 22 },
    moderatorCard: { backgroundColor: 'rgba(18, 10, 8, 0.6)', borderRadius: 16, padding: 20, marginTop: 20 },
    moderatorTitle: { fontFamily: 'SweetPink-Regular', textTransform: 'uppercase', color: '#ff0055', fontSize: 12, marginBottom: 5 },
    moderatorName: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 10 },
    moderatorQuote: { fontFamily: 'SweetPink-Regular', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }
});

export default AmazingRaceLegacyDashScreen;
