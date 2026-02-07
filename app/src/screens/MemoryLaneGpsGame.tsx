
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const MemoryLaneGpsGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>CURRENT MISSION: BEST FIGHT-TURNED-HUG</Text>
                </View>

                <View style={styles.mapContainer}>
                    <ImageBackground 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR1b8e3OCD6y_5rX2wJgLSWQep4pLH7MsydNBV1BqByA2m4OhiBTBt4x4mdb5fSK0Q0gVAF5t2KD8LYQUkt3MyvmIhMUAZSHf_9ZqVctTgTiyTdO_i_TagscVjCWa2bQ7jqgeoGpGxZhhMoeOUN37yIBku6Pg51bxk156JWrMGigLV4FAT7lAwSTsobyX-MycnvomlENz6W2lpIH5vxd_r-6bjF-P8a_tgnSKsRFDuroE7gUkt04iAtRwv-0FFGGtpxbjpN1Oic0CS' }}
                        style={styles.mapBackground}
                        imageStyle={{ opacity: 0.6 }}
                    >
                         <View style={styles.mapOverlay} />
                         <View style={styles.heartPinContainer}>
                            <View style={styles.heartPulse}>
                                <Text>❤️</Text>
                            </View>
                            <Text style={styles.pinLabel}>THE SPOT</Text>
                        </View>

                         <View style={styles.mapSearchContainer}>
                            <Text>🔍</Text>
                            <TextInput placeholder="SEARCH THE LOCATION..." placeholderTextColor="#D1C4E9" style={styles.mapSearchInput} />
                        </View>

                    </ImageBackground>
                </View>

                <View style={styles.sidebar}>
                    <View style={styles.narratorContainer}>
                        <Text style={styles.narratorTitle}>GPS NARRATOR</Text>
                        <Text style={styles.narratorText}>"Drop your heart pin exactly where the sparks flew after the storm."</Text>
                    </View>

                    <Text style={styles.previewTitle}>MEMORY PREVIEW</Text>
                    <ImageBackground 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxsKxglf4x4FqmlvGhYP4OdFnNGT-VdE5tuXbpOScrzQ6zoitzu1rXz1x5mjdfmukqCGzzsNZ6oPjfPqpErXykbv8axx0ttar9ubV31B1-HjOVmI-1Qg_YJNhWNCzM0FFnrBhS4tJy4GNZ2bhchfZ1q18cPpCRTNWAwTksFDJPnFxz9L1wW3hSTBtWajUlk8c-b-mpuCgaP3RHyYMrgOebekTIj5caSXl5vW_3RER8t7ckp56PbrrMeFay9LELAIxfgpSS0zeO0NpV'}}
                        style={styles.previewImage}
                        imageStyle={{ borderRadius: 24 }}
                    >
                        <TouchableOpacity style={styles.uploadButton}>
                            <Text style={{fontSize: 24}}>☁️</Text>
                            <Text style={styles.uploadText}>REPLACE PHOTO</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>CONFIRM LOCATION</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={styles.skipButtonText}>SKIP LANDMARK</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { paddingBottom: 24 },
    header: { padding: 16, alignItems: 'center', backgroundColor: 'rgba(255, 64, 129, 0.2)', borderRadius: 16, margin: 16 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    mapContainer: { height: 400, marginHorizontal: 16, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    mapBackground: { flex: 1 },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    heartPinContainer: { position: 'absolute', top: '50%', left: '33%', alignItems: 'center' },
    heartPulse: { backgroundColor: '#FF4081', padding: 12, borderRadius: 99, shadowColor: '#FF4081', shadowRadius: 10, shadowOpacity: 0.7 },
    pinLabel: { marginTop: 8, backgroundColor: '#FF4081', color: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    mapSearchContainer: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, borderRadius: 99, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    mapSearchInput: { flex: 1, color: '#FFF', marginLeft: 8, paddingVertical: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    sidebar: { padding: 16, borderTopWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', marginTop: 16 },
    narratorContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    narratorTitle: { color: '#FF4081', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 10, marginBottom: 4 },
    narratorText: { color: '#D1C4E9', fontStyle: 'italic' },
    previewTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    previewImage: { height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255, 64, 129, 0.5)', borderStyle: 'dashed', borderRadius: 24 },
    uploadButton: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 16, alignItems: 'center' },
    uploadText: { color: '#FF4081', marginTop: 8, fontWeight: 'bold', textTransform: 'uppercase' },
    confirmButton: { backgroundColor: '#FF4081', padding: 16, borderRadius: 99, alignItems: 'center', marginTop: 16 },
    confirmButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    skipButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 99, alignItems: 'center', marginTop: 8 },
    skipButtonText: { color: '#D1C4E9', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default MemoryLaneGpsGame;
