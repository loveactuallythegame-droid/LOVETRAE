
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const MemoryLaneMapGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#191022', '#2d1b4e']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>The Memory Prompt</Text>
                    <Text style={styles.promptText}>Where was your first kiss?</Text>
                </View>

                <View style={styles.mapContainer}>
                    <ImageBackground
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTUfesGcj6qwvejrCzaByvrDgq98cS2zEIqq8xv5mlO3VxJ0yRDQ8X_SnK0ebV45nUCHkGu4bKrBPmQCa8A2CTWkbHfx16xMgjfW_FXpZR5RTY08H-d3rgRi8lrJTZD690QKMWHfSnXDJYEqSwOwZAPx2LiBBYUprHgY_BvbsktISiCffV2XHagkTIa61eallZYiAj829s8m2xibKQUVPMxe5kctQcONo667ceVnj849U662UH-Y3bLHU6q2YkegYz0SUMQC85LPrg' }}
                        style={styles.mapBackground}
                        imageStyle={{ opacity: 0.6 }}
                    >
                        <View style={styles.marker1}>
                            <MaterialIcons name="favorite" size={24} color="white" />
                        </View>
                        <View style={styles.marker2}>
                            <MaterialIcons name="favorite" size={24} color="white" />
                        </View>
                        <View style={styles.proximityLine} />
                        <Text style={styles.distanceText}>0.5 MILES</Text>
                    </ImageBackground>
                </View>

                <View style={styles.resultCard}>
                    <View>
                        <Text style={styles.resultTitle}>98% Match</Text>
                        <Text style={styles.resultSubtitle}>You were only 0.5 miles apart!</Text>
                    </View>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Next Memory</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    header: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerText: { color: '#ff005e', textTransform: 'uppercase', fontWeight: 'bold' },
    promptText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
    mapContainer: { height: 300, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    mapBackground: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    marker1: { position: 'absolute', left: '35%', top: '55%', backgroundColor: '#ff005e', padding: 8, borderRadius: 99, shadowColor: '#ff005e', shadowRadius: 10, shadowOpacity: 1 },
    marker2: { position: 'absolute', left: '60%', top: '45%', backgroundColor: '#ec4899', padding: 8, borderRadius: 99, shadowColor: '#ec4899', shadowRadius: 10, shadowOpacity: 1 },
    proximityLine: { position: 'absolute', width: '30%', height: 4, backgroundColor: '#7f13ec', transform: [{ rotate: '-15deg' }] },
    distanceText: { position: 'absolute', top: '40%', backgroundColor: '#FFF', color: '#000', padding: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
    resultCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', padding: 16, borderRadius: 12, marginTop: 16, borderWidth: 1, borderColor: '#ff005e' },
    resultTitle: { color: '#ff005e', fontSize: 24, fontWeight: 'bold' },
    resultSubtitle: { color: 'rgba(255,255,255,0.6)' },
    nextButton: { backgroundColor: '#ff005e', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 99 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default MemoryLaneMapGame;
