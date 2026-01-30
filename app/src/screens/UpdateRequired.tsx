
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const features = [
    {
        icon: 'star',
        color: '#facc15',
        title: "New 'Deep Connection' Deck",
        description: 'Discover 50+ new questions for intimate evenings and meaningful talks.'
    },
    {
        icon: 'auto-awesome',
        color: '#fc0c84',
        title: 'Luminous UI Enhancements',
        description: 'Complete visual overhaul with modern cosmic gradients and smoother flow.'
    },
    {
        icon: 'sync-alt',
        color: '#3b82f6',
        title: 'Improved Sync for Couples',
        description: 'Real-time response tracking and shared progress insights.'
    }
];

const FeatureItem = ({ feature }) => (
    <View style={styles.featureItem}>
        <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
            <MaterialIcons name={feature.icon} size={24} color={feature.color} />
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
            <LinearGradient colors={['#181411', '#230f19']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.card}>
                        <Text style={styles.headerTitle}>A New Chapter Awaits</Text>
                        <Text style={styles.headerSubtitle}>Update Required: Version 2.4 is now available</Text>

                        <Text style={styles.sectionHeader}>What's New in 2.4</Text>
                        
                        <View style={styles.featuresList}>
                            {features.map((item, index) => <FeatureItem key={index} feature={item} />)}
                        </View>

                        <TouchableOpacity style={styles.updateButton}>
                            <MaterialIcons name="download" size={24} color="#230f19" />
                            <Text style={styles.updateButtonText}>Update Now</Text>
                        </TouchableOpacity>
                        <Text style={styles.patchNotes}>View Patch Notes</Text>
                        <Text style={styles.updateDetails}>Estimated size: 45MB</Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181411' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#221910', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#393028' },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { color: '#baab9c', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    sectionHeader: { color: '#fff', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
    featuresList: { marginBottom: 24 },
    featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(35,15,22,0.5)', borderRadius: 8, padding: 12, marginBottom: 8 },
    featureIconContainer: { width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    featureTitle: { color: '#fff', fontWeight: '600' },
    featureDescription: { color: '#baab9c', fontSize: 12, marginTop: 2 },
    updateButton: { flexDirection: 'row', backgroundColor: '#fc0c84', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    updateButtonText: { color: '#230f19', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    patchNotes: { color: '#baab9c', textAlign: 'center', textDecorationLine: 'underline' }, 
    updateDetails: { color: '#5e544c', fontSize: 12, textAlign: 'center', marginTop: 4 }
});

export default UpdateRequired;
