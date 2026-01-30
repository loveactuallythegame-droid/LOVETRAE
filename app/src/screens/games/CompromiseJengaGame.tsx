
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const initialTower = [
    ['Respect Space', 'Daily Check-in', 'Date Nights'],
    ['Laundry Duty Share', 'Holiday Rotation'],
    ['Therapy Sat', null, 'Quiet Time'],
    ['No Work After 7PM', 'Trash Tuesday'],
    [null, 'Netflix Choice', 'Gym Partner']
];

const JengaBlock = ({ text }: { text: string | null }) => (
    <View style={[styles.jengaBlock, !text && styles.emptyBlock]}>
        {text && <Text style={styles.blockText}>{text}</Text>}
    </View>
);

const CompromiseJengaGameScreen = () => {
    const [tower, setTower] = useState(initialTower);
    const [stability, setStability] = useState(75);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#101322', '#221017']} style={styles.background} />
            <Header title="Compromise Jenga" />
            <View style={styles.gameLayout}>
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Compromise Warehouse</Text>
                    {/* Placeholder for draggable blocks */}
                </View>
                <ScrollView contentContainerStyle={styles.gameStage}>
                    <View style={styles.stabilityMeter}>
                        <Text style={styles.meterTitle}>STABILITY: {stability}%</Text>
                        <View style={styles.meterBar}><View style={{width: `${stability}%`, height: '100%', backgroundColor: '#f40b61'}}/></View>
                    </View>

                    <View style={styles.towerContainer}>
                        {tower.map((layer, i) => (
                            <View key={i} style={styles.towerLayer}>
                                {layer.map((block, j) => <JengaBlock key={j} text={block} />)}
                            </View>
                        ))}
                         <View style={styles.dropZone}>
                            <Text style={styles.dropZoneText}>Drop Block Here</Text>
                        </View>
                    </View>

                    <View style={styles.hostContainer}>
                        <Text style={styles.hostQuote}>"Gravity always wins... and so does resentment if you aren't careful with your foundation!"</Text>
                        <Text style={styles.hostName}>- Dr. Marcie Liss</Text>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101322' },
    background: { ...StyleSheet.absoluteFillObject },
    gameLayout: { flexDirection: 'row', flex: 1 },
    sidebar: { width: 200, backgroundColor: 'rgba(34,16,23,0.4)', padding: 15 },
    sidebarTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF' },
    gameStage: { flex: 1, padding: 20, alignItems: 'center' },
    stabilityMeter: { width: '90%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 15, marginBottom: 30 },
    meterTitle: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16, textAlign: 'center' },
    meterBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, marginTop: 5 },
    towerContainer: { width: '80%', alignItems: 'center' },
    towerLayer: { flexDirection: 'row', marginBottom: 5, justifyContent: 'center' },
    jengaBlock: { 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.2)', 
        borderRadius: 8,
        height: 40,
        flex: 1,
        marginHorizontal: 2,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 5
    },
    emptyBlock: { backgroundColor: 'transparent', borderColor: 'transparent' },
    blockText: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 10, textAlign: 'center', textTransform: 'uppercase' },
    dropZone: { height: 50, width: '60%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    dropZoneText: { color: 'rgba(255,255,255,0.3)', fontFamily: 'SweetPink-Regular', textTransform: 'uppercase' },
    hostContainer: { position: 'absolute', bottom: 20, left: 20, width: '45%', backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 },
    hostQuote: { fontFamily: 'SweetPink-Regular', color: '#FFF', fontStyle: 'italic', fontSize: 13 },
    hostName: { fontFamily: 'SweetPink-Regular', color: '#ff2d55', textAlign: 'right', marginTop: 5, textTransform: 'uppercase' }
});

export default CompromiseJengaGameScreen;
