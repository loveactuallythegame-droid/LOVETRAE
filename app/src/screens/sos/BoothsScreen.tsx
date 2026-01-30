
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';

const DeEscalationLabScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a2e2e', '#0a1111']} style={styles.background} />
      <Header title="The De-Escalation Lab" logo={require('../../../assets/logo/mainlogoone.png')} />
      <View style={styles.mainLayout}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Vials would be implemented here */}
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
            <Text style={styles.mainTitle}>Heated Interaction Analysis</Text>
            <View style={styles.gaugeContainer}>
                <Text style={styles.gaugeLabel}>Current Boiling Point</Text>
                {/* Gauge visualization would be implemented here */}
                <View style={styles.gaugePlaceholder}>
                    <Text style={styles.gaugeText}>Cooling</Text>
                </View>
            </View>

            <View style={styles.detectionLogContainer}>
                <Text style={styles.detectionLogTitle}>Detection Log</Text>
                <View style={styles.logItem}>
                    <Text style={styles.logItemText}>"You always do this..."</Text>
                </View>
                <View style={styles.logItem}>
                    <Text style={styles.logItemText}>"I'm feeling unheard..."</Text>
                </View>
            </View>
        </ScrollView>

        {/* Right Sidebar (Marcie) */}
        <View style={styles.rightSidebar}>
            <GlobalMarcieOverlay quote="Let's lower the boiling point, darling." />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1111' },
  background: { ...StyleSheet.absoluteFillObject },
  mainLayout: { flexDirection: 'row', flex: 1 },
  sidebar: { width: 80, backgroundColor: 'rgba(0,0,0,0.2)', padding: 10 },
  mainContent: { flex: 1, padding: 20 },
  rightSidebar: { width: 250, padding: 20, backgroundColor: 'rgba(22, 37, 37, 0.8)' },
  mainTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#FFF',
    fontSize: 32,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(22, 37, 37, 0.4)', // panel-dark color with opacity
    borderRadius: 16,
  },
  gaugeLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    color: '#FA1F63',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  gaugePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#FA1F63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#FFF',
    fontSize: 36,
  },
  detectionLogContainer: {
    backgroundColor: 'rgba(22, 37, 37, 0.6)',
    borderRadius: 16,
    padding: 20,
  },
  detectionLogTitle: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#33DEA5',
    fontSize: 16,
    marginBottom: 10,
  },
  logItem: { 
      padding: 10, 
      backgroundColor: 'rgba(255,255,255,0.05)', 
      borderRadius: 8, 
      marginBottom: 10 
  },
  logItemText: {
    fontFamily: 'SweetPink-Regular',
    color: '#FFF',
    fontSize: 14,
  },
});

export default DeEscalationLabScreen;
