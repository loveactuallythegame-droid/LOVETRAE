import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.jengaBlock, !text && styles.emptyBlock]}
    >
        {text && <Text style={styles.blockText}>{text}</Text>}
    </LinearGradient>
);

const CompromiseJengaGameScreen = () => {
    const [tower, setTower] = useState(initialTower);
    const [stability, setStability] = useState(75);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#101322', '#221017']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Build a compromise tower! Stack concessions to create a stable solution together.</Text>
                </View>
            </View>
            
            <Header title="Compromise Jenga" />
            <View style={styles.gameLayout}>
                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sidebar}
                >
                    <Text style={styles.sidebarTitle}>Compromise Warehouse</Text>
                    {/* Placeholder for draggable blocks */}
                </LinearGradient>
                <ScrollView contentContainerStyle={styles.gameStage}>
                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.stabilityMeter}
                    >
                        <Text style={styles.meterTitle}>STABILITY: {stability}%</Text>
                        <View style={styles.meterBar}>
                            <LinearGradient 
                                colors={['#db147c', '#f05d68']} 
                                style={{width: `${stability}%`, height: '100%'}} 
                            />
                        </View>
                    </LinearGradient>

                    <View style={styles.towerContainer}>
                        {tower.map((layer, i) => (
                            <View key={i} style={styles.towerLayer}>
                                {layer.map((block, j) => <JengaBlock key={j} text={block} />)}
                            </View>
                        ))}
                         <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.dropZone}
                         >
                            <Text style={styles.dropZoneText}>Drop Block Here</Text>
                        </LinearGradient>
                    </View>

                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hostContainer}
                    >
                        <Text style={styles.hostQuote}>"Gravity always wins... and so does resentment if you aren't careful with your foundation!"</Text>
                        <Text style={styles.hostName}>- Dr. Marcie Liss</Text>
                    </LinearGradient>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101322' },
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
    gameLayout: { flexDirection: 'row', flex: 1 },
    sidebar: { 
        width: 200, 
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 18, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gameStage: { flex: 1, padding: 20, alignItems: 'center' },
    stabilityMeter: { 
        width: '90%', 
        borderRadius: 16, 
        padding: 15, 
        marginBottom: 30,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    meterTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 16, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    meterBar: { 
        height: 10, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 5, 
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    towerContainer: { width: '80%', alignItems: 'center' },
    towerLayer: { flexDirection: 'row', marginBottom: 5, justifyContent: 'center' },
    jengaBlock: { 
        borderRadius: 8,
        height: 40,
        flex: 1,
        marginHorizontal: 2,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    emptyBlock: { backgroundColor: 'transparent', borderColor: 'transparent' },
    blockText: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 10, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    dropZone: { 
        height: 50, 
        width: '60%', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    dropZoneText: { 
        color: '#ffffff', 
        fontFamily: 'SweetPink-Regular', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    hostContainer: { 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        width: '45%', 
        padding: 10, 
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    hostQuote: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontStyle: 'italic', 
        fontSize: 13,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 8,
    },
    hostName: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        textAlign: 'right', 
        marginTop: 5, 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    }
});

export default CompromiseJengaGameScreen;