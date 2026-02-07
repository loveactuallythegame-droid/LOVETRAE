
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const MemoryLaneMapGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>THE MEMORY PROMPT</Text>
                    <Text style={styles.promptText}>WHERE WAS YOUR FIRST KISS?</Text>
                </View>

                <View style={styles.mapContainer}>
                    <ImageBackground
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTUfesGcj6qwvejrCzaByvrDgq98cS2zEIqq8xv5mlO3VxJ0yRDQ8X_SnK0ebV45nUCHkGu4bKrBPmQCa8A2CTWkbHfx16xMgjfW_FXpZR5RTY08H-d3rgRi8lrJTZD690QKMWHfSnXDJYEqSwOwZAPx2LiBBYUprHgY_BvbsktISiCffV2XHagkTIa61eallZYiAj829s8m2xibKQUVPMxe5kctQcONo667ceVnj849U662UH-Y3bLHU6q2YkegYz0SUMQC85LPrg' }}
                        style={styles.mapBackground}
                        imageStyle={{ opacity: 0.6 }}
                    >
                        <View style={styles.marker1}>
                            <Text>❤️</Text>
                        </View>
                        <View style={styles.marker2}>
                            <Text>❤️</Text>
                        </View>
                        <View style={styles.proximityLine} />
                        <Text style={styles.distanceText}>0.5 MILES</Text>
                    </ImageBackground>
                </View>

                <View style={styles.resultCard}>
                    <View>
                        <Text style={styles.resultTitle}>98% MATCH</Text>
                        <Text style={styles.resultSubtitle}>You were only 0.5 miles apart!</Text>
                    </View>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>NEXT MEMORY</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    header: { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    headerText: { color: '#FF4081', textTransform: 'uppercase', fontWeight: 'bold' },
    promptText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 8, textTransform: 'uppercase' },
    mapContainer: { height: 300, borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    mapBackground: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    marker1: { position: 'absolute', left: '35%', top: '55%', backgroundColor: '#FF4081', padding: 8, borderRadius: 99, shadowColor: '#FF4081', shadowRadius: 10, shadowOpacity: 1 },
    marker2: { position: 'absolute', left: '60%', top: '45%', backgroundColor: '#E040FB', padding: 8, borderRadius: 99, shadowColor: '#E040FB', shadowRadius: 10, shadowOpacity: 1 },
    proximityLine: { position: 'absolute', width: '30%', height: 4, backgroundColor: '#00FFFF', transform: [{ rotate: '-15deg' }] },
    distanceText: { position: 'absolute', top: '40%', backgroundColor: '#FFF', color: '#000', padding: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    resultCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 16, borderRadius: 20, marginTop: 16, borderWidth: 1, borderColor: '#FF4081' },
    resultTitle: { color: '#FF4081', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    resultSubtitle: { color: '#D1C4E9', fontWeight: 'bold', textTransform: 'uppercase' },
    nextButton: { backgroundColor: '#FF4081', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default MemoryLaneMapGame;
