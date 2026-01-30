
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';

// This is a placeholder for the actual line chart component
const LineChart = () => <View style={{ height: 100, backgroundColor: '#333' }} />;

const TrustThermometerScreen = () => {
  // Placeholder for the calculateGameResults function call
  useEffect(() => {
    // calculateGameResults();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2A1120', '#120810']} style={styles.background} />
      <Header title="Trust Thermometer" logo={require('../../../assets/logo/mainlogoone.png')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.columnLeft}>
            <GlassPanel>
              <Text style={styles.panelTitle}>Historical Data</Text>
              <View style={styles.chartContainer}>
                <Text style={styles.chartLabel}>Partner A</Text>
                <LineChart />
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartLabel}>Partner B</Text>
                <LineChart />
              </View>
            </GlassPanel>
          </View>

          {/* Center Column (Thermometer) */}
          <View style={styles.columnCenter}>
            <View style={styles.thermometerContainer}>
                <View style={styles.thermometerTrack}>
                    <LinearGradient colors={['#ee2b8c', '#f093fb', '#4facfe', '#00f2fe']} style={styles.thermometerFill} />
                </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.columnRight}>
            <GlassPanel>
                <Text style={styles.panelTitle}>ANALYTICS</Text>
                <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsTitle}>Stability Boost</Text>
                    <Text style={styles.analyticsBody}>Your trust levels have shown exceptional stability over the last 48 hours.</Text>
                </View>
                <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsTitle}>Synchronization</Text>
                    <Text style={styles.analyticsBody}>Partner B's sentiment is aligning more closely with Partner A.</Text>
                </View>
            </GlassPanel>
          </View>
        </View>
      </ScrollView>
      <GlobalMarcieOverlay quote="Let's see where your trust levels are today, darlings." />
    </SafeAreaView>
  );
};

const GlassPanel = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.glassPanel}>{children}</View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120810' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  grid: { flexDirection: 'row', gap: 20 },
  columnLeft: { flex: 1 },
  columnCenter: { flex: 0.5, alignItems: 'center' },
  columnRight: { flex: 1 },
  panelTitle: {
    fontFamily: 'BarbieDream-Regular',
    color: '#33DEA5',
    fontSize: 16,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  chartContainer: { marginBottom: 20 },
  chartLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },
  thermometerContainer: {
      height: '80%',
      width: 40,
      justifyContent: 'flex-end',
  },
  thermometerTrack: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  thermometerFill: {
      height: '80%', // This will be dynamic based on the trust_thermometer value
      width: '100%',
  },
  analyticsItem: { marginBottom: 20 },
  analyticsTitle: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#FA1F63',
    fontSize: 16,
    marginBottom: 5,
  },
  analyticsBody: {
    fontFamily: 'SweetPink-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  glassPanel: {
    backgroundColor: 'rgba(92, 20, 89, 0.2)', // #5C1459 with opacity
    borderColor: 'rgba(250, 31, 99, 0.3)', // #FA1F63 with opacity
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
});

export default TrustThermometerScreen;
