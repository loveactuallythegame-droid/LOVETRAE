
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const resources = [
    { 
        title: '988 Suicide & Crisis Lifeline',
        description: 'Free, confidential support available 24/7.',
        action: 'Call 988',
        onPress: () => Linking.openURL('tel:988'),
        icon: '📞',
        color: '#FF4081'
    },
    {
        title: 'Domestic Violence Hotline',
        description: 'Safety planning and crisis intervention.',
        action: 'Call 1-800-799-7233',
        onPress: () => Linking.openURL('tel:1-800-799-7233'),
        icon: '🛡️',
        color: '#E040FB'
    },
    {
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 to connect with a counselor.',
        action: 'Text HOME to 741741',
        onPress: () => Linking.openURL('sms:741741'),
        icon: '💬',
        color: '#00FFFF'
    }
];

const ResourceCard = ({ title, description, action, onPress, icon, color }) => (
    <View style={[styles.card, {borderColor: color}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16}}>
            <Text style={{fontSize: 28}}>{icon}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardDescription}>{description}</Text>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: color}]} onPress={onPress}>
            <Text style={styles.actionButtonText}>{action}</Text>
        </TouchableOpacity>
    </View>
);

const CrisisResourcesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>IMMEDIATE HELP</Text>
                        <Text style={styles.headerSubtitle}>If you are in danger, call 911. Your safety is the priority.</Text>
                    </View>

                    {resources.map((res, index) => <ResourceCard key={index} {...res} />)}

                    <TouchableOpacity style={styles.safetyExitButton}>
                        <Text style={{fontSize: 20}}>🚪</Text>
                        <Text style={styles.safetyExitText}>QUICK EXIT</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollView: { padding: 24 },
    header: { marginBottom: 24, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', textAlign: 'center', marginTop: 8 },
    card: { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20, 
        marginBottom: 16, 
        borderLeftWidth: 4, 
    },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    cardDescription: { color: '#D1C4E9', marginBottom: 20, lineHeight: 20 },
    actionButton: { padding: 14, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    safetyExitButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8, 
        marginTop: 16, 
        padding: 14, 
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)'
    },
    safetyExitText: { color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' },
});

export default CrisisResourcesScreen;
