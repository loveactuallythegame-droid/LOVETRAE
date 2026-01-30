
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg'; // Using Svg for clickable zones
import { LinearGradient } from 'expo-linear-gradient';

const consentColors = {
    yes: '#22c55e',
    maybe: '#eab308',
    no: '#ef4444',
};

const frontZones = [
    { id: 'f_head', shape: 'Circle', args: { cx: '50%', cy: '15%', r: '10%' } },
    { id: 'f_torso', shape: 'Rect', args: { x: '30%', y: '25%', width: '40%', height: '30%' } },
    { id: 'f_l_arm', shape: 'Rect', args: { x: '15%', y: '27%', width: '15%', height: '25%' } },
    { id: 'f_r_arm', shape: 'Rect', args: { x: '70%', y: '27%', width: '15%', height: '25%' } },
    { id: 'f_legs', shape: 'Rect', args: { x: '30%', y: '55%', width: '40%', height: '40%' } },
];

const backZones = [
    { id: 'b_head', shape: 'Circle', args: { cx: '50%', cy: '15%', r: '10%' } },
    { id: 'b_back', shape: 'Rect', args: { x: '30%', y: '25%', width: '40%', height: '30%' } },
];

const Zone = ({ zone, color, onPress }) => {
    const Component = zone.shape === 'Circle' ? Circle : Rect;
    return (
        <TouchableOpacity onPress={onPress}>
            <Component {...zone.args} fill={color} opacity="0.4" />
        </TouchableOpacity>
    );
};


const TouchMapPreferenceGame1 = () => {
    const [selectedColor, setSelectedColor] = useState(consentColors.yes);
    const [zoneColors, setZoneColors] = useState({});

    const handleZonePress = (zoneId) => {
        setZoneColors(prev => ({ ...prev, [zoneId]: selectedColor }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#141118', '#2a0a4d']} style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Define Your Boundaries</Text>
                    <Text style={styles.subtitle}>Select a color, then tap to mark your preference.</Text>
                    
                    <View style={styles.mapArea}>
                        <View style={styles.silhouetteContainer}>
                             <Text style={styles.mapLabel}>FRONT</Text>
                             <Svg width="100%" height="100%">
                                <Image href={{'uri':'https://lh3.googleusercontent.com/aida-public/AB6AXuB2UWKyEDKbKyVg29sz0dwSPUvtT-pHdFj4Mxs_2m5WW3XLo7sKVY0qzq6wO4DAe0A7Jm7azxrR8FH5uLcFi0YHeeYug8eBWN9DoYQRsjzbFnxzcAlXctQXto_OvBhbU6cau0gq5CVkYSs-gB00-veE9s9-aVSHsPp2_3LS4Hi_M99HFeexBFujBEwKilYfxc64dnIq8699e8EypubyiJ2c5MccVr5rq21Qg8PsNAtfqj-PTPbWxmv6odjrBaLc8oz6AbelrekwjPzB'}} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" opacity="0.7"/>
                                {frontZones.map(zone => <Zone key={zone.id} zone={zone} color={zoneColors[zone.id] || 'transparent'} onPress={() => handleZonePress(zone.id)} />)}
                            </Svg>
                        </View>
                        <View style={styles.silhouetteContainer}>
                             <Text style={styles.mapLabel}>BACK</Text>
                             <Svg width="100%" height="100%">
                                 <Image href={{'uri':'https://lh3.googleusercontent.com/aida-public/AB6AXuDyzBgbsINisi-F2bwWogMl_RNPBRSPa-2YjgenFL5wxbHylYe_9yYGfNjlRCeSx2cl1XSjBd7G4y4g5_o2po9rQsjQE-5KggQmP2THDgBnGiz6hYaYy5F-9MfEjc4b5pOpXQZB86i8NusC-4EouHtvcoSeJ007O5M8mS398zWuXH7Q0mvf_-ahAmQaP49DmfUbHNdx-A81RdvAzSPjhRB-Ns0o-bFOSQ-9BRrlWdLEyf8FSaj-I6NAwRMOf55_vvaPNhlU_NbxVVRl'}} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" opacity="0.7"/>
                                {backZones.map(zone => <Zone key={zone.id} zone={zone} color={zoneColors[zone.id] || 'transparent'} onPress={() => handleZonePress(zone.id)} />)}
                            </Svg>
                        </View>
                    </View>
                    
                    <View style={styles.palette}>
                        <TouchableOpacity style={[styles.paletteButton, { backgroundColor: `${consentColors.yes}30` }]} onPress={() => setSelectedColor(consentColors.yes)}><Text style={styles.paletteText}>YES</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.paletteButton, { backgroundColor: `${consentColors.maybe}30` }]} onPress={() => setSelectedColor(consentColors.maybe)}><Text style={styles.paletteText}>MAYBE</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.paletteButton, { backgroundColor: `${consentColors.no}30` }]} onPress={() => setSelectedColor(consentColors.no)}><Text style={styles.paletteText}>NO</Text></TouchableOpacity>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#141118' },
    container: { flex: 1, padding: 16 },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#ab9db9', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    mapArea: { flexDirection: 'row', justifyContent: 'space-around', height: 400, marginBottom: 20 },
    silhouetteContainer: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
    mapLabel: { color: '#ab9db9', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 2 },
    palette: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    paletteButton: { flex: 1, paddingVertical: 15, borderRadius: 15, margin: 4, alignItems: 'center' },
    paletteText: { color: '#fff', fontWeight: 'bold' },
});

export default TouchMapPreferenceGame1;
