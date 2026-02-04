import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; // Generic Header

const LegacyMilestone = ({ title, status, active, last }: { title: string, status: string, active?: boolean, last?: boolean }) => (
    <View style={styles.milestone}>
        <View style={styles.milestoneIconContainer}>
            <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.milestoneIconGradient}
            >
                <Text style={styles.milestoneIcon}>{active ? 'play_circle' : (status === 'Completed' ? 'check_circle' : 'lock')}</Text>
            </LinearGradient>
            {!last && <LinearGradient
                colors={['#ef1b6e', '#c41e77', '#a22ac4', '#9056ef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.milestoneConnector, active && styles.activeConnector]} />}
        </View>
        <View style={styles.milestoneDetails}>
            <Text style={[styles.milestoneTitle, !active && status !== 'Completed' && {color: 'rgba(255,255,255,0.4)'}]}>{title}</Text>
            <Text style={[styles.milestoneStatus, active && {color: '#db147c'}]}>{status}</Text>
        </View>
    </View>
)

const AmazingRaceLegacyDashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#120a08', '#221410']} style={styles.background} />
      
      {/* Dr. Marcie Section */}
      <View style={styles.drMarcieSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>Your legacy dash shows incredible progress! Each milestone represents real growth in your relationship journey.</Text>
        </View>
      </View>
      
      <Header title="Amazing Race: Legacy Dash" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressCard}
        >
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
        </LinearGradient>

        <View style={styles.mainGrid}>
            <LinearGradient
                colors={['#a22ac4', '#9056ef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.milestoneList}
            >
                 <LegacyMilestone title="Foundation: De-escalation" status="Completed - Day 4" />
                 <LegacyMilestone title="Trust Rebuild: Transparency" status='Active Milestone: "The Shared Calendar Challenge"' active />
                 <LegacyMilestone title="Communication Hub: New Rules" status="Unlocks at 75%" />
                 <LegacyMilestone title="Future Vision: Legacy Planning" status="Final Stretch" last />
            </LinearGradient>
             {/* Map section would be a more complex component */}
            <LinearGradient
                colors={['#37cf97', '#b37dec']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mapContainer}
            >
                <Text style={styles.mapPlaceholderText}>Race Map Area</Text>
            </LinearGradient>
        </View>

        <LinearGradient
            colors={['#ff7600', '#ffef1f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.moderatorCard}
        >
             <Text style={styles.moderatorTitle}>Race Moderator</Text>
             <Text style={styles.moderatorName}>Dr. Marcie Liss</Text>
            <Text style={styles.moderatorQuote}>"You're gaining speed on the Trust Rebuild! Keep pushing together."</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    scrollViewContent: { padding: 20 },
    progressCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
    progressTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 18, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressPercentage: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 24, 
        color: '#ffffff', 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    progressBarContainer: { 
        height: 16, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 8, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBar: { height: '100%', borderRadius: 8 },
    milestoneCounter: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    mainGrid: { flexDirection: 'row', gap: 20 },
    milestoneList: { 
        flex: 1, 
        borderRadius: 16, 
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    milestone: { flexDirection: 'row', marginBottom: 15 },
    milestoneIconContainer: { alignItems: 'center', marginRight: 15 },
    milestoneIconGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    milestoneIcon: { 
        fontFamily: 'Material Icons', 
        fontSize: 20, 
        color: '#ffffff' 
    },
    milestoneConnector: { 
        flex: 1, 
        width: 2, 
        borderStyle: 'dashed',
        marginTop: 5,
    },
    activeConnector: { 
        backgroundColor: '#db147c',
    },
    milestoneDetails: { flex: 1 },
    milestoneTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 16, 
        color: '#ffffff',
        marginBottom: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    milestoneStatus: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ffffff',
        opacity: 0.8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    mapContainer: { 
        flex: 2, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    mapPlaceholderText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    moderatorCard: { 
        borderRadius: 16, 
        padding: 20, 
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    moderatorTitle: { 
        fontFamily: 'SweetPink-Regular', 
        textTransform: 'uppercase', 
        color: '#ffffff', 
        fontSize: 12, 
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    moderatorName: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#ffffff', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moderatorQuote: { 
        fontFamily: 'SweetPink-Regular', 
        fontStyle: 'italic', 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 12,
    }
});

export default AmazingRaceLegacyDashScreen;