
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
    {
        icon: '✨',
        color: '#FFD700',
        title: "NEW 'DEEP CONNECTION' DECK",
        description: 'Discover 50+ new questions for intimate evenings and meaningful talks.'
    },
    {
        icon: '🎨',
        color: '#FF4081',
        title: 'LUMINOUS UI ENHANCEMENTS',
        description: 'Complete visual overhaul with modern cosmic gradients and smoother flow.'
    },
    {
        icon: '🔄',
        color: '#00FFFF',
        title: 'IMPROVED SYNC FOR COUPLES',
        description: 'Real-time response tracking and shared progress insights.'
    }
];

const FeatureItem = ({ feature }) => (
    <View style={styles.featureItem}>
        <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
            <Text style={{fontSize: 24}}>{feature.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
    </View>
);

const UpdateRequired = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.card}>
                        <Text style={styles.headerTitle}>A NEW CHAPTER AWAITS</Text>
                        <Text style={styles.headerSubtitle}>UPDATE REQUIRED: VERSION 2.4 IS NOW AVAILABLE</Text>

                        <Text style={styles.sectionHeader}>WHAT'S NEW IN 2.4</Text>
                        
                        <View style={styles.featuresList}>
                            {features.map((item, index) => <FeatureItem key={index} feature={item} />)}
                        </View>

                        <TouchableOpacity style={styles.updateButton}>
                            <Text style={{fontSize: 24}}>🚀</Text>
                            <Text style={styles.updateButtonText}>UPDATE NOW</Text>
                        </TouchableOpacity>
                        <Text style={styles.patchNotes}>VIEW PATCH NOTES</Text>
                        <Text style={styles.updateDetails}>ESTIMATED SIZE: 45MB</Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    sectionHeader: { color: '#fff', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
    featuresList: { marginBottom: 24 },
    featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12, marginBottom: 8 },
    featureIconContainer: { width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    featureTitle: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    featureDescription: { color: '#D1C4E9', fontSize: 12, marginTop: 2 },
    updateButton: { flexDirection: 'row', backgroundColor: '#FF4081', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    updateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8, textTransform: 'uppercase' },
    patchNotes: { color: '#D1C4E9', textAlign: 'center', textDecorationLine: 'underline', fontWeight: 'bold', textTransform: 'uppercase' },
    updateDetails: { color: '#D1C4E9', fontSize: 12, textAlign: 'center', marginTop: 4, opacity: 0.7 }
});

export default UpdateRequired;
