
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const MemoryLaneGpsGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#221016', '#331922']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Current Mission: Best fight-turned-hug</Text>
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
                                <MaterialIcons name="favorite" size={36} color="#FFF" />
                            </View>
                            <Text style={styles.pinLabel}>The Spot</Text>
                        </View>

                         <View style={styles.mapSearchContainer}>
                            <MaterialIcons name="search" size={24} color="#ff034a" />
                            <TextInput placeholder="Search the location..." placeholderTextColor="rgba(255,255,255,0.3)" style={styles.mapSearchInput} />
                        </View>

                    </ImageBackground>
                </View>

                <View style={styles.sidebar}>
                    <View style={styles.narratorContainer}>
                        <Text style={styles.narratorTitle}>GPS Narrator</Text>
                        <Text style={styles.narratorText}>"Drop your heart pin exactly where the sparks flew after the storm."</Text>
                    </View>

                    <Text style={styles.previewTitle}>Memory Preview</Text>
                    <ImageBackground 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxsKxglf4x4FqmlvGhYP4OdFnNGT-VdE5tuXbpOScrzQ6zoitzu1rXz1x5mjdfmukqCGzzsNZ6oPjfPqpErXykbv8axx0ttar9ubV31B1-HjOVmI-1Qg_YJNhWNCzM0FFnrBhS4tJy4GNZ2bhchfZ1q18cPpCRTNWAwTksFDJPnFxz9L1wW3hSTBtWajUlk8c-b-mpuCgaP3RHyYMrgOebekTIj5caSXl5vW_3RER8t7ckp56PbrrMeFay9LELAIxfgpSS0zeO0NpV'}}
                        style={styles.previewImage}
                        imageStyle={{ borderRadius: 24 }}
                    >
                        <TouchableOpacity style={styles.uploadButton}>
                            <MaterialIcons name="cloud-upload" size={24} color="#ff034a" />
                            <Text style={styles.uploadText}>Replace Photo</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={styles.skipButtonText}>Skip Landmark</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f15' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { paddingBottom: 24 },
    header: { padding: 16, alignItems: 'center', backgroundColor: 'rgba(255,3,74,0.2)', borderRadius: 16, margin: 16 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    mapContainer: { height: 400, marginHorizontal: 16, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    mapBackground: { flex: 1 },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(34,16,22,0.5)' },
    heartPinContainer: { position: 'absolute', top: '50%', left: '33%', alignItems: 'center' },
    heartPulse: { backgroundColor: '#ff034a', padding: 12, borderRadius: 99, shadowColor: '#ff034a', shadowRadius: 10, shadowOpacity: 0.7 },
    pinLabel: { marginTop: 8, backgroundColor: '#ff034a', color: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 10, fontWeight: 'bold' },
    mapSearchContainer: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(35,15,21,0.9)', paddingHorizontal: 16, borderRadius: 99, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    mapSearchInput: { flex: 1, color: '#FFF', marginLeft: 8, paddingVertical: 12 },
    sidebar: { padding: 16, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 16 },
    narratorContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 16 },
    narratorTitle: { color: '#ff034a', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 10, marginBottom: 4 },
    narratorText: { color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' },
    previewTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    previewImage: { height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', borderRadius: 24 },
    uploadButton: { backgroundColor: 'rgba(35,15,21,0.8)', padding: 16, borderRadius: 16, alignItems: 'center' },
    uploadText: { color: '#ff034a', marginTop: 8 },
    confirmButton: { backgroundColor: '#ff034a', padding: 16, borderRadius: 99, alignItems: 'center', marginTop: 16 },
    confirmButtonText: { color: '#FFF', fontWeight: 'bold' },
    skipButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 99, alignItems: 'center', marginTop: 8 },
    skipButtonText: { color: 'rgba(255,255,255,0.7)' },
});

export default MemoryLaneGpsGame;
