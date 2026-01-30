
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const anatomicalZones = {
  head: "M100,20 c-15,0 -25,12 -25,25 s10,25 25,25 s25,-12 25,-25 s-10,-25 -25,-25",
  neck: "M85,72 h30 v15 h-30 z",
  torso: "M60,95 h80 l10,40 l-10,120 h-80 l-10,-120 z",
  upper_arms: "M55,100 l-25,30 l15,100 l15,-10 z M145,100 l25,30 l-15,100 l-15,-10 z",
  forearms: "M45,235 l-10,80 l15,10 l10,-80 z M155,235 l10,80 l-15,10 l-10,-80 z",
  hands: "M35,330 c-5,0 -10,10 -10,20 s10,25 20,10 l5,-25 z M165,330 c5,0 10,10 10,20 s-10,25 -20,10 l-5,-25 z",
  pelvis: "M70,260 h60 l5,40 h-70 z",
  upper_legs: "M70,305 h28 v100 h-28 z M102,305 h28 v100 h-28 z",
  lower_legs: "M70,410 h25 v70 h-25 z M105,410 h25 v70 h-25 z",
  feet: "M65,485 h30 v10 h-30 z M105,485 h30 v10 h-30 z",
};

const consentColors = {
    default: 'rgba(255, 255, 255, 0.1)',
    yes: 'rgba(16, 185, 129, 0.6)',
    maybe: 'rgba(245, 158, 11, 0.6)',
    no: 'rgba(239, 68, 68, 0.6)',
};

const partnerPrefs = { torso: 'yes', forearms: 'maybe', pelvis: 'no' };

const TouchMapPreferenceGame2 = () => {
    const [zoneColors, setZoneColors] = useState({});
    const [activeColor, setActiveColor] = useState('yes');
    const [compare, setCompare] = useState(false);

    const handleZonePress = (zoneId) => {
        setZoneColors(prev => ({...prev, [zoneId]: activeColor}));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#230f18', '#191022']} style={styles.container}>
                <ScrollView contentContainerStyle={{alignItems: 'center', padding: 16}}>
                    <Text style={styles.title}>Touch Map Preference</Text>
                    <Text style={styles.subtitle}>Tap zones to communicate comfort levels.</Text>

                    <Svg height="500" width="250" viewBox="0 0 200 500">
                        {Object.entries(anatomicalZones).map(([key, d]) => (
                            <TouchableOpacity key={key} onPress={() => handleZonePress(key)}>
                                <Path 
                                    d={d} 
                                    fill={consentColors[zoneColors[key]] || consentColors.default}
                                    stroke="#13ecda" 
                                    strokeWidth="1"
                                />
                           </TouchableOpacity>
                        ))}
                         {compare && Object.entries(partnerPrefs).map(([key, pref]) => (
                            <Path key={`${key}-partner`} d={anatomicalZones[key]} fill="none" stroke={consentColors[pref]} strokeWidth="2" strokeDasharray="4, 4" />
                        ))}
                    </Svg>
                    
                    <View style={styles.controls}>
                         <View style={styles.legend}>
                            <TouchableOpacity onPress={() => setActiveColor('yes')} style={[styles.legendItem, styles.yesBorder]}><View style={[styles.legendColor, styles.yesBG]} /><Text style={styles.legendText}>Yes</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveColor('maybe')} style={[styles.legendItem, styles.maybeBorder]}><View style={[styles.legendColor, styles.maybeBG]} /><Text style={styles.legendText}>Maybe</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveColor('no')} style={[styles.legendItem, styles.noBorder]}><View style={[styles.legendColor, styles.noBG]} /><Text style={styles.legendText}>No</Text></TouchableOpacity>
                        </View>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Compare Maps</Text>
                            <Switch value={compare} onValueChange={setCompare} trackColor={{false: '#767577', true: '#ff006d'}} thumbColor={'#f4f3f4'} />
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#230f18' },
    container: { flex: 1 },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    controls: { width: '100%', padding: 20, backgroundColor: 'rgba(16, 34, 32, 0.8)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(19, 236, 218, 0.2)' },
    legend: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, borderWidth: 1}, 
    legendColor: { width: 20, height: 20, borderRadius: 5, marginRight: 8 },
    legendText: { color: '#fff', fontWeight: 'bold' },
    yesBG: { backgroundColor: consentColors.yes },
    maybeBG: { backgroundColor: consentColors.maybe },
    noBG: { backgroundColor: consentColors.no },
    yesBorder: { borderColor: consentColors.yes },
    maybeBorder: { borderColor: consentColors.maybe },
    noBorder: { borderColor: consentColors.no },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    switchLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default TouchMapPreferenceGame2;
