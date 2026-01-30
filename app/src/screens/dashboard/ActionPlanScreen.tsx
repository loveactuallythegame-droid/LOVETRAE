
import { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Switch, Pressable, useWindowDimensions, Image, TouchableOpacity
} from 'react-native';
import { Text } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Assuming a custom header component exists for dashboard screens
const DashboardHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLogoContainer}>
            <Image source={require('../../../public/logos/logo-symbol.png')} style={styles.headerLogo} />
            <Text style={styles.headerTitleText}>Love Actually...</Text>
        </View>
        <View style={styles.headerNav}>
            <TouchableOpacity><Text style={styles.navText}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navText}>History</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navText}>Resources</Text></TouchableOpacity>
            <Image source={require('../../../public/images/avatar-placeholder.png')} style={styles.avatar} />
        </View>
    </View>
);

const CustomToggle = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)} activeOpacity={0.8}>
            <View style={[styles.toggleBase, value && styles.toggleBaseActive]}>
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
            </View>
        </TouchableOpacity>
    )
}

export default function ActionPlanScreen({ navigation, route }: any) {
  const [scheduleReflection, setScheduleReflection] = useState(true);
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // md breakpoint

  const onCommit = () => {
    // Logic to commit to the plan remains the same
    navigation.navigate('DashboardHome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#230f19', '#0f0a0c']} style={styles.background} />
      <DashboardHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
            <View>
                <View style={styles.resolutionFoundContainer}>
                    <MaterialIcons name="auto-awesome" size={14} color="#fc0c84" />
                    <Text style={styles.resolutionFoundText}>Resolution Found</Text>
                </View>
                <Text style={styles.mainTitle}>Your Action Plan</Text>
                <Text style={styles.subtitle}>Concrete steps to honor your decoded connection</Text>
            </View>
            <TouchableOpacity style={styles.redoButton}>
                <MaterialIcons name="refresh" size={18} color="white" />
                <Text style={styles.redoButtonText}>Redo Translation</Text>
            </TouchableOpacity>
        </View>

        <View style={[styles.actionCardsGrid, isMobile && styles.actionCardsGridMobile]}>
          {/* Card 1 */}
          <View style={[styles.actionCard, { borderColor: 'rgba(250, 204, 21, 0.3)' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(250, 204, 21, 0.1)' }]}>
                <MaterialCommunityIcons name="brain" size={32} color="#facc15" />
              </View>
              <Text style={[styles.cardStep, { color: 'rgba(250, 204, 21, 0.4)' }]}>01</Text>
            </View>
            <Text style={styles.cardTitle}>The Approach</Text>
            <Text style={styles.cardDescription}><Text style={{ color: '#facc15' }}>Active Listening:</Text> Shift your mindset to hear their needs without formulating a rebuttal.</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardFooterText, { color: '#facc15' }]}>Mindset Shift</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={[styles.actionCard, { borderColor: 'rgba(45, 212, 191, 0.3)' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}>
                <MaterialIcons name="chat-bubble" size={32} color="#2dd4bf" />
              </View>
              <Text style={[styles.cardStep, { color: 'rgba(45, 212, 191, 0.4)' }]}>02</Text>
            </View>
            <Text style={styles.cardTitle}>The Action</Text>
            <Text style={styles.cardDescription}><Text style={{ color: '#2dd4bf' }}>10-Minute Check-in:</Text> Set aside focused, phone-free time tonight to discuss how you feel.</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardFooterText, { color: '#2dd4bf' }]}>Behavioral Task</Text>
            </View>
          </View>

          {/* Card 3 */}
          <View style={[styles.actionCard, { borderColor: 'rgba(252, 12, 132, 0.3)' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(252, 12, 132, 0.1)' }]}>
                <MaterialIcons name="favorite" size={32} color="#fc0c84" />
              </View>
              <Text style={[styles.cardStep, { color: 'rgba(252, 12, 132, 0.4)' }]}>03</Text>
            </View>
            <Text style={styles.cardTitle}>The Maintenance</Text>
            <Text style={styles.cardDescription}><Text style={{ color: '#fc0c84' }}>Gratitude:</Text> Express one specific thing you appreciate about how they handled this talk.</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardFooterText, { color: '#fc0c84' }]}>Long-term Bond</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionPanelContainer}>
            <View style={[styles.actionPanel, scheduleReflection && {borderColor: 'rgba(20, 184, 166, 0.6)'}]}>
                <View style={styles.actionPanelIcon}>
                    <MaterialIcons name="alarm-on" size={30} color="#14b8a6"/>
                </View>
                <View style={styles.actionPanelText}>
                    <Text style={styles.actionPanelTitle}>Schedule Reflection</Text>
                    <Text style={styles.actionPanelSubtitle}>Would you like a cosmic reminder to revisit this plan in 48 hours?</Text>
                </View>
                <CustomToggle value={scheduleReflection} onValueChange={setScheduleReflection} />
            </View>
        </View>


        <View style={[styles.buttonGroup, isMobile && styles.buttonGroupMobile]}>
          <TouchableOpacity style={styles.dashboardButton} onPress={() => navigation.navigate('DashboardHome')}>
            <Text style={styles.buttonText}>Back to Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commitButton} onPress={onCommit}>
            <MaterialIcons name="verified-user" size={20} color="white" />
            <Text style={styles.buttonText}>Commit to Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0708' },
  background: { ...StyleSheet.absoluteFillObject },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(34, 16, 25, 0.4)'
  },
  headerLogoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
  },
  headerLogo: { width: 24, height: 24, resizeMode: 'contain', tintColor: '#fc0c84' },
  headerTitleText: { fontFamily: 'WorkSans-Bold', textTransform: 'uppercase', fontSize: 18, color: 'white' },
  headerNav: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  navText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'WorkSans-Regular' },
  avatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.5)' },
  scrollContent: { padding: 24 },
  pageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 24
  },
  resolutionFoundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  resolutionFoundText: {
    fontFamily: 'WorkSans-Bold',
    color: '#fc0c84',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  mainTitle: { fontFamily: 'WorkSans-Bold', fontSize: 44, color: 'white', letterSpacing: -1 },
  subtitle: { fontFamily: 'WorkSans-Regular', fontSize: 18, color: '#c992ac' },
  redoButton: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 8, 
      paddingHorizontal: 20, 
      paddingVertical: 12, 
      borderRadius: 12, 
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)' 
    },
  redoButtonText: { color: 'white', fontFamily: 'WorkSans-Bold', fontSize: 14 },
  actionCardsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionCardsGridMobile: { flexDirection: 'column' },
  actionCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 16, 25, 0.6)',
    borderWidth: 1,
    gap: 16
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardStep: { fontFamily: 'WorkSans-Bold', fontSize: 24 },
  cardTitle: { fontFamily: 'WorkSans-Bold', fontSize: 20, color: 'white' },
  cardDescription: { fontFamily: 'WorkSans-Regular', fontSize: 16, color: '#c992ac', lineHeight: 24 },
  cardFooter: { marginTop: 'auto', paddingTop: 16, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardFooterText: { fontFamily: 'WorkSans-Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 },
  actionPanelContainer: { paddingHorizontal: 4, marginBottom: 24 },
  actionPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 24,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(34,16,25,0.8)'
  },
  actionPanelIcon: { 
      padding: 12, 
      borderRadius: 99, 
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(20, 184, 166, 0.2)'
    },
  actionPanelText: { flex: 1 },
  actionPanelTitle: { fontFamily: 'WorkSans-Bold', fontSize: 18, color: 'white', marginBottom: 2 },
  actionPanelSubtitle: { fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#c992ac' },
  toggleBase: { width: 60, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 4 },
  toggleBaseActive: { backgroundColor: '#14b8a6' },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'white' },
  toggleThumbActive: { transform: [{ translateX: 28 }] },
  buttonGroup: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  buttonGroupMobile: { flexDirection: 'column' },
  dashboardButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center'
  },
  commitButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fc0c84',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { fontFamily: 'WorkSans-Bold', color: 'white', fontSize: 16 }
});
