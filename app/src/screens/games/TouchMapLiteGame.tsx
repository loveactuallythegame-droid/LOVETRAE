
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const BodyPart = ({ part, color, onPress }) => {
    const components = {
        head: <Circle cx="100" cy="40" r="30" />,
        torso: <Path d="M70 80 L130 80 L140 220 L60 220 Z" />,
        l_shoulder: <Circle cx="60" cy="90" r="15" />,
        r_shoulder: <Circle cx="140" cy="90" r="15" />,
        l_leg: <Path d="M70 230 L95 230 L90 380 L60 380 Z" />,
        r_leg: <Path d="M105 230 L130 230 L140 380 L110 380 Z" />,
        l_hand: <Circle cx="40" cy="180" r="12" />,
        r_hand: <Circle cx="160" cy="180" r="12" />
    }
    return (
        <TouchableOpacity onPress={() => onPress(part)}>
            {React.cloneElement(components[part], { fill: color, stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 })}
        </TouchableOpacity>
    )
}

const TouchMapLiteGame = () => {
    const [activeColor, setActiveColor] = useState('rgba(0,255,0,0.4)');
    const [userMap, setUserMap] = useState({ head: 'rgba(255,255,255,0.1)' }); // Initial empty state
    const partnerMap = {
        head: 'rgba(0,255,0,0.4)', torso: 'rgba(255,0,0,0.4)', l_shoulder: 'rgba(0,255,0,0.4)', r_shoulder: 'rgba(0,255,0,0.4)', 
        l_leg: 'rgba(255,0,0,0.4)', r_leg: 'rgba(255,0,0,0.4)', l_hand: 'rgba(255,0,0,0.4)', r_hand: 'rgba(255,0,0,0.4)'
    };
    const bodyParts = Object.keys(partnerMap);

    const handlePartPress = (part) => {
        setUserMap(prev => ({ ...prev, [part]: activeColor }));
    }
    
    const mismatches = Object.keys(userMap).filter(part => userMap[part] && userMap[part] !== partnerMap[part]).length;
    const syncRate = Math.round(((bodyParts.length - mismatches) / bodyParts.length) * 100);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#191022', '#230f15']} style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Touch Map Lite</Text>
                    <Text style={styles.subtitle}>Where is it okay to touch?</Text>

                    <View style={styles.colorSelector}>
                         <TouchableOpacity onPress={() => setActiveColor('rgba(0,255,0,0.4)')} style={[styles.selectorButton, {backgroundColor: '#2e7d32'}]}><Text style={styles.selectorText}>Safe</Text></TouchableOpacity>
                         <TouchableOpacity onPress={() => setActiveColor('rgba(255,255,0,0.4)')} style={[styles.selectorButton, {backgroundColor: '#f57f17'}]}><Text style={styles.selectorText}>Caution</Text></TouchableOpacity>
                         <TouchableOpacity onPress={() => setActiveColor('rgba(255,0,0,0.4)')} style={[styles.selectorButton, {backgroundColor: '#c62828'}]}><Text style={styles.selectorText}>Off-limits</Text></TouchableOpacity>
                    </View>

                    <View style={styles.mapsContainer}>
                        <View style={styles.mapCard}>
                            <Text style={styles.mapTitle}>Your Map</Text>
                            <Svg height="300" width="150" viewBox="0 0 200 400">
                                {bodyParts.map(part => <BodyPart key={part} part={part} color={userMap[part] || 'rgba(255,255,255,0.1)'} onPress={handlePartPress} />)}
                            </Svg>
                        </View>
                        <View style={styles.mapCard}>
                            <Text style={styles.mapTitle}>Partner's Map</Text>
                            <Svg height="300" width="150" viewBox="0 0 200 400">
                                {bodyParts.map(part => <BodyPart key={part} part={part} color={partnerMap[part]} onPress={() => {}} />)}
                            </Svg>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                         <View style={styles.statBox}><Text style={styles.statLabel}>Sync Rate</Text><Text style={styles.statValue}>{syncRate}%</Text></View>
                         <View style={styles.statBox}><Text style={styles.statLabel}>Mismatches</Text><Text style={[styles.statValue, {color: '#ff8c00'}]}>{mismatches}</Text></View>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#191022' },
    container: { flex: 1, padding: 16 },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#fff', opacity: 0.6, fontSize: 16, textAlign: 'center', marginBottom: 20 },
    colorSelector: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 6, marginBottom: 20 },
    selectorButton: { flex: 1, padding: 10, borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
    selectorText: { color: '#fff', fontWeight: 'bold' },
    mapsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    mapCard: { backgroundColor: 'rgba(54, 35, 72, 0.4)', borderRadius: 20, padding: 16, alignItems: 'center' },
    mapTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    statBox: { backgroundColor: 'rgba(54, 35, 72, 0.4)', borderRadius: 16, padding: 16, flex: 1, marginHorizontal: 8, alignItems: 'center' },
    statLabel: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, marginBottom: 8 },
    statValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});

export default TouchMapLiteGame;
